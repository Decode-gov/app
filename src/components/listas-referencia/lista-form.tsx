"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateListaReferencia, useUpdateListaReferencia } from "@/hooks/api/use-listas-referencia"
import { useDefinicoes } from "@/hooks/api/use-definicoes"
import { useTabelas } from "@/hooks/api/use-tabelas"
import { useColunas } from "@/hooks/api/use-colunas"
import type { ListaReferenciaResponse } from "@/types/api"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  nome: z.string().min(1, { message: "Nome é obrigatório" }),
  descricao: z.string().min(1, { message: "Descrição é obrigatória" }),
  termoId: z.string().min(1, { message: "Termo é obrigatório" }),
  tabelaId: z.string().optional(),
  colunaId: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface ListaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lista?: ListaReferenciaResponse
}

export function ListaForm({ open, onOpenChange, lista }: ListaFormProps) {
  const isEditing = !!lista

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: lista?.nome ?? "",
      descricao: lista?.descricao ?? "",
      termoId: lista?.termoId ?? "",
      tabelaId: lista?.tabelaId ?? "",
      colunaId: lista?.colunaId ?? "",
    },
  })

  const { mutate: createLista, isPending: isCreating } = useCreateListaReferencia()
  const { mutate: updateLista, isPending: isUpdating } = useUpdateListaReferencia()
  const isPending = isCreating || isUpdating

  // Queries para selects
  const { data: termosData, isLoading: isLoadingTermos } = useDefinicoes({ page: 1, limit: 1000 })
  const { data: tabelasData, isLoading: isLoadingTabelas } = useTabelas({ page: 1, limit: 1000 })
  const { data: colunasData, isLoading: isLoadingColunas } = useColunas({ page: 1, limit: 1000 })

  const termos = termosData?.data ?? []
  const tabelas = tabelasData?.data ?? []
  const colunas = colunasData?.data ?? []

  const onSubmit = (data: FormData) => {
    const payload = {
      nome: data.nome,
      descricao: data.descricao,
      termoId: data.termoId,
      tabelaId: data.tabelaId || undefined,
      colunaId: data.colunaId || undefined,
    }

    if (isEditing) {
      updateLista(
        { id: lista.id, data: payload },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      createLista(payload, {
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
          <DialogTitle>{isEditing ? "Editar" : "Nova"} Lista de Referência</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da lista de referência."
              : "Preencha os dados para criar uma nova lista de referência."}
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
                    <Input placeholder="Nome da lista de referência" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a lista de referência"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Termo (obrigatório) */}
            <FormField
              control={form.control}
              name="termoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Termo de Negócio *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {isLoadingTermos ? (
                          <Skeleton className="h-4 w-[200px]" />
                        ) : (
                          <SelectValue placeholder="Selecione o termo" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {termos?.map((termo) => (
                        <SelectItem key={termo.id} value={termo.id}>
                          {termo.termo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tabela (opcional) */}
            <FormField
              control={form.control}
              name="tabelaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tabela (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {isLoadingTabelas ? (
                          <Skeleton className="h-4 w-[200px]" />
                        ) : (
                          <SelectValue placeholder="Selecione a tabela" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      {tabelas?.map((tabela) => (
                        <SelectItem key={tabela.id} value={tabela.id}>
                          {tabela.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Coluna (opcional) */}
            <FormField
              control={form.control}
              name="colunaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coluna (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {isLoadingColunas ? (
                          <Skeleton className="h-4 w-[200px]" />
                        ) : (
                          <SelectValue placeholder="Selecione a coluna" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      {colunas?.map((coluna) => (
                        <SelectItem key={coluna.id} value={coluna.id}>
                          {coluna.tabela}.{coluna.coluna}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
    </Dialog>
  )
}
