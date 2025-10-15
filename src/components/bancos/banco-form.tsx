"use client"

import { useEffect } from "react"
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
import { useCreateBanco, useUpdateBanco } from "@/hooks/api/use-bancos"
import { BancoResponse } from "@/types/api"

const bancoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
  descricao: z.string().max(1000).optional(),
})

type BancoFormValues = z.infer<typeof bancoSchema>

interface BancoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  banco?: BancoResponse
}

export function BancoForm({ open, onOpenChange, banco }: BancoFormProps) {
  const createMutation = useCreateBanco()
  const updateMutation = useUpdateBanco()
  
  const form = useForm<BancoFormValues>({
    resolver: zodResolver(bancoSchema),
    defaultValues: {
      nome: "",
      descricao: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (banco) {
        form.reset({
          nome: banco.nome,
          descricao: banco.descricao || "",
        })
      } else {
        form.reset({
          nome: "",
          descricao: "",
        })
      }
    }
  }, [open, banco, form])

  const onSubmit = async (data: BancoFormValues) => {
    try {
      if (banco) {
        await updateMutation.mutateAsync({
          id: banco.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar banco:', error)
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {banco ? "Editar Banco de Dados" : "Novo Banco de Dados"}
          </DialogTitle>
          <DialogDescription>
            {banco 
              ? "Atualize as informações do banco de dados."
              : "Preencha os dados para criar um novo banco de dados."
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
                    <Input placeholder="Ex: PostgreSQL Produção" {...field} />
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
                      placeholder="Descrição do banco de dados..."
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
                {isSubmitting ? "Salvando..." : banco ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
