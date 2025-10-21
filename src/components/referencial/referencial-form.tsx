﻿"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { useCreateListaClassificacao, useUpdateListaClassificacao } from "@/hooks/api/use-listas-classificacao"
import { usePoliticasInternas } from "@/hooks/api/use-politicas-internas"
import { ListaClassificacaoResponse } from "@/types/api"
import { ListaClassificacaoSchema, type CreateListaClassificacaoFormData } from "@/schemas"
import { PoliticaInternaForm } from "@/components/politicas/politica-interna-form"

type ReferencialFormValues = CreateListaClassificacaoFormData

interface ReferencialFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  referencial?: ListaClassificacaoResponse
}

const CATEGORIAS = [
  { value: "Publico", label: "Público", color: "bg-green-500" },
  { value: "Interno", label: "Interno", color: "bg-blue-500" },
  { value: "Confidencial", label: "Confidencial", color: "bg-orange-500" },
  { value: "Restrito", label: "Restrito", color: "bg-red-500" },
] as const

export function ReferencialForm({ open, onOpenChange, referencial }: ReferencialFormProps) {
  const isEditing = !!referencial
  const [isPoliticaFormOpen, setIsPoliticaFormOpen] = useState(false)
  const createReferencial = useCreateListaClassificacao()
  const updateReferencial = useUpdateListaClassificacao()
  const { data: politicasData } = usePoliticasInternas()
  
  const politicas = politicasData?.data || []

  const form = useForm<ReferencialFormValues>({
    resolver: zodResolver(ListaClassificacaoSchema),
    defaultValues: {
      categoria: "Publico",
      descricao: "",
      politicaId: "",
    },
  })

  useEffect(() => {
    if (referencial && open) {
      form.reset({
        categoria: referencial.categoria,
        descricao: referencial.descricao,
        politicaId: referencial.politicaId,
      })
    } else if (!open) {
      form.reset()
    }
  }, [referencial, open, form])

  const onSubmit = async (data: ReferencialFormValues) => {
    try {
      if (isEditing) {
        await updateReferencial.mutateAsync({ id: referencial.id, data })
      } else {
        await createReferencial.mutateAsync(data)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro:", error)
    }
  }

  const categoriaAtual = form.watch("categoria")
  const categoriaConfig = CATEGORIAS.find(c => c.value === categoriaAtual)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Referencial" : "Novo Referencial"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados do referencial de classificação." : "Preencha os dados para criar um novo referencial."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria">
                          {field.value && (
                            <div className="flex items-center gap-2">
                              <Badge className={`${categoriaConfig?.color} text-white`}>
                                {CATEGORIAS.find(c => c.value === field.value)?.label}
                              </Badge>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIAS.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={`${cat.color} text-white`}>{cat.label}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Nível de sensibilidade da informação</FormDescription>
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
                    <Textarea placeholder="Descrição do referencial de classificação" rows={4} {...field} />
                  </FormControl>
                  <FormDescription>Detalhes sobre os critérios e aplicação desta classificação (máx. 2000 caracteres)</FormDescription>
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
                  <div className="flex gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione a política">
                            {field.value && politicas && (
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {politicas.find(p => p.id === field.value)?.nome}
                                </Badge>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {politicas?.map(politica => (
                          <SelectItem key={politica.id} value={politica.id}>
                            {politica.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setIsPoliticaFormOpen(true)}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription>Política interna associada a esta classificação</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createReferencial.isPending || updateReferencial.isPending}>
                {createReferencial.isPending || updateReferencial.isPending ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      
      <PoliticaInternaForm 
        open={isPoliticaFormOpen} 
        onOpenChange={setIsPoliticaFormOpen} 
      />
    </Dialog>
  )
}
