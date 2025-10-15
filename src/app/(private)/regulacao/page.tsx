"use client"

import { useState } from "react"
import { Plus, FileText, AlertTriangle, Calendar, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data para demonstração
const mockRegulacoes = [
  {
    id: "1",
    nome: "Lei Geral de Proteção de Dados Pessoais",
    sigla: "LGPD",
    orgaoRegulador: "ANPD - Autoridade Nacional de Proteção de Dados",
    vigencia: "2020-09-18",
    status: "VIGENTE",
    criticidade: "ALTA",
    descricao: "Lei que disciplina o tratamento de dados pessoais, inclusive nos meios digitais, por pessoa natural ou por pessoa jurídica de direito público ou privado.",
    artigosPrincipais: ["Art. 6º", "Art. 7º", "Art. 42º", "Art. 52º"],
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    nome: "Resolução sobre Segurança Cibernética",
    sigla: "BCB 4658",
    orgaoRegulador: "Banco Central do Brasil",
    vigencia: "2021-05-01",
    status: "VIGENTE",
    criticidade: "ALTA",
    descricao: "Estabelece requisitos relacionados à política de segurança cibernética e aos requisitos para a contratação de serviços de computação em nuvem.",
    artigosPrincipais: ["Art. 3º", "Art. 8º", "Art. 15º"],
    createdAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "3",
    nome: "Instrução CVM sobre Governança Corporativa",
    sigla: "CVM 586",
    orgaoRegulador: "Comissão de Valores Mobiliários",
    vigencia: "2017-06-08",
    status: "VIGENTE",
    criticidade: "MEDIA",
    descricao: "Dispõe sobre a apresentação e divulgação das demonstrações financeiras de companhias abertas.",
    artigosPrincipais: ["Art. 2º", "Art. 12º"],
    createdAt: "2024-01-05T09:15:00Z"
  },
  {
    id: "4",
    nome: "Lei Carolina Dieckmann",
    sigla: "Lei 12.737",
    orgaoRegulador: "Congresso Nacional",
    vigencia: "2012-12-03",
    status: "VIGENTE",
    criticidade: "MEDIA",
    descricao: "Tipifica condutas realizadas mediante uso de sistema eletrônico, digital ou similares, que sejam praticadas contra sistemas informatizados.",
    artigosPrincipais: ["Art. 154-A", "Art. 154-B"],
    createdAt: "2024-01-01T08:00:00Z"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'VIGENTE': return 'bg-green-100 text-green-800'
    case 'REVOGADA': return 'bg-red-100 text-red-800'
    case 'EM_CONSULTA': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getCriticidadeColor = (criticidade: string) => {
  switch (criticidade) {
    case 'ALTA': return 'bg-red-100 text-red-800'
    case 'MEDIA': return 'bg-yellow-100 text-yellow-800'
    case 'BAIXA': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function RegulacaoPage() {
  const [isLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [criticidadeFilter, setCriticidadeFilter] = useState("")
  
  const regulacoes = mockRegulacoes

  const filteredRegulacoes = regulacoes.filter(regulacao => {
    const matchesSearch = search === "" || 
      regulacao.nome.toLowerCase().includes(search.toLowerCase()) ||
      regulacao.sigla.toLowerCase().includes(search.toLowerCase()) ||
      regulacao.orgaoRegulador.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === "" || regulacao.status === statusFilter
    const matchesCriticidade = criticidadeFilter === "" || regulacao.criticidade === criticidadeFilter
    
    return matchesSearch && matchesStatus && matchesCriticidade
  })

  const stats = {
    total: regulacoes.length,
    vigentes: regulacoes.filter(r => r.status === 'VIGENTE').length,
    altaCriticidade: regulacoes.filter(r => r.criticidade === 'ALTA').length,
    orgaosUnicos: [...new Set(regulacoes.map(r => r.orgaoRegulador))].length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Regulação</h1>
          <p className="text-muted-foreground">
            Gerencie regulamentações e normativas aplicáveis
          </p>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Regulação
        </Button>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-1" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Regulações</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">regulações cadastradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vigentes</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vigentes}</div>
              <p className="text-xs text-muted-foreground">em vigor</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alta Criticidade</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.altaCriticidade}</div>
              <p className="text-xs text-muted-foreground">críticas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Órgãos Reguladores</CardTitle>
              <Building className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orgaosUnicos}</div>
              <p className="text-xs text-muted-foreground">órgãos diferentes</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4 flex-1">
          <Input
            placeholder="Buscar regulações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="VIGENTE">Vigente</SelectItem>
              <SelectItem value="REVOGADA">Revogada</SelectItem>
              <SelectItem value="EM_CONSULTA">Em Consulta</SelectItem>
            </SelectContent>
          </Select>

          <Select value={criticidadeFilter} onValueChange={setCriticidadeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Criticidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              <SelectItem value="ALTA">Alta</SelectItem>
              <SelectItem value="MEDIA">Média</SelectItem>
              <SelectItem value="BAIXA">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Regulações */}
      <div className="grid gap-4">
        {filteredRegulacoes.map((regulacao) => (
          <Card key={regulacao.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <FileText className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {regulacao.sigla} - {regulacao.nome}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Building className="h-4 w-4" />
                    {regulacao.orgaoRegulador}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    Vigência: {new Date(regulacao.vigencia).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(regulacao.status)}>
                    {regulacao.status}
                  </Badge>
                  <Badge className={getCriticidadeColor(regulacao.criticidade)}>
                    {regulacao.criticidade}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    Excluir
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-3">{regulacao.descricao}</p>
              
              {regulacao.artigosPrincipais && regulacao.artigosPrincipais.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Artigos Principais:</h4>
                  <div className="flex flex-wrap gap-1">
                    {regulacao.artigosPrincipais.map((artigo, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {artigo}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}

        {filteredRegulacoes.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2" />
              <p>Nenhuma regulação encontrada com os filtros aplicados</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}