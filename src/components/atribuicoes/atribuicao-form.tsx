"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateAtribuicao, useUpdateAtribuicao } from "@/hooks/api/use-atribuicoes"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { usePapeis } from "@/hooks/api/use-papeis"
import { AtribuicaoResponse } from "@/types/api"
import { Badge } from "@/components/ui/badge"

const atribuicaoSchema = z.object({
  dominioId: z.string().min(1, "Domínio é obrigatório"),
  papelId: z.string().min(1, "Papel é obrigatório"),
  documentoAtribuicao: z.string().min(1, "Documento de atribuição é obrigatório"),
  comiteAprovador: z.string().min(1, "Comitê aprovador é obrigatório"),
  onboarding: z.boolean(),
})

type AtribuicaoFormValues = z.infer<typeof atribuicaoSchema>

interface AtribuicaoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  atribuicao?: AtribuicaoResponse
}

export function AtribuicaoForm({ open, onOpenChange, atribuicao }: AtribuicaoFormProps) {
  const isEditing = !!atribuicao
  const createAtribuicao = useCreateAtribuicao()
  const updateAtribuicao = useUpdateAtribuicao()
  const { data: dominiosData } = useComunidades()
  const { data: papeisData } = usePapeis()

  const form = useForm<AtribuicaoFormValues>({
    resolver: zodResolver(atribuicaoSchema),
    defaultValues: {
      dominioId: "",
      papelId: "",
      documentoAtribuicao: "",
      comiteAprovador: "",
      onboarding: false,
    },
  })

  useEffect(() => {
    if (atribuicao && open) {
      form.reset({
        dominioId: atribuicao.dominioId,
        papelId: atribuicao.papelId,
        documentoAtribuicao: atribuicao.documentoAtribuicao,
        comiteAprovador: atribuicao.comiteAprovador,
        onboarding: atribuicao.onboarding,
      })
    } else if (!open) {
      form.reset()
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

  const getDominioNome = (dominioId: string) => {
    const dominio = dominiosData?.data?.find(d => d.id === dominioId)
    return dominio?.nome || dominioId
  }

  const getPapelNome = (papelId: string) => {
    const papel = papeisData?.data?.find(p => p.id === papelId)
    return papel?.nome || papelId
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Atribuição" : "Nova Atribuição"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados da atribuição entre papel e domínio."
              : "Preencha os dados para criar uma nova atribuição entre papel e domínio."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="dominioId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domínio *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o domínio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dominiosData?.data?.map((dominio) => (
                        <SelectItem key={dominio.id} value={dominio.id}>
                          <div className="flex items-center gap-2">
                            <span>{dominio.nome}</span>
                            {dominio.categoria && (
                              <Badge variant="outline" className="text-xs">
                                {dominio.categoria}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecione o domínio/comunidade para esta atribuição
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="papelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Papel *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o papel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {papeisData?.data?.map((papel) => (
                        <SelectItem key={papel.id} value={papel.id}>
                          {papel.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecione o papel de governança para esta atribuição
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentoAtribuicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento de Atribuição *</FormLabel>
                  <FormControl>
                    <Input placeholder="URL ou caminho do documento" {...field} />
                  </FormControl>
                  <FormDescription>
                    Informe a URL ou caminho do documento que formaliza esta atribuição
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comiteAprovador"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comitê Aprovador *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do comitê aprovador" {...field} />
                  </FormControl>
                  <FormDescription>
                    Informe o nome do comitê ou instância que aprovou esta atribuição
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="onboarding"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Onboarding Ativo
                    </FormLabel>
                    <FormDescription>
                      Indica se o processo de onboarding está habilitado para esta atribuição
                    </FormDescription>
                  </div>
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
