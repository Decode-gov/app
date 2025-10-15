"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateRegraQualidade, useUpdateRegraQualidade } from "@/hooks/api/use-regras-qualidade"
import { useDimensoesQualidade } from "@/hooks/api/use-dimensoes-qualidade-new"
import { useTabelas } from "@/hooks/api/use-tabelas"
import { useColunas } from "@/hooks/api/use-colunas"
import { usePapeis } from "@/hooks/api/use-papeis"
import { RegraQualidadeResponse } from "@/types/api"

const formSchema = z.object({
  dimensaoId: z.string({ message: "Dimensão é obrigatória" }),
  descricao: z.string({ message: "Descrição é obrigatória" }).min(1, "Descrição é obrigatória"),
  tabelaId: z.string().optional(),
  colunaId: z.string().optional(),
  responsavelId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface RegraQualidadeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  regra?: RegraQualidadeResponse
}

export function RegraQualidadeForm({ open, onOpenChange, regra }: RegraQualidadeFormProps) {
  const isEditing = !!regra
  const createRegra = useCreateRegraQualidade()
  const updateRegra = useUpdateRegraQualidade()

  const { data: dimensoesData } = useDimensoesQualidade({ page: 1, limit: 1000 })
  const { data: tabelasData } = useTabelas({ page: 1, limit: 1000 })
  const { data: colunasData } = useColunas({ page: 1, limit: 1000 })
  const { data: papeisData } = usePapeis({ page: 1, limit: 1000 })

  const dimensoes = dimensoesData?.data || []
  const tabelas = tabelasData?.data || []
  const colunas = colunasData?.data || []
  const papeis = papeisData?.data || []

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dimensaoId: "",
      descricao: "",
      tabelaId: "",
      colunaId: "",
      responsavelId: "",
    },
  })

  // ColunaResponse não tem tabelaId direto, então não filtramos
  const colunasFiltered = colunas

  useEffect(() => {
    if (regra) {
      form.reset({
        dimensaoId: regra.dimensaoId || "",
        descricao: regra.descricao || "",
        tabelaId: regra.tabelaId || "",
        colunaId: regra.colunaId || "",
        responsavelId: regra.responsavelId || "",
      })
    } else {
      form.reset({
        dimensaoId: "",
        descricao: "",
        tabelaId: "",
        colunaId: "",
        responsavelId: "",
      })
    }
  }, [regra, form])

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        dimensaoId: data.dimensaoId,
        descricao: data.descricao,
        tabelaId: data.tabelaId || undefined,
        colunaId: data.colunaId || undefined,
        responsavelId: data.responsavelId || undefined,
      }

      if (isEditing) {
        await updateRegra.mutateAsync({ id: regra.id, data: payload })
      } else {
        await createRegra.mutateAsync(payload)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro ao salvar regra:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar" : "Nova"} Regra de Qualidade</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações da regra de qualidade"
              : "Preencha os campos para criar uma nova regra de qualidade"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dimensaoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensão de Qualidade *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a dimensão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dimensoes.map((dimensao) => (
                        <SelectItem key={dimensao.id} value={dimensao.id}>
                          {dimensao.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      placeholder="Ex: Os valores da coluna devem estar entre 0 e 100"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tabelaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tabela (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a tabela" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      {tabelas.map((tabela) => (
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

            <FormField
              control={form.control}
              name="colunaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coluna (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a coluna" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      {colunasFiltered.map((coluna) => (
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

            <FormField
              control={form.control}
              name="responsavelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o responsável" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {papeis.map((papel) => (
                        <SelectItem key={papel.id} value={papel.id}>
                          {papel.nome}
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
              <Button type="submit" disabled={createRegra.isPending || updateRegra.isPending}>
                {createRegra.isPending || updateRegra.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
