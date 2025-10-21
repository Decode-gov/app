"use client"

import { useState } from "react"
import { Plus, FileText, Eye, Search, Calendar, Pencil, Trash2, Database, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentoForm } from "@/components/documentos/documento-form"
import { useDocumentos, useDeleteDocumento } from "@/hooks/api/use-documentos"
import type { DocumentoResponse } from "@/types/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function DocumentosPage() {
  const [activeTab, setActiveTab] = useState("polimorficos")
  const [search, setSearch] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedDocumento, setSelectedDocumento] = useState<DocumentoResponse | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentoToDelete, setDocumentoToDelete] = useState<string | null>(null)
  
  const { data: response, isLoading } = useDocumentos()
  const deleteMutation = useDeleteDocumento()

  const documentos = response?.data || []

  const handleEdit = (documento: DocumentoResponse) => {
    setSelectedDocumento(documento)
    setFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setDocumentoToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (documentoToDelete) {
      deleteMutation.mutate(documentoToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setDocumentoToDelete(null)
        }
      })
    }
  }

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open)
    if (!open) {
      setSelectedDocumento(undefined)
    }
  }

  const filteredDocumentos = documentos.filter(doc => {
    const matchesSearch = search === "" || 
      doc.nomeArquivo.toLowerCase().includes(search.toLowerCase()) ||
      doc.descricao?.toLowerCase().includes(search.toLowerCase())
    
    const matchesTipo = !tipoFilter || doc.tipoEntidade === tipoFilter
    const matchesStatus = !statusFilter || (statusFilter === 'ativo' ? doc.ativo : !doc.ativo)
    
    return matchesSearch && matchesTipo && matchesStatus
  })

  const stats = {
    total: documentos.length,
    ativos: documentos.filter(d => d.ativo).length,
    inativos: documentos.filter(d => !d.ativo).length,
    porTipo: documentos.reduce((acc, doc) => {
      acc[doc.tipoEntidade] = (acc[doc.tipoEntidade] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const tiposEntidade = [...new Set(documentos.map(d => d.tipoEntidade))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Documentos</h1>
          <p className="text-muted-foreground">
            Documentos polimórficos, repositórios e associações termo-repositório
          </p>
        </div>
      </div>

      {/* Formulário Documento Polimórfico */}
      <DocumentoForm
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        documento={selectedDocumento}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="polimorficos">
            <FileText className="mr-2 h-4 w-4" />
            Documentos Polimórficos
          </TabsTrigger>
          <TabsTrigger value="repositorios">
            <Database className="mr-2 h-4 w-4" />
            Repositórios
          </TabsTrigger>
          <TabsTrigger value="termo-repositorio">
            <Link className="mr-2 h-4 w-4" />
            Termo ↔ Repositório
          </TabsTrigger>
        </TabsList>

        {/* TAB: DOCUMENTOS POLIMÓRFICOS */}
        <TabsContent value="polimorficos" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sistema Genérico de Anexos</h2>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Documento
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">documentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ativos}</div>
            <p className="text-xs text-muted-foreground">em uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inativos}</div>
            <p className="text-xs text-muted-foreground">arquivados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.porTipo).length}</div>
            <p className="text-xs text-muted-foreground">entidades</p>
          </CardContent>
        </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome do arquivo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Select value={tipoFilter} onValueChange={(value) => setTipoFilter(value || undefined)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Entidade" />
                </SelectTrigger>
                <SelectContent>
                  {tiposEntidade.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || undefined)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </div>
          </CardContent>
          </Card>

          {/* Lista de Documentos */}
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando...</div>
          ) : (
            <div className="space-y-4">
              {filteredDocumentos.map((documento) => (
                <Card key={documento.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold">{documento.nomeArquivo}</h3>
                          <Badge variant="outline">v{documento.versao}</Badge>
                          <Badge className={documento.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {documento.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Badge variant="secondary" className="capitalize">
                            {documento.tipoEntidade}
                          </Badge>
                        </div>
                        
                        {documento.descricao && (
                          <p className="text-sm text-muted-foreground">{documento.descricao}</p>
                        )}
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Entidade ID:</span>
                            <p className="font-medium">{documento.entidadeId}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tipo Arquivo:</span>
                            <p className="font-medium">{documento.tipoArquivo}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tamanho:</span>
                            <p className="font-medium">{(documento.tamanhoBytes / 1024).toFixed(2)} KB</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Caminho:</span>
                            <p className="font-medium text-xs truncate">{documento.caminhoArquivo}</p>
                          </div>
                        </div>
                        
                        {documento.checksum && (
                          <div className="text-xs text-muted-foreground">
                            <span>Checksum: </span>
                            <code className="bg-muted px-1 py-0.5 rounded">{documento.checksum}</code>
                          </div>
                        )}
                        
                        {documento.metadados && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">Metadados: </span>
                            <code className="bg-muted px-1 py-0.5 rounded text-xs">
                              {JSON.stringify(documento.metadados)}
                            </code>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(documento)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(documento.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredDocumentos.length === 0 && !isLoading && (
                <Card className="p-8">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2" />
                    <p>Nenhum documento encontrado</p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* TAB: REPOSITÓRIOS */}
        <TabsContent value="repositorios" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Repositórios de Documentos</h2>
              <p className="text-sm text-muted-foreground">SharePoint, S3, Google Drive, etc.</p>
            </div>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Novo Repositório
            </Button>
          </div>

          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-2" />
              <p>Funcionalidade em desenvolvimento</p>
              <p className="text-xs mt-2">Gerenciar repositórios como SharePoint, S3, etc.</p>
            </div>
          </Card>
        </TabsContent>

        {/* TAB: TERMO ↔ REPOSITÓRIO */}
        <TabsContent value="termo-repositorio" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Associação Termo ↔ Repositório</h2>
              <p className="text-sm text-muted-foreground">Vincule termos de negócio a repositórios corporativos</p>
            </div>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Nova Associação
            </Button>
          </div>

          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <Link className="h-12 w-12 mx-auto mb-2" />
              <p>Funcionalidade em desenvolvimento</p>
              <p className="text-xs mt-2">Associar termos de negócio a repositórios de documentos</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}