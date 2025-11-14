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
    },
  })

  useEffect(() => {
    if (open) {
      if (processo) {
        form.reset({
          nome: processo.nome,
          descricao: processo.descricao || "",
        })
      } else {
        form.reset({
          nome: "",
          descricao: "",
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
