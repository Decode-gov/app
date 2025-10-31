"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Loader2 } from "lucide-react"
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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Button } from "@/components/ui/button"
import { DefinicaoResponse } from "@/types/api"
import { useCreateDefinicao, useUpdateDefinicao } from "@/hooks/api/use-definicoes"
import { CreateDefinicaoSchema, type CreateDefinicaoFormData } from "@/schemas"

type FormData = CreateDefinicaoFormData

interface TermoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  termo?: DefinicaoResponse
}

export function TermoForm({ open, onOpenChange, termo }: TermoFormProps) {
  const createMutation = useCreateDefinicao()
  const updateMutation = useUpdateDefinicao()

  const form = useForm<FormData>({
    resolver: zodResolver(CreateDefinicaoSchema),
    defaultValues: {
      termo: "",
      definicao: "",
      sigla: undefined,
    },
  })

  useEffect(() => {
    if (termo) {
      form.reset({
        termo: termo.termo,
        definicao: termo.definicao,
        sigla: termo.sigla || undefined,
      })
    } else {
      form.reset({
        termo: "",
        definicao: "",
        sigla: undefined,
      })
    }
  }, [termo, form])

  const onSubmit = async (data: FormData) => {
    try {
      if (termo) {
        await updateMutation.mutateAsync({ id: termo.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro ao salvar termo:", error)
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {termo ? "Editar Termo" : "Novo Termo"}
          </DialogTitle>
          <DialogDescription>
            {termo
              ? "Atualize as informações do termo."
              : "Preencha os campos para cadastrar um novo termo."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="termo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Definição do termo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a definição do termo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="definicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categorização do termo *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite a categorização do termo..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sigla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sigla</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a sigla/abreviação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {termo ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
