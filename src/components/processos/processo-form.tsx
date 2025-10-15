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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useCreateProcesso, useUpdateProcesso } from "@/hooks/api/use-processos"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { ProcessoResponse } from "@/types/api"
import { ComunidadeForm } from "../dominios/comunidade-form"

const processoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
  descricao: z.string().max(1000).optional(),
  comunidadeId: z.string().min(1, "Comunidade é obrigatória"),
})

type ProcessoFormValues = z.infer<typeof processoSchema>

interface ProcessoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  processo?: ProcessoResponse
}

export function ProcessoForm({ open, onOpenChange, processo }: ProcessoFormProps) {
  const [comunidadeDialogOpen, setComunidadeDialogOpen] = useState(false)
  
  const createMutation = useCreateProcesso()
  const updateMutation = useUpdateProcesso()
  const { data: comunidadesData } = useComunidades()
  
  const form = useForm<ProcessoFormValues>({
    resolver: zodResolver(processoSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      comunidadeId: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (processo) {
        form.reset({
          nome: processo.nome,
          descricao: processo.descricao || "",
          comunidadeId: processo.comunidadeId,
        })
      } else {
        form.reset({
          nome: "",
          descricao: "",
          comunidadeId: "",
        })
      }
    }
  }, [open, processo, form])

  const onSubmit = async (data: ProcessoFormValues) => {
    try {
      if (processo) {
        await updateMutation.mutateAsync({
          id: processo.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar processo:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createMutation.isPending && !updateMutation.isPending) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const comunidades = comunidadesData?.data || []

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {processo ? "Editar Processo" : "Novo Processo"}
            </DialogTitle>
            <DialogDescription>
              {processo 
                ? "Atualize as informações do processo."
                : "Preencha os dados para criar um novo processo."
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
                      <Input placeholder="Ex: Processo de Vendas" {...field} />
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
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição do processo..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Máximo 1000 caracteres
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
                                  <div className="flex flex-col">
                                    <span>{comunidade.nome}</span>
                                    {comunidade.descricao && (
                                      <span className="text-xs text-muted-foreground line-clamp-1">
                                        {comunidade.descricao}
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
                        onClick={() => setComunidadeDialogOpen(true)}
                        title="Criar nova comunidade"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs">
                      Comunidade responsável por este processo
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
                  {isSubmitting ? "Salvando..." : processo ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ComunidadeForm 
        open={comunidadeDialogOpen}
        onOpenChange={setComunidadeDialogOpen}
      />
    </>
  )
}
