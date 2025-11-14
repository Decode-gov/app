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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateBanco, useUpdateBanco } from "@/hooks/api/use-bancos"
import { useSistemas } from "@/hooks/api/use-sistemas"
import { BancoResponse } from "@/types/api"
import { CreateBancoSchema, type CreateBancoFormData } from "@/schemas"

interface BancoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  banco?: BancoResponse
}

export function BancoForm({ open, onOpenChange, banco }: BancoFormProps) {
  const createMutation = useCreateBanco()
  const updateMutation = useUpdateBanco()
  const { data: sistemasData } = useSistemas({ page: 1, limit: 1000 })
  
  const form = useForm<CreateBancoFormData>({
    resolver: zodResolver(CreateBancoSchema),
    defaultValues: {
      nome: "",
      sistemaId: null,
    },
  })

  useEffect(() => {
    if (open) {
      if (banco) {
        form.reset({
          nome: banco.nome,
          sistemaId: banco.sistemaId || null,
        })
      } else {
        form.reset({
          nome: "",
          sistemaId: null,
        })
      }
    }
  }, [open, banco, form])

  const onSubmit = async (data: CreateBancoFormData) => {
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
  const sistemas = sistemasData?.data || []

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
              name="sistemaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistema</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um sistema" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">Nenhum</SelectItem>
                      {sistemas.map((sistema) => (
                        <SelectItem key={sistema.id} value={sistema.id}>
                          {sistema.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
