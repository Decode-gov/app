"use client"

import { useState } from "react"
import { Plus, AlertTriangle, Shield, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data para demonstração
const mockCriticidades = [
  {
    id: "1",
    regulacaoId: "LGPD",
    nivel: "CRITICA",
    justificativa: "Dados pessoais sensíveis com potencial de causar danos significativos aos titulares",
    impacto: "Multa de até 2% do faturamento da empresa ou R$ 50 milhões",
    prazoConformidade: "2024-12-31",
    responsavelId: "joao-silva",
    status: "EM_ANALISE",
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    regulacaoId: "BCB 4658",
    nivel: "ALTA",
    justificativa: "Sistemas críticos de infraestrutura financeira com dados de transações",
    impacto: "Intervenção regulatória e possível aplicação de penalidades operacionais",
    prazoConformidade: "2024-06-30",
    responsavelId: "maria-santos",
    status: "APROVADO",
    createdAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "3",
    regulacaoId: "CVM 586",
    nivel: "MEDIA",
    justificativa: "Demonstrações financeiras com impacto na transparência do mercado",
    impacto: "Advertência e obrigação de republicação das demonstrações",
    prazoConformidade: "2024-03-31",
    responsavelId: "carlos-oliveira",
    status: "APROVADO",
    createdAt: "2024-01-05T09:15:00Z"
  },
  {
    id: "4",
    regulacaoId: "Lei 12.737",
    nivel: "BAIXA",
    justificativa: "Sistemas internos sem exposição direta de dados críticos",
    impacto: "Orientação para adequação sem aplicação de penalidades",
    prazoConformidade: "2024-08-31",
    responsavelId: "ana-costa",
    status: "PENDENTE",
    createdAt: "2024-01-01T08:00:00Z"
  }
]

const getNivelColor = (nivel: string) => {
  switch (nivel) {
    case 'CRITICA': return 'bg-red-100 text-red-800'
    case 'ALTA': return 'bg-orange-100 text-orange-800'
    case 'MEDIA': return 'bg-yellow-100 text-yellow-800'
    case 'BAIXA': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'APROVADO': return 'bg-green-100 text-green-800'
    case 'EM_ANALISE': return 'bg-blue-100 text-blue-800'
    case 'PENDENTE': return 'bg-yellow-100 text-yellow-800'
    case 'REJEITADO': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getNivelIcon = (nivel: string) => {
  switch (nivel) {
    case 'CRITICA': return AlertTriangle
    case 'ALTA': return AlertTriangle
    case 'MEDIA': return Shield
    case 'BAIXA': return Shield
    default: return Shield
  }
}

export default function CriticidadeRegulatoriPage() {
  const [search, setSearch] = useState("")
  const [nivelFilter, setNivelFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  
  const criticidades = mockCriticidades

  const filteredCriticidades = criticidades.filter(criticidade => {
    const matchesSearch = search === "" || 
      criticidade.regulacaoId.toLowerCase().includes(search.toLowerCase()) ||
      criticidade.justificativa.toLowerCase().includes(search.toLowerCase())
    
    const matchesNivel = nivelFilter === "" || criticidade.nivel === nivelFilter
    const matchesStatus = statusFilter === "" || criticidade.status === statusFilter
    
    return matchesSearch && matchesNivel && matchesStatus
  })

  const stats = {
    total: criticidades.length,
    criticas: criticidades.filter(c => c.nivel === 'CRITICA').length,
    pendentes: criticidades.filter(c => c.status === 'PENDENTE' || c.status === 'EM_ANALISE').length,
    vencendoEm30Dias: criticidades.filter(c => {
      const prazo = new Date(c.prazoConformidade)
      const hoje = new Date()
      const diffDias = Math.ceil((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
      return diffDias <= 30 && diffDias > 0
    }).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Criticidade Regulatória</h1>
          <p className="text-muted-foreground">
            Avalie e gerencie a criticidade regulatória dos ativos de dados
          </p>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Análise
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Análises</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">análises realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Criticidade Crítica</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.criticas}</div>
            <p className="text-xs text-muted-foreground">requerem atenção imediata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendentes}</div>
            <p className="text-xs text-muted-foreground">aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo em 30 Dias</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vencendoEm30Dias}</div>
            <p className="text-xs text-muted-foreground">prazos próximos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4 flex-1">
          <Input
            placeholder="Buscar por regulação ou justificativa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          
          <Select value={nivelFilter} onValueChange={setNivelFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os níveis</SelectItem>
              <SelectItem value="CRITICA">Crítica</SelectItem>
              <SelectItem value="ALTA">Alta</SelectItem>
              <SelectItem value="MEDIA">Média</SelectItem>
              <SelectItem value="BAIXA">Baixa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="APROVADO">Aprovado</SelectItem>
              <SelectItem value="EM_ANALISE">Em Análise</SelectItem>
              <SelectItem value="PENDENTE">Pendente</SelectItem>
              <SelectItem value="REJEITADO">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Criticidades */}
      <div className="grid gap-4">
        {filteredCriticidades.map((criticidade) => {
          const IconComponent = getNivelIcon(criticidade.nivel)
          const prazoDate = new Date(criticidade.prazoConformidade)
          const hoje = new Date()
          const diffDias = Math.ceil((prazoDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
          
          return (
            <Card key={criticidade.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <IconComponent className={`h-6 w-6 mt-1 ${
                    criticidade.nivel === 'CRITICA' || criticidade.nivel === 'ALTA' 
                      ? 'text-red-500' 
                      : 'text-orange-500'
                  }`} />
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {criticidade.regulacaoId}
                      <Badge className={getNivelColor(criticidade.nivel)}>
                        {criticidade.nivel}
                      </Badge>
                      <Badge className={getStatusColor(criticidade.status)}>
                        {criticidade.status.replace('_', ' ')}
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Responsável: {criticidade.responsavelId}
                    </p>
                    <p className={`text-sm mt-1 flex items-center gap-1 ${
                      diffDias <= 30 ? 'text-orange-600 font-medium' : 'text-muted-foreground'
                    }`}>
                      <Calendar className="h-4 w-4" />
                      Prazo: {prazoDate.toLocaleDateString('pt-BR')}
                      {diffDias <= 30 && diffDias > 0 && (
                        <span className="text-orange-600">({diffDias} dias)</span>
                      )}
                    </p>
                  </div>
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

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Justificativa:</h4>
                  <p className="text-sm text-gray-600">{criticidade.justificativa}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Impacto Potencial:</h4>
                  <p className="text-sm text-gray-600">{criticidade.impacto}</p>
                </div>
              </div>
            </Card>
          )
        })}

        {filteredCriticidades.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
              <p>Nenhuma análise de criticidade encontrada</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}