"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCreateSistema, useUpdateSistema } from "@/hooks/api/use-sistemas"
import { SistemaResponse } from "@/types/api"

const sistemaSchema = z.object({
  nome: z.string().min(1, "Nome do sistema é obrigatório").max(255),
  descricao: z.string().max(500).optional().nullable(),
  repositorio: z.string().url("URL inválida").max(500).optional().or(z.literal("")),
})

type SistemaFormValues = z.infer<typeof sistemaSchema>

interface SistemaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sistema?: SistemaResponse
}

export function SistemaForm({ open, onOpenChange, sistema }: SistemaFormProps) {
  const isEditing = !!sistema
  const createSistema = useCreateSistema()
  const updateSistema = useUpdateSistema()

  const form = useForm<SistemaFormValues>({
    resolver: zodResolver(sistemaSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      repositorio: "",
    },
  })

  useEffect(() => {
    if (sistema && open) {
      form.reset({
        nome: sistema.nome,
        descricao: sistema.descricao || "",
        repositorio: sistema.repositorio || "",
      })
    } else if (!open) {
      form.reset()
    }
  }, [sistema, open, form])

  const onSubmit = async (data: SistemaFormValues) => {
    try {
      const payload = {
        nome: data.nome,
        descricao: data.descricao || null,
        repositorio: data.repositorio || "",
      }

      if (isEditing) {
        await updateSistema.mutateAsync({ id: sistema.id, data: payload })
      } else {
        await createSistema.mutateAsync(payload)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Sistema" : "Novo Sistema"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize os dados do sistema." 
              : "Preencha os dados para criar um novo sistema."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Sistema *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Sistema de Gestão Integrada" {...field} />
                  </FormControl>
                  <FormDescription>Nome do sistema ou aplicação (máx. 255 caracteres)</FormDescription>
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
                    <Input placeholder="Descrição do sistema" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Descrição do sistema (opcional, máx. 500 caracteres)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repositorio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repositório</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/org/repo" {...field} />
                  </FormControl>
                  <FormDescription>URL do repositório de código (opcional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createSistema.isPending || updateSistema.isPending}
              >
                {createSistema.isPending || updateSistema.isPending 
                  ? "Salvando..." 
                  : isEditing ? "Atualizar" : "Criar"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
