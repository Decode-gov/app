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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateNecessidadeInformacao, useUpdateNecessidadeInformacao } from "@/hooks/api/use-necessidades-informacao"
import { NecessidadeInformacaoResponse } from "@/types/api"
import { Loader2 } from "lucide-react"

const necessidadeSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255, "Nome deve ter no máximo 255 caracteres"),
  descricao: z.string().max(2000, "Descrição deve ter no máximo 2000 caracteres").optional(),
})

type NecessidadeFormValues = z.infer<typeof necessidadeSchema>

interface NecessidadeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  necessidade?: NecessidadeInformacaoResponse
}

export function NecessidadeForm({ open, onOpenChange, necessidade }: NecessidadeFormProps) {
  const createMutation = useCreateNecessidadeInformacao()
  const updateMutation = useUpdateNecessidadeInformacao()
  
  const form = useForm<NecessidadeFormValues>({
    resolver: zodResolver(necessidadeSchema),
    defaultValues: {
      nome: "",
      descricao: "",
    },
  })

  useEffect(() => {
    if (necessidade) {
      form.reset({
        nome: necessidade.nome,
        descricao: necessidade.descricao || "",
      })
    } else {
      form.reset({
        nome: "",
        descricao: "",
      })
    }
  }, [necessidade, form])

  async function onSubmit(values: NecessidadeFormValues) {
    try {
      if (necessidade) {
        await updateMutation.mutateAsync({
          id: necessidade.id,
          data: values,
        })
      } else {
        await createMutation.mutateAsync(values)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro ao salvar necessidade:", error)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {necessidade ? "Editar Necessidade de Informação" : "Nova Necessidade de Informação"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {necessidade ? "atualizar" : "criar"} uma necessidade de informação
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
                    <Input
                      placeholder="Nome da necessidade de informação..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Nome identificador da necessidade de informação
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
                      placeholder="Descreva a necessidade de informação..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Descrição detalhada da necessidade de informação
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {necessidade ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
