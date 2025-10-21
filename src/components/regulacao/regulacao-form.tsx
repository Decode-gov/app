"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateRegulacao, useUpdateRegulacao } from "@/hooks/api/use-regulacao"
import { RegulacaoResponse } from "@/types/api"
import { CreateRegulacaoSchema, type CreateRegulacaoFormData } from "@/schemas"

interface RegulacaoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  regulacao?: RegulacaoResponse
}

export function RegulacaoForm({ open, onOpenChange, regulacao }: RegulacaoFormProps) {
  const isEditing = !!regulacao
  const createRegulacao = useCreateRegulacao()
  const updateRegulacao = useUpdateRegulacao()

  const form = useForm<CreateRegulacaoFormData>({
    resolver: zodResolver(CreateRegulacaoSchema),
    defaultValues: {
      nome: "",
      epigrafe: "",
      descricao: "",
      orgaoRegulador: "",
      vigencia: "",
    },
  })

  useEffect(() => {
    if (regulacao && open) {
      form.reset({
        nome: regulacao.nome,
        epigrafe: regulacao.epigrafe,
        descricao: regulacao.descricao,
        orgaoRegulador: regulacao.orgaoRegulador || "",
        vigencia: regulacao.vigencia || "",
      })
    } else if (!open) {
      form.reset({
        nome: "",
        epigrafe: "",
        descricao: "",
        orgaoRegulador: "",
        vigencia: "",
      })
    }
  }, [regulacao, open, form])

  const onSubmit = async (data: CreateRegulacaoFormData) => {
    try {
      const payload = {
        ...data,
        orgaoRegulador: data.orgaoRegulador || undefined,
        vigencia: data.vigencia || undefined,
      }

      if (isEditing) {
        await updateRegulacao.mutateAsync({ id: regulacao.id, data: payload })
      } else {
        await createRegulacao.mutateAsync(payload)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Regulação" : "Nova Regulação"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize os dados da regulação." 
              : "Preencha os dados para criar uma nova regulação."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="epigrafe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Epígrafe *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Lei 13.709/2018, Resolução BCB 4658/2018" {...field} />
                  </FormControl>
                  <FormDescription>Identificador formal da regulação (lei, resolução, etc.)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Lei Geral de Proteção de Dados" {...field} />
                  </FormControl>
                  <FormDescription>Nome completo ou título da regulação</FormDescription>
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
                      placeholder="Descrição do objetivo e escopo da regulação" 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Resumo do conteúdo e finalidade da regulação</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orgaoRegulador"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Órgão Regulador</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: ANPD, Banco Central, CVM" {...field} />
                  </FormControl>
                  <FormDescription>Órgão responsável pela regulação (opcional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vigencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Vigência</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>Data em que a regulação entrou ou entrará em vigor (opcional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createRegulacao.isPending || updateRegulacao.isPending}
              >
                {createRegulacao.isPending || updateRegulacao.isPending 
                  ? "Salvando..." 
                  : isEditing ? "Atualizar" : "Criar"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
