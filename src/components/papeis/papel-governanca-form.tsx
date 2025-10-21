"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useCreatePapel, useUpdatePapel } from "@/hooks/api/use-papeis"
import { usePoliticasInternas } from "@/hooks/api/use-politicas-internas"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { PapelResponse } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { PoliticaInternaForm } from "@/components/politicas/politica-interna-form"

// Schema alinhado com a especificação do prompt e tipos da API
const papelSchema = z.object({
  listaPapelId: z.string().min(1, "Lista de Papel é obrigatória"),
  comunidadeId: z.string().min(1, "Comunidade é obrigatória"),
  nome: z.string().min(1, "Nome é obrigatório").max(255, "Nome deve ter no máximo 255 caracteres"),
  descricao: z.string().max(2000, "Descrição deve ter no máximo 2000 caracteres").optional(),
  politicaId: z.string().min(1, "Política é obrigatória"),
  documentoAtribuicao: z.string().max(500).optional(),
  comiteAprovadorId: z.string().max(255).optional(),
  onboarding: z.boolean().default(false),
})

type PapelFormValues = z.infer<typeof papelSchema>

interface PapelGovernancaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  papel?: PapelResponse
}

export function PapelGovernancaForm({ open, onOpenChange, papel }: PapelGovernancaFormProps) {
  const [politicaDialogOpen, setPoliticaDialogOpen] = useState(false)
  const createMutation = useCreatePapel()
  const updateMutation = useUpdatePapel()
  const { data: politicasData } = usePoliticasInternas()
  const { data: comunidadesData } = useComunidades()
  
  const form = useForm<PapelFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(papelSchema) as any,
    defaultValues: {
      listaPapelId: "",
      comunidadeId: "",
      nome: "",
      descricao: "",
      politicaId: "",
      documentoAtribuicao: "",
      comiteAprovadorId: "",
      onboarding: false,
    },
  })

  // Resetar form quando o papel mudar ou dialog abrir
  useEffect(() => {
    if (open) {
      if (papel) {
        form.reset({
          listaPapelId: papel.listaPapelId,
          comunidadeId: papel.comunidadeId,
          nome: papel.nome,
          descricao: papel.descricao || "",
          politicaId: papel.politicaId,
          documentoAtribuicao: papel.documentoAtribuicao || "",
          comiteAprovadorId: papel.comiteAprovadorId || "",
          onboarding: papel.onboarding,
        })
      } else {
        form.reset({
          listaPapelId: "",
          comunidadeId: "",
          nome: "",
          descricao: "",
          politicaId: "",
          documentoAtribuicao: "",
          comiteAprovadorId: "",
          onboarding: false,
        })
      }
    }
  }, [open, papel, form])

  const onSubmit = async (data: PapelFormValues) => {
    try {
      if (papel) {
        await updateMutation.mutateAsync({
          id: papel.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }

      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar papel:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createMutation.isPending && !updateMutation.isPending) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  // Filtrar políticas ativas
  const politicasAtivas = politicasData?.data.filter(p => p.status === 'Vigente') || []

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-border/60">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {papel ? "Editar Papel de Governança" : "Novo Papel de Governança"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {papel 
                ? "Atualize as informações do papel de governança."
                : "Preencha os dados para criar um novo papel de governança."
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Lista de Papel ID (obrigatório) */}
              <FormField
                control={form.control}
                name="listaPapelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Lista de Papel ID *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 550e8400-e29b-41d4-a716-446655440000"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      UUID da lista de papéis associada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Comunidade (obrigatória) */}
              <FormField
                control={form.control}
                name="comunidadeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Comunidade *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-border/60">
                          <SelectValue placeholder="Selecione a comunidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {comunidadesData?.data.map((comunidade) => (
                          <SelectItem key={comunidade.id} value={comunidade.id}>
                            {comunidade.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nome (obrigatório) */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Nome *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Data Steward, Data Owner, DPO"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Máximo 255 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descrição (obrigatória) */}
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Descrição *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva as responsabilidades e atribuições deste papel..."
                        className="min-h-[100px] bg-background/50 border-border/60 focus:border-primary/60"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Máximo 2000 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Política (obrigatória) */}
              <FormField
                control={form.control}
                name="politicaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Política Associada *</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/60">
                              <SelectValue placeholder="Selecione a política" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {politicasAtivas.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhuma política ativa encontrada
                              </div>
                            ) : (
                              politicasAtivas.map((politica) => (
                                <SelectItem key={politica.id} value={politica.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{politica.nome}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {politica.escopo}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setPoliticaDialogOpen(true)}
                        className="bg-background/50 border-border/60 hover:bg-accent/50 flex-shrink-0"
                        title="Criar nova política"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs text-muted-foreground">
                      Selecione a política que define este papel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Documento de Atribuição (opcional) */}
              <FormField
                control={form.control}
                name="documentoAtribuicao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Documento de Atribuição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva ou referencie o documento que formaliza as atribuições..."
                        className="min-h-[80px] bg-background/50 border-border/60 focus:border-primary/60"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Máximo 500 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Comitê Aprovador ID (opcional) */}
              <FormField
                control={form.control}
                name="comiteAprovadorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Comitê Aprovador ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ID do comitê aprovador (opcional)"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Máximo 255 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Onboarding (boolean default false) */}
              <FormField
                control={form.control}
                name="onboarding"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/60 p-4 bg-background/50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-foreground">
                        Onboarding Requerido
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Este papel requer processo de onboarding formal?
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

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isSubmitting}
                  className="bg-background/50 border-border/60 hover:bg-accent/50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? "Salvando..." : papel ? "Salvar Alterações" : "Criar Papel"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog para criar política inline */}
      <PoliticaInternaForm 
        open={politicaDialogOpen}
        onOpenChange={setPoliticaDialogOpen}
      />
    </>
  )
}
