"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Plus } from "lucide-react"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RegraNegocioResponse } from "@/types/api"
import { useCreateRegraNegocio, useUpdateRegraNegocio } from "@/hooks/api/use-regras-negocio"
import { useProcessos } from "@/hooks/api/use-processos"
import { ProcessoForm } from "@/components/processos/processo-form"

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  entidadeTipo: z.enum(['Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI', 'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna']),
  entidadeId: z.string().min(1, "Entidade é obrigatória"),
  politicaId: z.string().optional(),
  regulacaoId: z.string().optional(),
  status: z.enum(['ATIVA', 'INATIVA', 'EM_DESENVOLVIMENTO', 'DESCONTINUADA']).optional(),
  tipoRegra: z.enum(['VALIDACAO', 'TRANSFORMACAO', 'CALCULO', 'CONTROLE', 'NEGOCIO']).optional(),
})

type FormData = z.infer<typeof formSchema>

interface RegraFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  regra?: RegraNegocioResponse
}

export function RegraForm({ open, onOpenChange, regra }: RegraFormProps) {
  const [processoDialogOpen, setProcessoDialogOpen] = useState(false)
  const createMutation = useCreateRegraNegocio()
  const updateMutation = useUpdateRegraNegocio()
  const { data: processosData } = useProcessos()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      entidadeTipo: "Processo",
      entidadeId: "",
      politicaId: "",
      regulacaoId: "",
      status: "ATIVA",
      tipoRegra: "NEGOCIO",
    },
  })

  useEffect(() => {
    if (regra) {
      form.reset({
        nome: regra.nome,
        descricao: regra.descricao,
        entidadeTipo: regra.entidadeTipo,
        entidadeId: regra.entidadeId,
        politicaId: regra.politicaId || "",
        regulacaoId: regra.regulacaoId || "",
        status: regra.status || "ATIVA",
        tipoRegra: regra.tipoRegra || "NEGOCIO",
      })
    } else {
      form.reset({
        nome: "",
        descricao: "",
        entidadeTipo: "Processo",
        entidadeId: "",
        politicaId: "",
        regulacaoId: "",
        status: "ATIVA",
        tipoRegra: "NEGOCIO",
      })
    }
  }, [regra, form])

  const onSubmit = async (data: FormData) => {
    try {
      if (regra) {
        await updateMutation.mutateAsync({ id: regra.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro ao salvar regra de negócio:", error)
    }
  }

  const processos = processosData?.data || []
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {regra ? "Editar Regra de Negócio" : "Nova Regra de Negócio"}
            </DialogTitle>
            <DialogDescription>
              {regra
                ? "Atualize as informações da regra de negócio."
                : "Preencha os campos para cadastrar uma nova regra de negócio."}
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
                      <Input placeholder="Digite o nome da regra" {...field} />
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
                        placeholder="Digite a descrição da regra"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
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
                          <SelectItem value="Processo">Processo</SelectItem>
                          <SelectItem value="Politica">Política</SelectItem>
                          <SelectItem value="Papel">Papel</SelectItem>
                          <SelectItem value="Atribuicao">Atribuição</SelectItem>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entidadeId"
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
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ATIVA">Ativa</SelectItem>
                          <SelectItem value="INATIVA">Inativa</SelectItem>
                          <SelectItem value="EM_DESENVOLVIMENTO">Em Desenvolvimento</SelectItem>
                          <SelectItem value="DESCONTINUADA">Descontinuada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipoRegra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Regra</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="VALIDACAO">Validação</SelectItem>
                          <SelectItem value="TRANSFORMACAO">Transformação</SelectItem>
                          <SelectItem value="CALCULO">Cálculo</SelectItem>
                          <SelectItem value="CONTROLE">Controle</SelectItem>
                          <SelectItem value="NEGOCIO">Negócio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {regra ? "Atualizar" : "Cadastrar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ProcessoForm
        open={processoDialogOpen}
        onOpenChange={setProcessoDialogOpen}
      />
    </>
  )
}
