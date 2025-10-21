"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useCreateKpi, useUpdateKpi } from "@/hooks/api/use-kpis"
import { useProcessos } from "@/hooks/api/use-processos"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { KpiResponse } from "@/types/api"

import { ProcessoForm } from "@/components/processos/processo-form"
import { ComunidadeForm } from "@/components/dominios/comunidade-form"

const kpiSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
  processoId: z.string().optional(),
  comunidadeId: z.string().optional(),
})

type KpiFormValues = z.infer<typeof kpiSchema>

interface KpiFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kpi?: KpiResponse
}

export function KpiForm({ open, onOpenChange, kpi }: KpiFormProps) {
  const [processoDialogOpen, setProcessoDialogOpen] = useState(false)
  const [comunidadeDialogOpen, setComunidadeDialogOpen] = useState(false)
  
  const createMutation = useCreateKpi()
  const updateMutation = useUpdateKpi()
  const { data: processosData } = useProcessos()
  const { data: comunidadesData } = useComunidades()
  
  const form = useForm<KpiFormValues>({
    resolver: zodResolver(kpiSchema),
    defaultValues: {
      nome: "",
      processoId: "",
      comunidadeId: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (kpi) {
        form.reset({
          nome: kpi.nome,
          processoId: kpi.processoId || "",
          comunidadeId: kpi.comunidadeId || "",
        })
      } else {
        form.reset({
          nome: "",
          processoId: "",
          comunidadeId: "",
        })
      }
    }
  }, [open, kpi, form])

  const onSubmit = async (data: KpiFormValues) => {
    try {
      if (kpi) {
        await updateMutation.mutateAsync({
          id: kpi.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar KPI:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createMutation.isPending && !updateMutation.isPending) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const processos = processosData?.data || []
  const comunidades = comunidadesData?.data || []

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {kpi ? "Editar KPI" : "Novo KPI"}
            </DialogTitle>
            <DialogDescription>
              {kpi 
                ? "Atualize as informações do KPI."
                : "Preencha os dados para criar um novo KPI."
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Taxa de Conversão" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Máximo 255 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="processoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processo</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o processo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {processos.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhum processo encontrado
                              </div>
                            ) : (
                              processos.map((processo) => (
                                <SelectItem key={processo.id} value={processo.id}>
                                  <div className="flex flex-col">
                                    <span>{processo.nome}</span>
                                    {processo.descricao && (
                                      <span className="text-xs text-muted-foreground line-clamp-1">
                                        {processo.descricao}
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setProcessoDialogOpen(true)}
                        title="Criar novo processo"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs">
                      Processo monitorado por este KPI
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comunidadeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comunidade *</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a comunidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {comunidades.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhuma comunidade encontrada
                              </div>
                            ) : (
                              comunidades.map((comunidade) => (
                                <SelectItem key={comunidade.id} value={comunidade.id}>
                                  {comunidade.nome}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setComunidadeDialogOpen(true)}
                        title="Criar nova comunidade"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs">
                      Comunidade responsável pelo KPI
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : kpi ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ProcessoForm 
        open={processoDialogOpen}
        onOpenChange={setProcessoDialogOpen}
      />

      <ComunidadeForm 
        open={comunidadeDialogOpen}
        onOpenChange={setComunidadeDialogOpen}
      />
    </>
  )
}
