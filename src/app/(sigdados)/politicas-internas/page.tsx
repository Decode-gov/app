"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
    Plus,
    Search,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    Filter
} from "lucide-react"

// Mock data
const mockPoliticas = [
  { 
    id: "1", 
    titulo: "Política de Proteção de Dados Pessoais", 
    categoria: "Privacidade", 
    status: "ativa", 
    versao: "2.1",
    dataVigencia: "2024-01-01",
    proximaRevisao: "2024-07-01",
    responsavel: "João Silva"
  },
  { 
    id: "2", 
    titulo: "Política de Classificação de Dados", 
    categoria: "Classificação", 
    status: "revisao", 
    versao: "1.3",
    dataVigencia: "2023-06-15",
    proximaRevisao: "2024-01-15",
    responsavel: "Maria Santos"
  },
  { 
    id: "3", 
    titulo: "Política de Retenção de Dados", 
    categoria: "Retenção", 
    status: "ativa", 
    versao: "1.0",
    dataVigencia: "2024-01-01",
    proximaRevisao: "2024-12-31",
    responsavel: "Pedro Costa"
  },
  { 
    id: "4", 
    titulo: "Política de Backup e Recuperação", 
    categoria: "Backup", 
    status: "inativa", 
    versao: "3.2",
    dataVigencia: "2023-01-01",
    proximaRevisao: "2024-01-01",
    responsavel: "Ana Ferreira"
  },
]

export default function PoliticasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "",
    descricao: "",
    responsavel: "",
    dataVigencia: "",
    proximaRevisao: ""
  })

  const filteredPoliticas = mockPoliticas.filter(politica => {
    const matchesSearch = politica.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         politica.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || politica.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const statusStats = {
    total: mockPoliticas.length,
    ativas: mockPoliticas.filter(p => p.status === "ativa").length,
    revisao: mockPoliticas.filter(p => p.status === "revisao").length,
    inativas: mockPoliticas.filter(p => p.status === "inativa").length
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativa":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Ativa</Badge>
      case "revisao":
        return <Badge variant="outline" className="border-yellow-300 text-yellow-700">Em Revisão</Badge>
      case "inativa":
        return <Badge variant="secondary">Inativa</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ativa":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "revisao":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "inativa":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dados do formulário:", formData)
    setIsDialogOpen(false)
    setFormData({
      titulo: "",
      categoria: "",
      descricao: "",
      responsavel: "",
      dataVigencia: "",
      proximaRevisao: ""
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight text-gradient">
          Políticas Internas
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie políticas e diretrizes de governança de dados
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 animate-slide-in-right">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{statusStats.total}</div>
            <p className="text-xs text-muted-foreground">Políticas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{statusStats.ativas}</div>
            <p className="text-xs text-muted-foreground">Vigentes</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Revisão</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusStats.revisao}</div>
            <p className="text-xs text-muted-foreground">Atualizando</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativas</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500 group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusStats.inativas}</div>
            <p className="text-xs text-muted-foreground">Obsoletas</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center animate-slide-in-left">
        <div className="flex flex-1 gap-2 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar políticas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50 transition-colors duration-200"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-background/50 backdrop-blur-sm border-border/60 hover:bg-accent/50">
                <Filter className="h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedStatus(null)}>
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("ativa")}>
                Ativas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("revisao")}>
                Em Revisão
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("inativa")}>
                Inativas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200">
                <Plus className="h-4 w-4" />
                Nova Política
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] glass">
              <DialogHeader>
                <DialogTitle className="text-gradient">Nova Política Interna</DialogTitle>
                <DialogDescription>
                  Crie uma nova política de governança de dados
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título</Label>
                    <Input
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      placeholder="Digite o título da política"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select onValueChange={(value) => setFormData({...formData, categoria: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="privacidade">Privacidade</SelectItem>
                        <SelectItem value="classificacao">Classificação</SelectItem>
                        <SelectItem value="retencao">Retenção</SelectItem>
                        <SelectItem value="backup">Backup</SelectItem>
                        <SelectItem value="seguranca">Segurança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Descreva o objetivo e escopo da política"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Input
                      id="responsavel"
                      value={formData.responsavel}
                      onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                      placeholder="Nome do responsável"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataVigencia">Data de Vigência</Label>
                    <Input
                      id="dataVigencia"
                      type="date"
                      value={formData.dataVigencia}
                      onChange={(e) => setFormData({...formData, dataVigencia: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proximaRevisao">Próxima Revisão</Label>
                  <Input
                    id="proximaRevisao"
                    type="date"
                    value={formData.proximaRevisao}
                    onChange={(e) => setFormData({...formData, proximaRevisao: e.target.value})}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Criar Política
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <Card className="animate-fade-in glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Políticas Internas
          </CardTitle>
          <CardDescription>
            Lista de políticas de governança de dados da organização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Versão</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Próxima Revisão</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPoliticas.map((politica, index) => (
                <TableRow 
                  key={politica.id} 
                  className="border-border/60 hover:bg-muted/50 transition-colors duration-200 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TableCell className="font-medium group-hover:text-primary transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(politica.status)}
                      {politica.titulo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {politica.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(politica.status)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    v{politica.versao}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(politica.dataVigencia).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(politica.proximaRevisao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {politica.responsavel}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 hover:bg-accent/50 transition-colors duration-200"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass">
                        <DropdownMenuItem className="gap-2 hover:bg-accent/50">
                          <Eye className="h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 hover:bg-accent/50">
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
