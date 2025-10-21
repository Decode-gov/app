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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCreateNecessidadeInformacao, useUpdateNecessidadeInformacao } from "@/hooks/api/use-necessidades-informacao"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { NecessidadeInformacaoResponse } from "@/types/api"
import { Loader2 } from "lucide-react"

const necessidadeSchema = z.object({
  questaoGerencial: z.string().min(1, "Questão gerencial é obrigatória").max(2000, "Questão gerencial deve ter no máximo 2000 caracteres"),
  elementoEstrategico: z.string().max(500, "Elemento estratégico deve ter no máximo 500 caracteres").optional(),
  elementoTatico: z.string().max(500, "Elemento tático deve ter no máximo 500 caracteres").optional(),
  origemQuestao: z.string().min(1, "Origem da questão é obrigatória").max(255, "Origem deve ter no máximo 255 caracteres"),
  comunidadeId: z.string().min(1, "Comunidade é obrigatória"),
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
  const { data: comunidadesData } = useComunidades({ page: 1, limit: 1000 })
  
  const form = useForm<NecessidadeFormValues>({
    resolver: zodResolver(necessidadeSchema),
    defaultValues: {
      questaoGerencial: "",
      elementoEstrategico: "",
      elementoTatico: "",
      origemQuestao: "",
      comunidadeId: "",
    },
  })

  useEffect(() => {
    if (necessidade) {
      form.reset({
        questaoGerencial: necessidade.questaoGerencial,
        elementoEstrategico: necessidade.elementoEstrategico || "",
        elementoTatico: necessidade.elementoTatico || "",
        origemQuestao: necessidade.origemQuestao,
        comunidadeId: necessidade.comunidadeId,
      })
    } else {
      form.reset({
        questaoGerencial: "",
        elementoEstrategico: "",
        elementoTatico: "",
        origemQuestao: "",
        comunidadeId: "",
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
              name="questaoGerencial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Questão Gerencial *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a questão gerencial..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Questão principal que precisa ser respondida
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="elementoEstrategico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Elemento Estratégico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Elemento estratégico relacionado..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="elementoTatico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Elemento Tático</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Elemento tático relacionado..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="origemQuestao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem da Questão *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="De onde surgiu a questão..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comunidadeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comunidade *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a comunidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {comunidadesData?.data?.map((comunidade) => (
                        <SelectItem key={comunidade.id} value={comunidade.id}>
                          {comunidade.nome}
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
