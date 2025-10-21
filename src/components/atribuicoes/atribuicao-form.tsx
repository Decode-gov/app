"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Switch } from "@/components/ui/switch"
import { useCreateAtribuicao, useUpdateAtribuicao } from "@/hooks/api/use-atribuicoes"
import { usePapeis } from "@/hooks/api/use-papeis"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { AtribuicaoResponse, TipoEntidadeAtribuicao } from "@/types/api"
import { AtribuicaoSchema, CreateAtribuicaoFormData } from "@/schemas"

type AtribuicaoFormValues = CreateAtribuicaoFormData

interface AtribuicaoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  atribuicao?: AtribuicaoResponse
}

const tiposEntidade: TipoEntidadeAtribuicao[] = [
  'Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI',
  'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna'
];

export function AtribuicaoForm({ open, onOpenChange, atribuicao }: AtribuicaoFormProps) {
  const isEditing = !!atribuicao
  const createAtribuicao = useCreateAtribuicao()
  const updateAtribuicao = useUpdateAtribuicao()

  const { data: papeisData } = usePapeis({ page: 1, limit: 1000 })
  const { data: comunidadesData } = useComunidades({ page: 1, limit: 1000 })

  const papeis = papeisData?.data ?? []
  const dominios = comunidadesData?.data ?? []

  const form = useForm<CreateAtribuicaoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(AtribuicaoSchema) as any,
    defaultValues: {
      papelId: "",
      dominioId: "",
      tipoEntidade: "Atribuicao" as TipoEntidadeAtribuicao,
      documentoAtribuicao: "",
      comiteAprovadorId: "",
      onboarding: false,
      dataInicioVigencia: new Date().toISOString().split('T')[0],
      dataTermino: "",
      observacoes: "",
    },
  })

  useEffect(() => {
    if (atribuicao && open) {
      form.reset({
        papelId: atribuicao.papelId,
        dominioId: atribuicao.dominioId,
        tipoEntidade: atribuicao.tipoEntidade,
        documentoAtribuicao: atribuicao.documentoAtribuicao || "",
        comiteAprovadorId: atribuicao.comiteAprovadorId || "",
        onboarding: atribuicao.onboarding,
        dataInicioVigencia: atribuicao.dataInicioVigencia.split('T')[0],
        dataTermino: atribuicao.dataTermino ? atribuicao.dataTermino.split('T')[0] : "",
        observacoes: atribuicao.observacoes || "",
      })
    } else if (!open) {
      form.reset({
        papelId: "",
        dominioId: "",
        tipoEntidade: "Atribuicao" as TipoEntidadeAtribuicao,
        documentoAtribuicao: "",
        comiteAprovadorId: "",
        onboarding: false,
        dataInicioVigencia: new Date().toISOString().split('T')[0],
        dataTermino: "",
        observacoes: "",
      })
    }
  }, [atribuicao, open, form])

  const onSubmit = async (data: AtribuicaoFormValues) => {
    try {
      if (isEditing) {
        await updateAtribuicao.mutateAsync({ id: atribuicao.id, data })
      } else {
        await createAtribuicao.mutateAsync(data)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro ao salvar atribuição:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Atribuição" : "Nova Atribuição"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados da atribuição."
              : "Preencha os dados para criar uma nova atribuição."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Papel */}
              <FormField
                control={form.control}
                name="papelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Papel *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um papel" />
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

              {/* Domínio */}
              <FormField
                control={form.control}
                name="dominioId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domínio *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um domínio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dominios.map((dominio) => (
                          <SelectItem key={dominio.id} value={dominio.id}>
                            {dominio.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tipo de Entidade */}
            <FormField
              control={form.control}
              name="tipoEntidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Entidade *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de entidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposEntidade.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Documento de Atribuição */}
            <FormField
              control={form.control}
              name="documentoAtribuicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento de Atribuição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cole o documento ou URL do documento"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Comitê Aprovador ID */}
              <FormField
                control={form.control}
                name="comiteAprovadorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID do Comitê Aprovador</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o ID do comitê" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Onboarding */}
              <FormField
                control={form.control}
                name="onboarding"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Onboarding</FormLabel>
                      <FormDescription className="text-xs">
                        Requer processo de onboarding
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Data Início Vigência */}
              <FormField
                control={form.control}
                name="dataInicioVigencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Início Vigência *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data Término */}
              <FormField
                control={form.control}
                name="dataTermino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Término</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite observações adicionais"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createAtribuicao.isPending || updateAtribuicao.isPending}
              >
                {createAtribuicao.isPending || updateAtribuicao.isPending
                  ? "Salvando..."
                  : isEditing
                    ? "Atualizar"
                    : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
