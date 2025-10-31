"use client"

import { useEffect, useState } from "react"
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
import { Plus } from "lucide-react"
import { useCreateAtribuicao, useUpdateAtribuicao } from "@/hooks/api/use-atribuicoes"
import { usePapeis } from "@/hooks/api/use-papeis"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { useComitesAprovadores } from "@/hooks/api/use-comites-aprovadores"
import { AtribuicaoResponse } from "@/types/api"
import { AtribuicaoSchema, CreateAtribuicaoFormData } from "@/schemas"
import { PapelGovernancaForm } from "@/components/papeis/papel-governanca-form"
import { ComunidadeForm } from "@/components/dominios/comunidade-form"
import { ComiteAprovadorForm } from "@/components/comites/comite-aprovador-form"

type AtribuicaoFormValues = CreateAtribuicaoFormData

interface AtribuicaoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  atribuicao?: AtribuicaoResponse
}

export function AtribuicaoForm({ open, onOpenChange, atribuicao }: AtribuicaoFormProps) {
  const isEditing = !!atribuicao
  const [papelDialogOpen, setPapelDialogOpen] = useState(false)
  const [dominioDialogOpen, setDominioDialogOpen] = useState(false)
  const [comiteDialogOpen, setComiteDialogOpen] = useState(false)
  
  const createAtribuicao = useCreateAtribuicao()
  const updateAtribuicao = useUpdateAtribuicao()

  const { data: papeisData } = usePapeis({  })
  const { data: comunidadesData } = useComunidades({  })
  const { data: comitesData } = useComitesAprovadores({ })

  const papeis = papeisData?.data ?? []
  const dominios = comunidadesData?.data ?? []
  const comites = comitesData?.data ?? []

  const form = useForm<CreateAtribuicaoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(AtribuicaoSchema) as any,
    defaultValues: {
      papelId: "",
      dominioId: "",
      documentoAtribuicao: "",
      comiteAprovadorId: "",
      onboarding: false,
      responsavel: "",
    },
  })

  useEffect(() => {
    if (atribuicao && open) {
      form.reset({
        papelId: atribuicao.papelId,
        dominioId: atribuicao.dominioId,
        documentoAtribuicao: atribuicao.documentoAtribuicao,
        comiteAprovadorId: atribuicao.comiteAprovadorId,
        onboarding: atribuicao.onboarding,
        responsavel: atribuicao.responsavel,
      })
    } else if (!open) {
      form.reset({
        papelId: "",
        dominioId: "",
        documentoAtribuicao: "",
        comiteAprovadorId: "",
        onboarding: false,
        responsavel: "",
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
            <div className="grid grid-cols-1 gap-4">
              {/* Papel */}
              <FormField
                control={form.control}
                name="papelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Papel *</FormLabel>
                    <div className="flex gap-2">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
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
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setPapelDialogOpen(true)}
                        title="Criar novo papel"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
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
                    <div className="flex gap-2">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
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
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setDominioDialogOpen(true)}
                        title="Criar novo domínio"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Documento de Atribuição */}
            <FormField
              control={form.control}
              name="documentoAtribuicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento de Atribuição *</FormLabel>
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
              {/* Comitê Aprovador */}
              <FormField
                control={form.control}
                name="comiteAprovadorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comitê Aprovador *</FormLabel>
                    <div className="flex gap-2">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um comitê" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {comites.map((comite) => (
                            <SelectItem key={comite.id} value={comite.id}>
                              {comite.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setComiteDialogOpen(true)}
                        title="Criar novo comitê aprovador"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Responsável */}
              <FormField
                control={form.control}
                name="responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável *</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

      {/* Dialogs para criar novos registros */}
      <PapelGovernancaForm
        open={papelDialogOpen}
        onOpenChange={setPapelDialogOpen}
      />
      <ComunidadeForm
        open={dominioDialogOpen}
        onOpenChange={setDominioDialogOpen}
      />
      <ComiteAprovadorForm
        open={comiteDialogOpen}
        onOpenChange={setComiteDialogOpen}
      />
    </Dialog>
  )
}
