"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"
import { useCreateOperacao, useUpdateOperacao } from "@/hooks/api/use-operacoes"
import { useAtividades } from "@/hooks/api/use-atividades"
import type { OperacaoResponse } from "@/types/api"
import { Skeleton } from "@/components/ui/skeleton"
import { AtividadeForm } from "@/components/atividades/atividade-form"

const formSchema = z.object({
  nome: z.string().min(1, { message: "Nome é obrigatório" }),
  tipo: z.enum(["CREATE", "READ", "UPDATE", "DELETE", "PROCESS", "VALIDATE", "TRANSFORM"], {
    message: "Tipo é obrigatório",
  }),
  frequencia: z.enum(["UNICA", "DIARIA", "SEMANAL", "MENSAL", "TRIMESTRAL", "ANUAL", "EVENTUAL"], {
    message: "Frequência é obrigatória",
  }),
  complexidade: z.enum(["BAIXA", "MEDIA", "ALTA"], { message: "Complexidade é obrigatória" }),
  atividadeId: z.string().min(1, { message: "Atividade é obrigatória" }),
  automatizada: z.boolean().optional(),
  critica: z.boolean().optional(),
})

type FormData = z.infer<typeof formSchema>

interface OperacaoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  operacao?: OperacaoResponse
}

// Helper para labels do tipo
const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    CREATE: "Criação",
    READ: "Leitura",
    UPDATE: "Atualização",
    DELETE: "Exclusão",
    PROCESS: "Processamento",
    VALIDATE: "Validação",
    TRANSFORM: "Transformação",
  }
  return labels[tipo] || tipo
}

// Helper para labels da frequência
const getFrequenciaLabel = (frequencia: string) => {
  const labels: Record<string, string> = {
    UNICA: "Única",
    DIARIA: "Diária",
    SEMANAL: "Semanal",
    MENSAL: "Mensal",
    TRIMESTRAL: "Trimestral",
    ANUAL: "Anual",
    EVENTUAL: "Eventual",
  }
  return labels[frequencia] || frequencia
}

// Helper para labels da complexidade
const getComplexidadeLabel = (complexidade: string) => {
  const labels: Record<string, string> = {
    BAIXA: "Baixa",
    MEDIA: "Média",
    ALTA: "Alta",
  }
  return labels[complexidade] || complexidade
}

export function OperacaoForm({ open, onOpenChange, operacao }: OperacaoFormProps) {
  const isEditing = !!operacao
  const [atividadeDialogOpen, setAtividadeDialogOpen] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: operacao?.nome ?? "",
      tipo: operacao?.tipo ?? "READ",
      frequencia: operacao?.frequencia ?? "EVENTUAL",
      complexidade: operacao?.complexidade ?? "MEDIA",
      atividadeId: operacao?.atividadeId ?? "",
      automatizada: operacao?.automatizada ?? false,
      critica: operacao?.critica ?? false,
    },
  })

  const { mutate: createOperacao, isPending: isCreating } = useCreateOperacao()
  const { mutate: updateOperacao, isPending: isUpdating } = useUpdateOperacao()
  const isPending = isCreating || isUpdating

  // Queries para selects
  const { data: atividadesData, isLoading: isLoadingAtividades } = useAtividades({ page: 1, limit: 1000 })
  const atividades = atividadesData?.data ?? []

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      automatizada: data.automatizada ?? false,
      critica: data.critica ?? false,
    }

    if (isEditing) {
      updateOperacao(
        { id: operacao.id, data: payload },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      createOperacao(payload, {
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
          <DialogTitle>{isEditing ? "Editar" : "Nova"} Operação</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da operação."
              : "Preencha os dados para criar uma nova operação."}
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
                    <Input placeholder="Nome da operação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo */}
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["CREATE", "READ", "UPDATE", "DELETE", "PROCESS", "VALIDATE", "TRANSFORM"].map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {getTipoLabel(tipo)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Frequência */}
            <FormField
              control={form.control}
              name="frequencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["UNICA", "DIARIA", "SEMANAL", "MENSAL", "TRIMESTRAL", "ANUAL", "EVENTUAL"].map(
                        (freq) => (
                          <SelectItem key={freq} value={freq}>
                            {getFrequenciaLabel(freq)}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Complexidade */}
            <FormField
              control={form.control}
              name="complexidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complexidade *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a complexidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["BAIXA", "MEDIA", "ALTA"].map((comp) => (
                        <SelectItem key={comp} value={comp}>
                          {getComplexidadeLabel(comp)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Atividade */}
            <FormField
              control={form.control}
              name="atividadeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atividade *</FormLabel>
                  <div className="flex gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          {isLoadingAtividades ? (
                            <Skeleton className="h-4 w-[200px]" />
                          ) : (
                            <SelectValue placeholder="Selecione a atividade" />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {atividades?.map((atividade) => (
                          <SelectItem key={atividade.id} value={atividade.id}>
                            {atividade.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setAtividadeDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Automatizada */}
            <FormField
              control={form.control}
              name="automatizada"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Automatizada</FormLabel>
                    <FormDescription>Marque se a operação é executada automaticamente</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Crítica */}
            <FormField
              control={form.control}
              name="critica"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Crítica</FormLabel>
                    <FormDescription>
                      Marque se a operação é crítica para o negócio
                    </FormDescription>
                  </div>
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

      <AtividadeForm
        open={atividadeDialogOpen}
        onOpenChange={setAtividadeDialogOpen}
      />
    </Dialog>
  )
}
