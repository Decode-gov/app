"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { useRegrasNegocio } from "@/hooks/api"
import { RegraQualidadeResponse } from "@/types/api"
import { CreateRegraQualidadeSchema, type CreateRegraQualidadeFormData } from "@/schemas"

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
  const { data: regrasNegocioData } = useRegrasNegocio({ page: 1, limit: 1000 })

  const dimensoes = dimensoesData?.data || []
  const tabelas = tabelasData?.data || []
  const colunas = colunasData?.data || []
  const papeis = papeisData?.data || []
  const regrasNegocio = regrasNegocioData?.data || []

  const form = useForm<CreateRegraQualidadeFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateRegraQualidadeSchema) as any,
    defaultValues: {
      descricao: "",
      regraNegocioId: null,
      dimensaoId: "",
      tabelaId: null,
      colunaId: null,
      responsavelId: "",
    },
  })

  useEffect(() => {
    if (regra) {
      form.reset({
        descricao: regra.descricao || "",
        regraNegocioId: regra.regraNegocioId || null,
        dimensaoId: regra.dimensaoId || "",
        tabelaId: regra.tabelaId || null,
        colunaId: regra.colunaId || null,
        responsavelId: regra.responsavelId || "",
      })
    } else {
      form.reset({
        descricao: "",
        regraNegocioId: null,
        dimensaoId: "",
        tabelaId: null,
        colunaId: null,
        responsavelId: "",
      })
    }
  }, [regra, form])

  const onSubmit = async (data: CreateRegraQualidadeFormData) => {
    try {
      if (isEditing) {
        await updateRegra.mutateAsync({ id: regra.id, data })
      } else {
        await createRegra.mutateAsync(data)
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
              name="regraNegocioId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regra de Negócio</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a regra de negócio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      {regrasNegocio.map((regra) => (
                        <SelectItem key={regra.id} value={regra.id}>
                          <div className="flex flex-col">
                            <span className="line-clamp-1">{regra.descricao}</span>
                          </div>
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
              name="dimensaoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensão de Qualidade *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
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
              name="tabelaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tabela</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a tabela" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                  <FormLabel>Coluna</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a coluna" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colunas.map((coluna) => (
                        <SelectItem key={coluna.id} value={coluna.id}>
                          {coluna.nome}
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
                  <FormLabel>Responsável *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o responsável" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
