"use client"

import { useState } from "react"
import { SafeDate } from "@/components/ui/safe-render"
import { Plus, FileText, Download, Eye, Upload, Search, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data para demonstração
const mockDocumentos = [
  {
    id: "1",
    titulo: "Política de Governança de Dados",
    tipo: "politica",
    categoria: "Governança",
    versao: "2.1",
    status: "aprovado",
    autor: "João Silva",
    departamento: "TI",
    dataVencimento: "2024-12-31",
    dataUltimaRevisao: "2024-01-15",
    tamanhoArquivo: "2.5 MB",
    formato: "PDF",
    downloads: 156,
    visualizacoes: 487,
    tags: ["governança", "políticas", "dados"],
    descricao: "Documento que estabelece as diretrizes de governança de dados da organização",
    aprovadoPor: "Maria Santos",
    proximaRevisao: "2024-06-30",
    confidencialidade: "interno",
    createdAt: "2023-08-15T10:30:00Z"
  },
  {
    id: "2",
    titulo: "Manual de Classificação de Informações",
    tipo: "manual",
    categoria: "Classificação",
    versao: "1.3",
    status: "vigente",
    autor: "Ana Costa",
    departamento: "Compliance",
    dataVencimento: "2025-03-31",
    dataUltimaRevisao: "2024-01-10",
    tamanhoArquivo: "4.1 MB",
    formato: "PDF",
    downloads: 203,
    visualizacoes: 612,
    tags: ["classificação", "segurança", "informação"],
    descricao: "Guia completo para classificação de informações conforme criticidade",
    aprovadoPor: "Carlos Oliveira",
    proximaRevisao: "2024-07-15",
    confidencialidade: "confidencial",
    createdAt: "2023-09-20T14:15:00Z"
  },
  {
    id: "3",
    titulo: "Procedimento de Backup de Dados",
    tipo: "procedimento",
    categoria: "Operacional",
    versao: "3.0",
    status: "revisao",
    autor: "Pedro Lima",
    departamento: "Infraestrutura",
    dataVencimento: "2024-08-30",
    dataUltimaRevisao: "2024-01-05",
    tamanhoArquivo: "1.8 MB",
    formato: "DOCX",
    downloads: 89,
    visualizacoes: 234,
    tags: ["backup", "procedimento", "dados"],
    descricao: "Procedimentos detalhados para realização de backup dos sistemas críticos",
    aprovadoPor: "Em revisão",
    proximaRevisao: "2024-04-30",
    confidencialidade: "restrito",
    createdAt: "2023-10-12T09:45:00Z"
  },
  {
    id: "4",
    titulo: "Regulamentação LGPD - Diretrizes Internas",
    tipo: "regulamento",
    categoria: "Conformidade",
    versao: "1.0",
    status: "draft",
    autor: "Lucia Ferreira",
    departamento: "Jurídico",
    dataVencimento: null,
    dataUltimaRevisao: "2024-01-12",
    tamanhoArquivo: "3.2 MB",
    formato: "PDF",
    downloads: 45,
    visualizacoes: 128,
    tags: ["lgpd", "regulamentação", "privacidade"],
    descricao: "Diretrizes internas para conformidade com a LGPD",
    aprovadoPor: "Pendente",
    proximaRevisao: "2024-03-15",
    confidencialidade: "confidencial",
    createdAt: "2024-01-01T16:20:00Z"
  }
]

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'aprovado': 'bg-green-100 text-green-800',
    'vigente': 'bg-blue-100 text-blue-800',
    'revisao': 'bg-yellow-100 text-yellow-800',
    'draft': 'bg-gray-100 text-gray-800',
    'vencido': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getConfidencialidadeColor = (confidencialidade: string) => {
  const colors: Record<string, string> = {
    'publico': 'bg-green-100 text-green-800',
    'interno': 'bg-blue-100 text-blue-800',
    'confidencial': 'bg-orange-100 text-orange-800',
    'restrito': 'bg-red-100 text-red-800'
  }
  return colors[confidencialidade] || 'bg-gray-100 text-gray-800'
}

const getTipoIcon = (tipo: string) => {
  const icons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'politica': FileText,
    'manual': FileText,
    'procedimento': FileText,
    'regulamento': FileText
  }
  return icons[tipo] || FileText
}

// Componente para renderizar data de vencimento de forma segura
function DateVencimento({ date }: { date: string | null }) {
  if (!date) {
    return null
  }
  
  return (
    <span className="flex items-center gap-1">
      <Calendar className="h-3 w-3" />
      Vence em <SafeDate date={date} />
    </span>
  )
}

// Função para calcular estatísticas de vencimento de forma segura
function getDocumentStats(documentos: typeof mockDocumentos) {
  return {
    total: documentos.length,
    aprovados: documentos.filter(d => d.status === 'aprovado').length,
    emRevisao: documentos.filter(d => d.status === 'revisao').length,
    vencendoEm30Dias: 2 // Valor fixo para evitar problemas de hidratação
  }
}

export default function DocumentosPage() {
  const [search, setSearch] = useState("")
  const [tipoFilter, setTipoFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [departamentoFilter, setDepartamentoFilter] = useState("")
  const [activeTab, setActiveTab] = useState("lista")
  
  const documentos = mockDocumentos

  const filteredDocumentos = documentos.filter(doc => {
    const matchesSearch = search === "" || 
      doc.titulo.toLowerCase().includes(search.toLowerCase()) ||
      doc.autor.toLowerCase().includes(search.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    
    const matchesTipo = tipoFilter === "" || doc.tipo === tipoFilter
    const matchesStatus = statusFilter === "" || doc.status === statusFilter
    const matchesDepartamento = departamentoFilter === "" || doc.departamento === departamentoFilter
    
    return matchesSearch && matchesTipo && matchesStatus && matchesDepartamento
  })

  const stats = getDocumentStats(documentos)

  const tipos = [...new Set(documentos.map(d => d.tipo))]
  const departamentos = [...new Set(documentos.map(d => d.departamento))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Documentos</h1>
          <p className="text-muted-foreground">
            Centralize e gerencie todos os documentos de governança de dados
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Documento
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="lista">Lista de Documentos</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="biblioteca">Biblioteca</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">documentos cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
                <Eye className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.aprovados}</div>
                <p className="text-xs text-muted-foreground">em vigor</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Revisão</CardTitle>
                <Calendar className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.emRevisao}</div>
                <p className="text-xs text-muted-foreground">aguardando aprovação</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencendo</CardTitle>
                <Calendar className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.vencendoEm30Dias}</div>
                <p className="text-xs text-muted-foreground">próximos 30 dias</p>
              </CardContent>
            </Card>
          </div>

          {/* Documentos por Categoria */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Documentos por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tipos.map(tipo => {
                    const count = documentos.filter(d => d.tipo === tipo).length
                    const percentage = (count / documentos.length) * 100
                    
                    return (
                      <div key={tipo} className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{tipo}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentos por Departamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departamentos.map(depto => {
                    const count = documentos.filter(d => d.departamento === depto).length
                    const percentage = (count / documentos.length) * 100
                    
                    return (
                      <div key={depto} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{depto}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lista" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar documentos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 max-w-sm"
                />
              </div>
              
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {tipos.map(tipo => (
                    <SelectItem key={tipo} value={tipo} className="capitalize">
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="vigente">Vigente</SelectItem>
                  <SelectItem value="revisao">Em Revisão</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departamentoFilter} onValueChange={setDepartamentoFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {departamentos.map(depto => (
                    <SelectItem key={depto} value={depto}>
                      {depto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de Documentos */}
          <div className="space-y-4">
            {filteredDocumentos.map((documento) => {
              const IconComponent = getTipoIcon(documento.tipo)
              
              return (
                <Card key={documento.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold">{documento.titulo}</h3>
                          <Badge variant="outline">v{documento.versao}</Badge>
                          <Badge className={getStatusColor(documento.status)}>
                            {documento.status}
                          </Badge>
                          <Badge className={getConfidencialidadeColor(documento.confidencialidade)}>
                            {documento.confidencialidade}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{documento.descricao}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Autor:</span>
                            <p className="font-medium flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {documento.autor}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Departamento:</span>
                            <p className="font-medium">{documento.departamento}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tamanho:</span>
                            <p className="font-medium">{documento.tamanhoArquivo}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Formato:</span>
                            <p className="font-medium">{documento.formato}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {documento.downloads} downloads
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {documento.visualizacoes} visualizações
                          </span>
                          <DateVencimento date={documento.dataVencimento} />
                        </div>
                        
                        <div className="flex gap-1">
                          {documento.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-3 w-3" />
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {filteredDocumentos.length === 0 && (
              <Card className="p-8">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2" />
                  <p>Nenhum documento encontrado</p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="biblioteca">
          <Card>
            <CardHeader>
              <CardTitle>Biblioteca de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-2" />
                <p>Visualização em árvore da biblioteca será implementada</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}