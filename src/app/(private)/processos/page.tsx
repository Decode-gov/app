"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useProcessos, useDeleteProcesso } from "@/hooks/api/use-processos"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { ProcessoForm } from "@/components/processos/processo-form"
import { ProcessoResponse } from "@/types/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ProcessosPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingProcesso, setEditingProcesso] = useState<ProcessoResponse | undefined>()
  const [search, setSearch] = useState("")

  const { data: processosData, isLoading } = useProcessos()
  const { data: comunidadesData } = useComunidades()
  const deleteMutation = useDeleteProcesso()

  const processos = processosData?.data || []
  const comunidades = comunidadesData?.data || []

  const filteredProcessos = processos.filter((processo) => {
    return search === "" ||
      processo.nome.toLowerCase().includes(search.toLowerCase()) ||
      processo.descricao?.toLowerCase().includes(search.toLowerCase())
  })

  const handleEdit = (processo: ProcessoResponse) => {
    setEditingProcesso(processo)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este processo?")) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao excluir processo:', error)
      }
    }
  }

  const getComunidadeNome = (id: string) => {
    return comunidades.find(c => c.id === id)?.nome || "N/A"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{processos.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Processos</CardTitle>
              <CardDescription>Gerencie os processos</CardDescription>
            </div>
            <Button onClick={() => { setEditingProcesso(undefined); setFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Processo
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar processos..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : filteredProcessos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">Nenhum processo cadastrado.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Comunidade</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcessos.map((processo) => (
                  <TableRow key={processo.id}>
                    <TableCell className="font-medium">{processo.nome}</TableCell>
                    <TableCell>{processo.descricao || ""}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getComunidadeNome(processo.comunidadeId)}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(processo.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(processo)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(processo.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ProcessoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        processo={editingProcesso}
      />
    </div>
  )
}
