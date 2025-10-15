"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateDimensaoQualidade, useUpdateDimensaoQualidade } from "@/hooks/api/use-dimensoes-qualidade-new"
import { usePoliticasInternas } from "@/hooks/api/use-politicas-internas"
import { DimensaoQualidadeResponse } from "@/types/api"

const dimensaoFormSchema = z.object({
  nome: z.string().min(1, "Nome da dimensão é obrigatório").max(255),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  politicaId: z.string().min(1, "Política é obrigatória"),
})

type DimensaoFormValues = z.infer<typeof dimensaoFormSchema>

interface DimensaoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dimensao?: DimensaoQualidadeResponse
}

export function DimensaoQualidadeForm({ open, onOpenChange, dimensao }: DimensaoFormProps) {
  const createDimensao = useCreateDimensaoQualidade()
  const updateDimensao = useUpdateDimensaoQualidade()

  const { data: politicasData } = usePoliticasInternas({ page: 1, limit: 1000 })
  const politicas = politicasData?.data || []

  const form = useForm<DimensaoFormValues>({
    resolver: zodResolver(dimensaoFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      politicaId: "",
    },
  })

  useEffect(() => {
    if (dimensao) {
      form.reset({
        nome: dimensao.nome,
        descricao: dimensao.descricao,
        politicaId: dimensao.politicaId,
      })
    } else {
      form.reset({
        nome: "",
        descricao: "",
        politicaId: "",
      })
    }
  }, [dimensao, form])

  const onSubmit = async (data: DimensaoFormValues) => {
    try {
      const payload = {
        nome: data.nome,
        descricao: data.descricao,
        politicaId: data.politicaId,
      }

      if (dimensao) {
        await updateDimensao.mutateAsync({ id: dimensao.id, data: payload })
      } else {
        await createDimensao.mutateAsync(payload)
      }
      
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro ao salvar dimensão de qualidade:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dimensao ? "Editar" : "Nova"} Dimensão de Qualidade</DialogTitle>
          <DialogDescription>
            {dimensao ? "Edite as informações da dimensão" : "Preencha os dados para cadastrar uma nova dimensão de qualidade"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Dimensão *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Acurácia" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nome identificador da dimensão de qualidade
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
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a dimensão de qualidade..." 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Descrição detalhada da dimensão
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="politicaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Política *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a política" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {politicas.map((politica) => (
                        <SelectItem key={politica.id} value={politica.id}>
                          {politica.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Política interna relacionada a esta dimensão
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createDimensao.isPending || updateDimensao.isPending}>
                {createDimensao.isPending || updateDimensao.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
