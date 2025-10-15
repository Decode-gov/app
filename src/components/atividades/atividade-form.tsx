"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useCreateAtividade, useUpdateAtividade } from "@/hooks/api/use-atividades"
import { useProcessos } from "@/hooks/api/use-processos"
import { AtividadeResponse } from "@/types/api"
import { ProcessoForm } from "@/components/processos/processo-form"

const formSchema = z.object({
  nome: z.string({ message: "Nome é obrigatório" }).min(1, "Nome é obrigatório"),
  descricao: z.string({ message: "Descrição é obrigatória" }).min(1, "Descrição é obrigatória"),
  status: z.enum(['PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'PAUSADA'], {
    message: "Status é obrigatório",
  }),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'], {
    message: "Prioridade é obrigatória",
  }),
  processoId: z.string({ message: "Processo é obrigatório" }),
  responsavel: z.string().optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AtividadeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  atividade?: AtividadeResponse
}

export function AtividadeForm({ open, onOpenChange, atividade }: AtividadeFormProps) {
  const isEditing = !!atividade
  const [processoDialogOpen, setProcessoDialogOpen] = useState(false)
  const createAtividade = useCreateAtividade()
  const updateAtividade = useUpdateAtividade()

  const { data: processosData } = useProcessos({ page: 1, limit: 1000 })
  const processos = processosData?.data || []

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      status: "PLANEJADA",
      prioridade: "MEDIA",
      processoId: "",
      responsavel: "",
      dataInicio: "",
      dataFim: "",
    },
  })

  useEffect(() => {
    if (atividade) {
      form.reset({
        nome: atividade.nome || "",
        descricao: atividade.descricao || "",
        status: atividade.status || "PLANEJADA",
        prioridade: atividade.prioridade || "MEDIA",
        processoId: atividade.processoId || "",
        responsavel: atividade.responsavel || "",
        dataInicio: atividade.dataInicio ? atividade.dataInicio.split('T')[0] : "",
        dataFim: atividade.dataFim ? atividade.dataFim.split('T')[0] : "",
      })
    } else {
      form.reset({
        nome: "",
        descricao: "",
        status: "PLANEJADA",
        prioridade: "MEDIA",
        processoId: "",
        responsavel: "",
        dataInicio: "",
        dataFim: "",
      })
    }
  }, [atividade, form])

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        nome: data.nome,
        descricao: data.descricao,
        status: data.status,
        prioridade: data.prioridade,
        processoId: data.processoId,
        responsavel: data.responsavel || undefined,
        dataInicio: data.dataInicio || undefined,
        dataFim: data.dataFim || undefined,
      }

      if (isEditing) {
        await updateAtividade.mutateAsync({ id: atividade.id, data: payload })
      } else {
        await createAtividade.mutateAsync(payload)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro ao salvar atividade:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar" : "Nova"} Atividade</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações da atividade"
              : "Preencha os campos para criar uma nova atividade"}
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
                    <Input placeholder="Ex: Implementar validação de dados" {...field} />
                  </FormControl>
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
                      placeholder="Descreva a atividade em detalhes"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PLANEJADA">Planejada</SelectItem>
                        <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                        <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                        <SelectItem value="PAUSADA">Pausada</SelectItem>
                        <SelectItem value="CANCELADA">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prioridade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BAIXA">Baixa</SelectItem>
                        <SelectItem value="MEDIA">Média</SelectItem>
                        <SelectItem value="ALTA">Alta</SelectItem>
                        <SelectItem value="CRITICA">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="processoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processo *</FormLabel>
                  <div className="flex gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione o processo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {processos.map((processo) => (
                          <SelectItem key={processo.id} value={processo.id}>
                            {processo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setProcessoDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataFim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createAtividade.isPending || updateAtividade.isPending}>
                {createAtividade.isPending || updateAtividade.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      <ProcessoForm
        open={processoDialogOpen}
        onOpenChange={setProcessoDialogOpen}
      />
    </Dialog>
  )
}
