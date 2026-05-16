/**
 * Normaliza as tags do OpenAPI antes do Orval gerar o cliente.
 * - Remove acentos e normaliza slugs
 * - Aplica aliases para casar com a estrutura preexistente
 * - Limpa schemas: remove union members sem keywords de schema válidas
 * - Campos UUID com pattern: garante type: "string" para evitar union members vazios
 */

const TAG_ALIASES = {
  "usuarios": "usuarios",
  "comunidades": "comunidades",
  "papeis": "papeis",
  "definicoes": "definicoes",
  "termos": "definicoes",
  "kpis": "kpis",
  "processos": "processos",
  "politicas-internas": "politicas-internas",
  "atribuicoes-papel-dominio": "atribuicoes",
  "necessidades-de-informacao": "necessidades-informacao",
  "regras-de-negocio": "regras-negocio",
  "regras-de-qualidade": "regras-qualidade",
  "dimensoes-de-qualidade": "dimensoes-qualidade",
  "classificacoes-de-informacao": "classificacoes-informacao",
  "listas-de-classificacao": "listas-classificacao",
  "listas-de-referencia": "listas-referencia",
  "tipos-de-dados": "tipos-dados",
  "produtos-de-dados": "produtos-dados",
  "bancos-de-dados": "bancos",
  "sistemas": "sistemas",
  "tabelas": "tabelas",
  "colunas": "colunas",
  "documentos-polimorficos": "documentos",
  "documentos-repositorio": "documentos-repositorio",
  "repositorios-de-documento": "repositorios-documento",
  "regulacoes-completas": "regulacao",
  "criticidades-regulatorias": "criticidade-regulatoria",
  "comites-aprovadores": "comites-aprovadores",
  "partes-envolvidas": "partes-envolvidas",
  "atividades": "atividades",
  "operacoes": "operacoes",
  "auditoria": "auditoria",
  "dashboard": "dashboard",
  "importacao-exportacao": "importacao-exportacao",
  "mfa-2fa": "mfa",
  "empresas": "empresas",
}

// Keywords que tornam um schema item válido como union member
const SCHEMA_KEYWORDS = new Set([
  'type', '$ref', 'anyOf', 'oneOf', 'allOf', 'not',
  'properties', 'additionalProperties', 'items', 'enum', 'const',
  'format', 'minimum', 'maximum', 'minLength', 'maxLength',
  'minItems', 'maxItems', 'required', 'nullable',
])

function slugify(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s/_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function normalizeTag(rawTag) {
  const slug = slugify(rawTag)
  return TAG_ALIASES[slug] ?? slug
}

function fixSchemaItem(item) {
  if (!item || typeof item !== 'object') return null

  if ('type' in item && (item.type === '' || item.type === null)) return null
  if ('$ref' in item && (item.$ref === '' || item.$ref === null)) return null

  const onlyNullEnum = Array.isArray(item.enum) && item.enum.length > 0 && item.enum.every(v => v === null)
  if (!item.type && !item.$ref && (item.nullable === true || onlyNullEnum)) {
    return { type: 'null' }
  }

  if (item.pattern && !item.type && !item.$ref && !item.anyOf && !item.oneOf && !item.allOf) {
    return { ...item, type: 'string' }
  }

  if (!Object.keys(item).some(k => SCHEMA_KEYWORDS.has(k))) return null

  return item
}

function filterAndFixUnionItems(items) {
  if (!Array.isArray(items)) return items
  const fixed = []
  for (const raw of items) {
    const item = fixSchemaItem(raw)
    if (!item) continue
    normalizeSchema(item)
    fixed.push(item)
  }
  return fixed
}

function normalizeProp(prop) {
  if (!prop || typeof prop !== 'object') return

  if (Array.isArray(prop.type)) {
    prop.type = prop.type.filter(t => t !== '' && t !== null && t !== undefined)
    if (prop.type.length === 0) delete prop.type
    else if (prop.type.length === 1) prop.type = prop.type[0]
  }

  if (Array.isArray(prop.enum)) {
    prop.enum = prop.enum.filter(e => e !== '' && e !== null && e !== undefined)
    if (prop.enum.length === 0) delete prop.enum
  }

  for (const key of ['anyOf', 'oneOf', 'allOf']) {
    if (Array.isArray(prop[key])) {
      prop[key] = filterAndFixUnionItems(prop[key])
      if (prop[key].length === 0) delete prop[key]
    }
  }
}

function normalizeSchema(schema) {
  if (!schema || typeof schema !== 'object') return

  if (schema.properties && typeof schema.properties === 'object') {
    for (const prop of Object.values(schema.properties)) {
      normalizeProp(prop)
      normalizeSchema(prop)
    }
  }

  if (schema.items) {
    normalizeProp(schema.items)
    normalizeSchema(schema.items)
  }

  for (const key of ['anyOf', 'oneOf', 'allOf']) {
    if (Array.isArray(schema[key])) {
      schema[key] = filterAndFixUnionItems(schema[key])
      if (schema[key].length === 0) delete schema[key]
    }
  }
}

function normalizeOperationSchemas(op) {
  if (!op || typeof op !== 'object') return

  const reqContent = op.requestBody?.content
  if (reqContent && typeof reqContent === 'object') {
    for (const media of Object.values(reqContent)) {
      if (media?.schema) normalizeSchema(media.schema)
    }
  }

  if (op.responses && typeof op.responses === 'object') {
    for (const res of Object.values(op.responses)) {
      const resContent = res?.content
      if (resContent && typeof resContent === 'object') {
        for (const media of Object.values(resContent)) {
          if (media?.schema) normalizeSchema(media.schema)
        }
      }
    }
  }

  if (Array.isArray(op.parameters)) {
    for (const param of op.parameters) {
      if (param?.schema) normalizeSchema(param.schema)
    }
  }
}

module.exports = (spec) => {
  if (Array.isArray(spec.tags)) {
    spec.tags = spec.tags.map((t) => ({ ...t, name: normalizeTag(t.name) }))
  }

  for (const pathItem of Object.values(spec.paths ?? {})) {
    for (const [method, op] of Object.entries(pathItem)) {
      if (!op || typeof op !== 'object') continue
      if (Array.isArray(op.tags)) {
        op.tags = op.tags.map(normalizeTag)
      }
      if (['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(method)) {
        normalizeOperationSchemas(op)
      }
    }
  }

  if (spec.components?.schemas) {
    for (const schema of Object.values(spec.components.schemas)) {
      normalizeSchema(schema)
    }
  }

  return spec
}
