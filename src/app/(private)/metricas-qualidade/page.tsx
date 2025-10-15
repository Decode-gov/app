"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, TrendingDown, AlertCircle, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data para demonstração
const mockMetricas = {
  resumoGeral: {
    scoreGeral: 94.2,
    tendencia: 2.5,
    totalDatasets: 45,
    datasetsConformes: 38,
    ultimaAtualizacao: "2024-01-15T10:30:00Z"
  },
  porDimensao: [
    {
      dimensao: "Completude",
      score: 96.8,
      tendencia: 1.2,
      status: "excelente",
      detalhes: {
        total: 15,
        conformes: 14,
        naoConformes: 1,
        mediaScore: 96.8
      }
    },
    {
      dimensao: "Precisão",
      score: 89.5,
      tendencia: -0.8,
      status: "bom",
      detalhes: {
        total: 12,
        conformes: 10,
        naoConformes: 2,
        mediaScore: 89.5
      }
    },
    {
      dimensao: "Consistência",
      score: 94.1,
      tendencia: 3.2,
      status: "excelente",
      detalhes: {
        total: 8,
        conformes: 7,
        naoConformes: 1,
        mediaScore: 94.1
      }
    },
    {
      dimensao: "Validade",
      score: 98.2,
      tendencia: 0.5,
      status: "excelente",
      detalhes: {
        total: 18,
        conformes: 18,
        naoConformes: 0,
        mediaScore: 98.2
      }
    },
    {
      dimensao: "Unicidade",
      score: 87.3,
      tendencia: -1.5,
      status: "atencao",
      detalhes: {
        total: 6,
        conformes: 5,
        naoConformes: 1,
        mediaScore: 87.3
      }
    }
  ],
  evolutivo: [
    { mes: "Set/23", scoreGeral: 88.5, completude: 90.2, precisao: 85.8, consistencia: 89.1, validade: 96.5, unicidade: 80.9 },
    { mes: "Out/23", scoreGeral: 90.1, completude: 92.1, precisao: 87.2, consistencia: 90.5, validade: 97.1, unicidade: 83.6 },
    { mes: "Nov/23", scoreGeral: 91.7, completude: 93.8, precisao: 88.5, consistencia: 92.1, validade: 97.8, unicidade: 86.3 },
    { mes: "Dez/23", scoreGeral: 92.9, completude: 95.2, precisao: 89.1, consistencia: 93.4, validade: 98.0, unicidade: 89.1 },
    { mes: "Jan/24", scoreGeral: 94.2, completude: 96.8, precisao: 89.5, consistencia: 94.1, validade: 98.2, unicidade: 87.3 }
  ],
  alertas: [
    {
      id: "1",
      tipo: "qualidade_baixa",
      dataset: "Cadastro de Clientes",
      dimensao: "Unicidade",
      score: 87.3,
      limite: 90.0,
      descricao: "Detectados registros duplicados no campo CPF",
      severidade: "media",
      dataDeteccao: "2024-01-15T09:15:00Z"
    },
    {
      id: "2",
      tipo: "tendencia_negativa",
      dataset: "Produtos",
      dimensao: "Precisão",
      score: 89.5,
      tendencia: -2.8,
      descricao: "Queda na precisão dos dados nas últimas 2 semanas",
      severidade: "alta",
      dataDeteccao: "2024-01-15T08:30:00Z"
    }
  ]
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'excelente': 'bg-green-100 text-green-800',
    'bom': 'bg-blue-100 text-blue-800',
    'atencao': 'bg-yellow-100 text-yellow-800',
    'critico': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getSeveridadeColor = (severidade: string) => {
  const colors: Record<string, string> = {
    'alta': 'bg-red-100 text-red-800',
    'media': 'bg-yellow-100 text-yellow-800',
    'baixa': 'bg-blue-100 text-blue-800'
  }
  return colors[severidade] || 'bg-gray-100 text-gray-800'
}

const getTendenciaIcon = (tendencia: number) => {
  if (tendencia > 0) {
    return <TrendingUp className="h-4 w-4 text-green-600" />
  } else if (tendencia < 0) {
    return <TrendingDown className="h-4 w-4 text-red-600" />
  } else {
    return <div className="h-4 w-4" />
  }
}

export default function MetricasQualidadePage() {
  const [periodoFilter, setPeriodoFilter] = useState("30d")
  const [dimensaoFilter, setDimensaoFilter] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  
  const metricas = mockMetricas

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Métricas de Qualidade</h1>
          <p className="text-muted-foreground">
            Monitore indicadores e tendências da qualidade dos dados
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Relatório
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="12m">Últimos 12 meses</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dimensaoFilter} onValueChange={setDimensaoFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas as dimensões" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as dimensões</SelectItem>
            <SelectItem value="completude">Completude</SelectItem>
            <SelectItem value="precisao">Precisão</SelectItem>
            <SelectItem value="consistencia">Consistência</SelectItem>
            <SelectItem value="validade">Validade</SelectItem>
            <SelectItem value="unicidade">Unicidade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="dimensoes">Por Dimensão</TabsTrigger>
          <TabsTrigger value="evolutivo">Evolutivo</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Resumo Geral */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Score Geral de Qualidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-green-600">
                    {metricas.resumoGeral.scoreGeral}%
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {getTendenciaIcon(metricas.resumoGeral.tendencia)}
                    <span className={metricas.resumoGeral.tendencia > 0 ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(metricas.resumoGeral.tendencia)}% vs período anterior
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Última atualização: {new Date(metricas.resumoGeral.ultimaAtualizacao).toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Datasets Totais</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricas.resumoGeral.totalDatasets}</div>
                <p className="text-xs text-muted-foreground">conjuntos monitorados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conformes</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricas.resumoGeral.datasetsConformes}</div>
                <p className="text-xs text-muted-foreground">
                  {((metricas.resumoGeral.datasetsConformes / metricas.resumoGeral.totalDatasets) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Score por Dimensão */}
          <Card>
            <CardHeader>
              <CardTitle>Score por Dimensão de Qualidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {metricas.porDimensao.map((dimensao) => (
                  <div key={dimensao.dimensao} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{dimensao.dimensao}</h4>
                        <Badge className={getStatusColor(dimensao.status)} variant="secondary">
                          {dimensao.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{dimensao.score}%</div>
                        <div className="flex items-center gap-1 text-sm">
                          {getTendenciaIcon(dimensao.tendencia)}
                          <span className={dimensao.tendencia > 0 ? 'text-green-600' : 'text-red-600'}>
                            {Math.abs(dimensao.tendencia)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Conformes:</span>
                        <span className="font-medium text-green-600">{dimensao.detalhes.conformes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Não conformes:</span>
                        <span className="font-medium text-red-600">{dimensao.detalhes.naoConformes}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${dimensao.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dimensoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por Dimensão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {metricas.porDimensao.map((dimensao) => (
                  <div key={dimensao.dimensao} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold">{dimensao.dimensao}</h3>
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold">{dimensao.score}%</div>
                        <Badge className={getStatusColor(dimensao.status)}>
                          {dimensao.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total de Regras:</span>
                        <p className="font-medium">{dimensao.detalhes.total}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conformes:</span>
                        <p className="font-medium text-green-600">{dimensao.detalhes.conformes}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Não Conformes:</span>
                        <p className="font-medium text-red-600">{dimensao.detalhes.naoConformes}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tendência:</span>
                        <div className="flex items-center gap-1">
                          {getTendenciaIcon(dimensao.tendencia)}
                          <span className={`font-medium ${dimensao.tendencia > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(dimensao.tendencia)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                      <div 
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full" 
                        style={{ width: `${dimensao.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolutivo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolução Temporal das Métricas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metricas.evolutivo.map((periodo) => (
                  <div key={periodo.mes} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{periodo.mes}</h4>
                      <div className="text-lg font-bold">{periodo.scoreGeral}%</div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Completude:</span>
                        <p className="font-medium">{periodo.completude}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Precisão:</span>
                        <p className="font-medium">{periodo.precisao}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Consistência:</span>
                        <p className="font-medium">{periodo.consistencia}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Validade:</span>
                        <p className="font-medium">{periodo.validade}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unicidade:</span>
                        <p className="font-medium">{periodo.unicidade}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Qualidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metricas.alertas.map((alerta) => (
                  <div key={alerta.id} className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <h4 className="font-medium">{alerta.dataset}</h4>
                          <Badge className={getSeveridadeColor(alerta.severidade)}>
                            {alerta.severidade}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{alerta.descricao}</p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Dimensão:</span>
                            <p className="font-medium">{alerta.dimensao}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Score Atual:</span>
                            <p className="font-medium">{alerta.score}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Detectado em:</span>
                            <p className="font-medium">
                              {new Date(alerta.dataDeteccao).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        Investigar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}