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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateTipoDados, useUpdateTipoDados } from "@/hooks/api/use-tipos-dados"
import { TipoDadosResponse } from "@/types/api"

const tipoDadosSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
  descricao: z.string().max(1000).optional(),
  categoria: z.enum(['PRIMITIVO', 'COMPLEXO', 'ESTRUTURADO', 'SEMI_ESTRUTURADO', 'NAO_ESTRUTURADO']).optional(),
  permiteNulo: z.boolean().optional(),
})

type TipoDadosFormValues = z.infer<typeof tipoDadosSchema>

interface TipoDadosFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tipoDados?: TipoDadosResponse
}

export function TipoDadosForm({ open, onOpenChange, tipoDados }: TipoDadosFormProps) {
  const createMutation = useCreateTipoDados()
  const updateMutation = useUpdateTipoDados()
  
  const form = useForm<TipoDadosFormValues>({
    resolver: zodResolver(tipoDadosSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      categoria: undefined,
      permiteNulo: false,
    },
  })

  useEffect(() => {
    if (open) {
      if (tipoDados) {
        form.reset({
          nome: tipoDados.nome,
          descricao: tipoDados.descricao || "",
          categoria: tipoDados.categoria,
          permiteNulo: tipoDados.permiteNulo || false,
        })
      } else {
        form.reset({
          nome: "",
          descricao: "",
          categoria: undefined,
          permiteNulo: false,
        })
      }
    }
  }, [open, tipoDados, form])

  const onSubmit = async (data: TipoDadosFormValues) => {
    try {
      if (tipoDados) {
        await updateMutation.mutateAsync({
          id: tipoDados.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar tipo de dados:', error)
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
            {tipoDados ? "Editar Tipo de Dados" : "Novo Tipo de Dados"}
          </DialogTitle>
          <DialogDescription>
            {tipoDados 
              ? "Atualize as informações do tipo de dados."
              : "Preencha os dados para criar um novo tipo de dados."
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
                    <Input placeholder="Ex: VARCHAR, INTEGER, JSON" {...field} />
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
                      placeholder="Descrição do tipo de dados..."
                      className="min-h-[60px]"
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
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PRIMITIVO">Primitivo</SelectItem>
                      <SelectItem value="COMPLEXO">Complexo</SelectItem>
                      <SelectItem value="ESTRUTURADO">Estruturado</SelectItem>
                      <SelectItem value="SEMI_ESTRUTURADO">Semi-estruturado</SelectItem>
                      <SelectItem value="NAO_ESTRUTURADO">Não estruturado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permiteNulo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Permite Nulo
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Indica se este tipo de dados aceita valores nulos
                    </FormDescription>
                  </div>
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
                {isSubmitting ? "Salvando..." : tipoDados ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
