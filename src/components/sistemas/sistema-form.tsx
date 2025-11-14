"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { useCreateSistema, useUpdateSistema } from "@/hooks/api/use-sistemas"
import { SistemaResponse } from "@/types/api"
import { CreateSistemaSchema, type CreateSistemaFormData } from "@/schemas"

interface SistemaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sistema?: SistemaResponse
}

export function SistemaForm({ open, onOpenChange, sistema }: SistemaFormProps) {
  const createMutation = useCreateSistema()
  const updateMutation = useUpdateSistema()
  
  const form = useForm<CreateSistemaFormData>({
    resolver: zodResolver(CreateSistemaSchema),
    defaultValues: {
      nome: "",
      descricao: null,
      repositorio: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (sistema) {
        form.reset({
          nome: sistema.nome,
          descricao: sistema.descricao || null,
          repositorio: sistema.repositorio,
        })
      } else {
        form.reset({
          nome: "",
          descricao: null,
          repositorio: "",
        })
      }
    }
  }, [open, sistema, form])

  const onSubmit = async (data: CreateSistemaFormData) => {
    try {
      if (sistema) {
        await updateMutation.mutateAsync({
          id: sistema.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar sistema:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createMutation.isPending && !updateMutation.isPending) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {sistema ? "Editar Sistema" : "Novo Sistema"}
          </DialogTitle>
          <DialogDescription>
            {sistema 
              ? "Atualize as informações do sistema."
              : "Preencha os dados para criar um novo sistema."
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
                    <Input placeholder="Ex: ERP Financeiro" {...field} />
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
                      placeholder="Descrição do sistema..."
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
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
                    <Input placeholder="Ex: https://github.com/org/repo" {...field} />
                  </FormControl>
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
                {isSubmitting ? "Salvando..." : sistema ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
