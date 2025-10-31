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
import { useCreateComiteAprovador, useUpdateComiteAprovador } from "@/hooks/api/use-comites-aprovadores"
import { ComiteAprovadorResponse } from "@/types/api"

const comiteAprovadorSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
})

type ComiteAprovadorFormValues = z.infer<typeof comiteAprovadorSchema>

interface ComiteAprovadorFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comite?: ComiteAprovadorResponse
}

export function ComiteAprovadorForm({ open, onOpenChange, comite }: ComiteAprovadorFormProps) {
  const createMutation = useCreateComiteAprovador()
  const updateMutation = useUpdateComiteAprovador()
  
  const form = useForm<ComiteAprovadorFormValues>({
    resolver: zodResolver(comiteAprovadorSchema),
    defaultValues: {
      nome: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (comite) {
        form.reset({
          nome: comite.nome,
        })
      } else {
        form.reset({
          nome: "",
        })
      }
    }
  }, [open, comite, form])

  const onSubmit = async (data: ComiteAprovadorFormValues) => {
    try {
      if (comite) {
        await updateMutation.mutateAsync({
          id: comite.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar comitê aprovador:', error)
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
            {comite ? "Editar comitê aprovador" : "Novo comitê aprovador"}
          </DialogTitle>
          <DialogDescription>
            {comite 
              ? "Atualize as informações do comitê aprovador."
              : "Preencha os dados para criar um novo comitê aprovador."
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
                    <Input placeholder="Ex: Comitê de Governança" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Máximo 255 caracteres
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
                {isSubmitting ? "Salvando..." : comite ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
