# DECODE-GOV - Sistema de Governança de Dados

Sistema integrado para gestão e governança de dados corporativos desenvolvido com Next.js 15, TypeScript, TailwindCSS 4 e shadcn/ui.

## 🚀 Tecnologias

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS 4**
- **shadcn/ui** (Componentes UI)
- **TanStack Query** (Gerenciamento de estado e cache)
- **React Hook Form** (Formulários)
- **Zod** (Validação)
- **Axios** (Cliente HTTP)
- **Lucide React** (Ícones)

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── (decode-gov)/        # Grupo de rotas principais
│   │   ├── layout.tsx     # Layout com sidebar e breadcrumb
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── usuarios/      # Gestão de usuários
│   │   ├── definicoes/    # Termos e definições
│   │   ├── kpis/          # Gestão de KPIs
│   │   └── ...            # Outros módulos
│   ├── globals.css        # Estilos globais
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes shadcn/ui
│   ├── layout/           # Componentes de layout
│   ├── forms/            # Formulários específicos
│   └── tables/           # Tabelas com TanStack Table
├── hooks/                # Hooks customizados do TanStack Query
├── lib/                  # Utilitários e configurações
├── providers/            # Providers (Query Client)
├── schemas/              # Schemas de validação Zod
└── types/                # Definições de tipos TypeScript
```

## 🎯 Funcionalidades

### Módulos Principais

- **Dashboard** - Visão geral com métricas e indicadores
- **Usuários** - Gestão de usuários e permissões
- **Definições** - Catálogo de termos de negócio
- **KPIs** - Gestão de indicadores de performance
- **Políticas Internas** - Políticas de governança
- **Papéis** - Papéis de governança
- **Comunidades** - Domínios de dados (estrutura hierárquica)
- **Processos** - Processos de negócio
- **Sistemas** - Sistemas de informação
- **Bancos** - Bases de dados
- **Tabelas** - Mapeamento negócio ↔ técnico
- **Regras de Negócio** - Regras e políticas
- **Necessidades de Informação** - Questões gerenciais
- **Classificações** - Classificação de informações
- **Repositórios** - Repositórios de documentos

### Padrões de UX/UI

- **Layout responsivo** com sidebar recolhível
- **Breadcrumb** para navegação
- **Tabelas avançadas** com:
  - Paginação
  - Busca global
  - Filtros por coluna
  - Ordenação
  - Seleção em massa
  - Ações por linha (Visualizar, Editar, Excluir)
- **Formulários** com validação em tempo real
- **Estados de loading** com skeletons
- **Estados vazios** com ilustrações
- **Toasts** para feedback
- **Dialogs** para confirmações
- **Sheets/Drawers** para visualização detalhada

## 🛠️ Instalação e Execução

1. **Clone o repositório**
```bash
git clone <repository-url>
cd decode-gov-app
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Execute em desenvolvimento**
```bash
npm run dev
```

5. **Build para produção**
```bash
npm run build
npm start
```

A aplicação estará disponível em http://localhost:3000

## 🔗 Endpoints da API

O sistema espera uma API REST com os seguintes endpoints:

### Usuários
- `GET /usuarios` - Lista usuários
- `GET /usuarios/:id` - Detalhe do usuário
- `POST /usuarios` - Criar usuário
- `PUT /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Excluir usuário

### Dashboard
- `GET /dashboard` - Dados do dashboard

### Módulos CRUD
Todos os módulos seguem o padrão REST:
- `/kpis`, `/politicas-internas`, `/definicoes`, `/comunidades`, `/processos`, `/sistemas`, `/bancos`, `/tabelas`, `/regras-negocio`, `/necessidades-informacao`, `/classificacoes-informacao`, `/repositorios-documento`, `/tipos-dados`, `/papeis`, `/colunas`

### Endpoints Especiais
- `POST /mfa` - Configurar MFA
- `GET /auditoria` - Logs de auditoria
- `POST /importacao-exportacao` - Importar dados
- `GET /importacao-exportacao/export/:tipo` - Exportar dados

## 📝 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Executa versão de produção
- `npm run lint` - Executa ESLint

## 🌐 Deploy

O projeto está pronto para deploy em plataformas como Vercel, Netlify, AWS Amplify, etc.

---

Desenvolvido com ❤️ para governança de dados corporativos.
