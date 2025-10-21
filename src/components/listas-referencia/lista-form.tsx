"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateListaReferencia, useUpdateListaReferencia } from "@/hooks/api/use-listas-referencia"
import type { ListaReferenciaResponse } from "@/types/api"
import { CreateListaReferenciaSchema, type CreateListaReferenciaFormData } from "@/schemas"

type FormData = CreateListaReferenciaFormData

interface ListaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lista?: ListaReferenciaResponse
}

export function ListaForm({ open, onOpenChange, lista }: ListaFormProps) {
  const isEditing = !!lista

  const form = useForm<FormData>({
    resolver: zodResolver(CreateListaReferenciaSchema),
    defaultValues: {
      nome: lista?.nome ?? "",
      descricao: lista?.descricao ?? "",
    },
  })

  const { mutate: createLista, isPending: isCreating } = useCreateListaReferencia()
  const { mutate: updateLista, isPending: isUpdating } = useUpdateListaReferencia()
  const isPending = isCreating || isUpdating

  const onSubmit = (data: FormData) => {
    const payload = {
      nome: data.nome,
      descricao: data.descricao,
    }

    if (isEditing) {
      updateLista(
        { id: lista.id, data: payload },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      createLista(payload, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar" : "Nova"} Lista de Referência</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da lista de referência."
              : "Preencha os dados para criar uma nova lista de referência."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da lista de referência" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a lista de referência"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
