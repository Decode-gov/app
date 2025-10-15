"use client"

import { useState } from "react"
import { Plus, List, FileText, Tag, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data para demonstração
const mockListas = [
  {
    id: "1",
    nome: "Estados do Brasil",
    descricao: "Lista completa dos estados brasileiros com códigos IBGE",
    termoId: "localizacao",
    itens: ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo"],
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    nome: "Tipos de Documento",
    descricao: "Documentos aceitos para identificação de pessoa física",
    termoId: "documento",
    itens: ["CPF", "RG", "CNH", "Passaporte", "Carteira de Trabalho", "Título de Eleitor"],
    createdAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "3",
    nome: "Status de Pagamento",
    descricao: "Estados possíveis para transações financeiras",
    termoId: "pagamento",
    itens: ["Pendente", "Processando", "Aprovado", "Rejeitado", "Cancelado", "Estornado"],
    createdAt: "2024-01-05T09:15:00Z"
  },
  {
    id: "4",
    nome: "Categorias de Produto",
    descricao: "Classificação de produtos por categoria comercial",
    termoId: "produto",
    itens: ["Eletrônicos", "Roupas", "Casa e Jardim", "Esportes", "Livros", "Beleza", "Automotivo"],
    createdAt: "2024-01-01T08:00:00Z"
  }
]

const getTermoColor = (termoId: string) => {
  const colors: Record<string, string> = {
    'localizacao': 'bg-blue-100 text-blue-800',
    'documento': 'bg-green-100 text-green-800',
    'pagamento': 'bg-orange-100 text-orange-800',
    'produto': 'bg-purple-100 text-purple-800',
  }
  return colors[termoId] || 'bg-gray-100 text-gray-800'
}

export default function ListasReferenciaPage() {
  const [search, setSearch] = useState("")
  const [termoFilter, setTermoFilter] = useState("")
  const [expandedLista, setExpandedLista] = useState<string | null>(null)
  
  const listas = mockListas

  const filteredListas = listas.filter(lista => {
    const matchesSearch = search === "" || 
      lista.nome.toLowerCase().includes(search.toLowerCase()) ||
      lista.descricao.toLowerCase().includes(search.toLowerCase())
    
    const matchesTermo = termoFilter === "" || lista.termoId === termoFilter
    
    return matchesSearch && matchesTermo
  })

  const stats = {
    totalListas: listas.length,
    totalItens: listas.reduce((acc, l) => acc + l.itens.length, 0),
    termosUnicos: [...new Set(listas.map(l => l.termoId))].length,
    mediaItens: Math.round(listas.reduce((acc, l) => acc + l.itens.length, 0) / listas.length)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listas de Referência</h1>
          <p className="text-muted-foreground">
            Gerencie listas padronizadas de valores de referência
          </p>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Lista
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Listas</CardTitle>
            <List className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListas}</div>
            <p className="text-xs text-muted-foreground">listas de referência</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItens}</div>
            <p className="text-xs text-muted-foreground">itens cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Termos Únicos</CardTitle>
            <Tag className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.termosUnicos}</div>
            <p className="text-xs text-muted-foreground">termos associados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Itens</CardTitle>
            <List className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mediaItens}</div>
            <p className="text-xs text-muted-foreground">itens por lista</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar listas..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Select value={termoFilter} onValueChange={setTermoFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por termo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os termos</SelectItem>
              <SelectItem value="localizacao">Localização</SelectItem>
              <SelectItem value="documento">Documento</SelectItem>
              <SelectItem value="pagamento">Pagamento</SelectItem>
              <SelectItem value="produto">Produto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Listas de Referência */}
      <div className="grid gap-4">
        {filteredListas.map((lista) => (
          <Card key={lista.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <List className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {lista.nome}
                    <Badge className={getTermoColor(lista.termoId)}>
                      {lista.termoId}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{lista.descricao}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {lista.itens.length} itens cadastrados
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setExpandedLista(expandedLista === lista.id ? null : lista.id)}
                >
                  {expandedLista === lista.id ? "Ocultar" : "Ver"} Itens
                </Button>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  Excluir
                </Button>
              </div>
            </div>

            {expandedLista === lista.id && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Itens da Lista ({lista.itens.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {lista.itens.map((item, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-md text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}

        {filteredListas.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <List className="h-12 w-12 mx-auto mb-2" />
              <p>Nenhuma lista encontrada com os filtros aplicados</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}