"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/ui/data-table"
import { useEmpresaAdmin } from "@/context/empresa-admin-context"
import {
  deleteEmpresasId,
  getGetEmpresasQueryKey,
  useGetEmpresas,
} from "@/api/generated/endpoints/empresas/empresas"
import { createColumns } from "@/components/empresas/columns"
import { EmpresaForm } from "@/components/empresas/empresa-form"
import type { GetEmpresas200 } from "@/api/generated/model"

type GetEmpresas200DataItem = GetEmpresas200["data"][number]

export default function EmpresasPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { isAdmin, isLoading: isLoadingAdmin } = useEmpresaAdmin()

  const [formOpen, setFormOpen] = useState(false)
  const [selectedEmpresa, setSelectedEmpresa] = useState<GetEmpresas200DataItem | undefined>()

  const { data: empresasData, isLoading, error } = useGetEmpresas({
    query: { enabled: isAdmin },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmpresasId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetEmpresasQueryKey() })
      toast.success("Empresa excluída com sucesso!")
    },
    onError: () => toast.error("Erro ao excluir empresa"),
  })

  if (!isLoadingAdmin && !isAdmin) {
    router.push("/")
    return null
  }

  const empresas = empresasData?.data ?? []

  const handleEdit = (empresa: GetEmpresas200DataItem) => {
    setSelectedEmpresa(empresa)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta empresa?")) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const columns = createColumns({ onEdit: handleEdit, onDelete: handleDelete })

  if (isLoading || isLoadingAdmin) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Empresas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as empresas cadastradas no sistema DECODE-GOV
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Empresas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as empresas cadastradas no sistema DECODE-GOV
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Erro ao carregar dados. Tente novamente.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Empresas
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as empresas cadastradas no sistema DECODE-GOV
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Building2 className="h-4 w-4 text-primary transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{empresas.length}</div>
            <p className="text-xs text-muted-foreground">empresas cadastradas</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Empresas</CardTitle>
              <CardDescription>Lista de todas as empresas cadastradas no sistema</CardDescription>
            </div>
            <Button
              className="gap-2"
              onClick={() => {
                setSelectedEmpresa(undefined)
                setFormOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              Nova Empresa
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataTable
            columns={columns}
            data={empresas}
            searchKey="nome"
            searchPlaceholder="Buscar empresas..."
          />
        </CardContent>
      </Card>

      <EmpresaForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setSelectedEmpresa(undefined)
        }}
        empresa={selectedEmpresa}
      />
    </div>
  )
}
