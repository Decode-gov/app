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
import { useCreateRegraNegocio, useUpdateRegraNegocio } from "@/hooks/api/use-regras-negocio"
import { usePoliticasInternas } from "@/hooks/api/use-politicas-internas"
import { usePapeis } from "@/hooks/api/use-papeis"
import { useAtribuicoes } from "@/hooks/api/use-atribuicoes"
import { useDefinicoes } from "@/hooks/api/use-definicoes"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { useSistemas } from "@/hooks/api/use-sistemas"
import { useColunas } from "@/hooks/api/use-colunas"
import { RegraNegocioResponse } from "@/types/api"

const regraNegocioFormSchema = z.object({
  nome: z.string().min(1, "Nome da regra é obrigatório").max(255),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  entidadeTipo: z.enum(['Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI', 'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna'], {
    message: "Tipo de entidade é obrigatório"
  }),
  entidadeId: z.string().min(1, "Entidade é obrigatória"),
  politicaId: z.string().optional().or(z.literal("")),
  regulacaoId: z.string().optional().or(z.literal("")),
  status: z.enum(['ATIVA', 'INATIVA', 'EM_DESENVOLVIMENTO', 'DESCONTINUADA']).optional().or(z.literal("")),
  tipoRegra: z.enum(['VALIDACAO', 'TRANSFORMACAO', 'CALCULO', 'CONTROLE', 'NEGOCIO']).optional().or(z.literal("")),
})

type RegraNegocioFormValues = z.infer<typeof regraNegocioFormSchema>

interface RegraNegocioFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  regra?: RegraNegocioResponse
}

export function RegraNegocioForm({ open, onOpenChange, regra }: RegraNegocioFormProps) {
  const createRegra = useCreateRegraNegocio()
  const updateRegra = useUpdateRegraNegocio()

  const { data: politicasData } = usePoliticasInternas({ page: 1, limit: 1000 })
  const { data: papeisData } = usePapeis({ page: 1, limit: 1000 })
  const { data: atribuicoesData } = useAtribuicoes({ page: 1, limit: 1000 })
  const { data: definicoesData } = useDefinicoes({ page: 1, limit: 1000 })
  const { data: comunidadesData } = useComunidades({ page: 1, limit: 1000 })
  const { data: sistemasData } = useSistemas({ page: 1, limit: 1000 })
  const { data: colunasData } = useColunas({ page: 1, limit: 1000 })

  const politicas = politicasData?.data || []
  const papeis = papeisData?.data || []
  const atribuicoes = atribuicoesData?.data || []
  const definicoes = definicoesData?.data || []
  const comunidades = comunidadesData?.data || []
  const sistemas = sistemasData?.data || []
  const colunas = colunasData?.data || []

  const form = useForm<RegraNegocioFormValues>({
    resolver: zodResolver(regraNegocioFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      entidadeTipo: undefined,
      entidadeId: "",
      politicaId: "",
      regulacaoId: "",
      status: "",
      tipoRegra: "",
    },
  })

  const entidadeTipo = form.watch("entidadeTipo")

  useEffect(() => {
    if (regra) {
      form.reset({
        processoId: regra.processoId || "",
        descricao: regra.descricao || "",
      })
    } else {
      form.reset({
        processoId: "",
        descricao: "",
        tipoRegra: "",
      })
    }
  }, [regra, form])

  // Limpar entidadeId quando mudar o tipo
  useEffect(() => {
    if (!regra || form.formState.isDirty) {
      form.setValue("entidadeId", "")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entidadeTipo])

  const getEntidadeOptions = () => {
    switch (entidadeTipo) {
      case 'Politica':
        return politicas.map(p => ({ id: p.id, label: p.nome }))
      case 'Papel':
        return papeis.map(p => ({ id: p.id, label: p.nome }))
      case 'Atribuicao':
        return atribuicoes.map(a => ({ id: a.id, label: `${a.dominioId} - ${a.papelId}` }))
      case 'Termo':
        return definicoes.map(d => ({ id: d.id, label: d.termo }))
      case 'Dominio':
        return comunidades.map(c => ({ id: c.id, label: c.nome }))
      case 'Sistema':
        return sistemas.map(s => ({ id: s.id, label: s.sistema }))
      case 'Coluna':
        return colunas.map(c => ({ id: c.id, label: `${c.tabela}.${c.coluna}` }))
      default:
        return []
    }
  }

  const onSubmit = async (data: RegraNegocioFormValues) => {
    try {
      const payload = {
        nome: data.nome,
        descricao: data.descricao,
        entidadeTipo: data.entidadeTipo,
        entidadeId: data.entidadeId,
        politicaId: data.politicaId || undefined,
        regulacaoId: data.regulacaoId || undefined,
        status: data.status || undefined,
        tipoRegra: data.tipoRegra || undefined,
      }

      if (regra) {
        await updateRegra.mutateAsync({ id: regra.id, data: payload })
      } else {
        await createRegra.mutateAsync(payload)
      }
      
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro ao salvar regra de negócio:", error)
    }
  }

  const entidadeOptions = getEntidadeOptions()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{regra ? "Editar" : "Nova"} Regra de Negócio</DialogTitle>
          <DialogDescription>
            {regra ? "Edite as informações da regra de negócio" : "Preencha os dados para cadastrar uma nova regra de negócio"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Regra *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Validação de CPF" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nome identificador da regra de negócio
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
                      placeholder="Descreva a regra de negócio..." 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Descrição detalhada da regra
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entidadeTipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Entidade *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Politica">Política</SelectItem>
                        <SelectItem value="Papel">Papel</SelectItem>
                        <SelectItem value="Atribuicao">Atribuição</SelectItem>
                        <SelectItem value="Processo">Processo</SelectItem>
                        <SelectItem value="Termo">Termo</SelectItem>
                        <SelectItem value="KPI">KPI</SelectItem>
                        <SelectItem value="RegraNegocio">Regra de Negócio</SelectItem>
                        <SelectItem value="RegraQualidade">Regra de Qualidade</SelectItem>
                        <SelectItem value="Dominio">Domínio</SelectItem>
                        <SelectItem value="Sistema">Sistema</SelectItem>
                        <SelectItem value="Tabela">Tabela</SelectItem>
                        <SelectItem value="Coluna">Coluna</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Tipo da entidade alvo da regra
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entidadeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entidade *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!entidadeTipo || entidadeOptions.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !entidadeTipo 
                              ? "Selecione o tipo primeiro" 
                              : entidadeOptions.length === 0
                              ? "Nenhuma opção disponível"
                              : "Selecione a entidade"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {entidadeOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Entidade específica da regra
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="politicaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Política</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nenhuma política</SelectItem>
                        {politicas.map((politica) => (
                          <SelectItem key={politica.id} value={politica.id}>
                            {politica.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Política relacionada (opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nenhum status</SelectItem>
                        <SelectItem value="ATIVA">Ativa</SelectItem>
                        <SelectItem value="INATIVA">Inativa</SelectItem>
                        <SelectItem value="EM_DESENVOLVIMENTO">Em Desenvolvimento</SelectItem>
                        <SelectItem value="DESCONTINUADA">Descontinuada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Status atual da regra
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tipoRegra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Regra</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhum tipo</SelectItem>
                      <SelectItem value="VALIDACAO">Validação</SelectItem>
                      <SelectItem value="TRANSFORMACAO">Transformação</SelectItem>
                      <SelectItem value="CALCULO">Cálculo</SelectItem>
                      <SelectItem value="CONTROLE">Controle</SelectItem>
                      <SelectItem value="NEGOCIO">Negócio</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Classificação do tipo de regra
                  </FormDescription>
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
