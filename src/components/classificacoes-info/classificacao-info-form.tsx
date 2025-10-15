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
import { useCreateClassificacao, useUpdateClassificacao } from "@/hooks/api/use-classificacoes-informacao"
import { usePoliticasInternas } from "@/hooks/api/use-politicas-internas"
import { useDefinicoes } from "@/hooks/api/use-definicoes"
import { ClassificacaoResponse } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { PoliticaInternaForm } from "@/components/politicas/politica-interna-form"
import { TermoForm } from "@/components/termos/termo-form"

// Schema alinhado com a especificação do prompt e tipos da API
const classificacaoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255, "Nome deve ter no máximo 255 caracteres"),
  descricao: z.string().max(1000, "Descrição deve ter no máximo 1000 caracteres").optional(),
  politicaId: z.string().min(1, "Política é obrigatória"),
  termoId: z.string().optional(),
})

type ClassificacaoFormValues = z.infer<typeof classificacaoSchema>

interface ClassificacaoInfoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classificacao?: ClassificacaoResponse
}

export function ClassificacaoInfoForm({ open, onOpenChange, classificacao }: ClassificacaoInfoFormProps) {
  const [politicaDialogOpen, setPoliticaDialogOpen] = useState(false)
  const [termoDialogOpen, setTermoDialogOpen] = useState(false)
  const createMutation = useCreateClassificacao()
  const updateMutation = useUpdateClassificacao()
  const { data: politicasData } = usePoliticasInternas()
  const { data: termosData } = useDefinicoes()
  
  const form = useForm<ClassificacaoFormValues>({
    resolver: zodResolver(classificacaoSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      politicaId: "",
      termoId: "",
    },
  })

  // Resetar form quando a classificacao mudar ou dialog abrir
  useEffect(() => {
    if (open) {
      if (classificacao) {
        form.reset({
          nome: classificacao.nome,
          descricao: classificacao.descricao || "",
          politicaId: classificacao.politicaId,
          termoId: classificacao.termoId || "",
        })
      } else {
        form.reset({
          nome: "",
          descricao: "",
          politicaId: "",
          termoId: "",
        })
      }
    }
  }, [open, classificacao, form])

  const onSubmit = async (data: ClassificacaoFormValues) => {
    try {
      if (classificacao) {
        await updateMutation.mutateAsync({
          id: classificacao.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }

      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar classificação:', error)
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
  const politicasAtivas = politicasData?.data.filter(p => p.status === 'ATIVA') || []
  const termos = termosData?.data || []

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-border/60">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {classificacao ? "Editar Classificação de Informação" : "Nova Classificação de Informação"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {classificacao 
                ? "Atualize as informações da classificação de informação."
                : "Preencha os dados para criar uma nova classificação de informação."
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Nome (obrigatório) */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Nome *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Dados Pessoais Sensíveis"
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

              {/* Descrição (opcional) */}
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva a classificação de informação..."
                        className="min-h-[100px] bg-background/50 border-border/60 focus:border-primary/60"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Máximo 1000 caracteres
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
                    <FormLabel className="text-foreground">Política Interna *</FormLabel>
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
                      Política que regula esta classificação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Termo de Negócio (opcional) */}
              <FormField
                control={form.control}
                name="termoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Termo de Negócio</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/60">
                              <SelectValue placeholder="Selecione um termo (opcional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {termos.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhum termo encontrado
                              </div>
                            ) : (
                              termos.map((termo) => (
                                <SelectItem key={termo.id} value={termo.id}>
                                  <div className="flex flex-col">
                                    <span>{termo.termo}</span>
                                    {termo.definicao && (
                                      <span className="text-xs text-muted-foreground line-clamp-1">
                                        {termo.definicao}
                                      </span>
                                    )}
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
                        onClick={() => setTermoDialogOpen(true)}
                        className="bg-background/50 border-border/60 hover:bg-accent/50 flex-shrink-0"
                        title="Criar novo termo"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs text-muted-foreground">
                      Termo de negócio associado (opcional)
                    </FormDescription>
                    <FormMessage />
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
                  {isSubmitting ? "Salvando..." : classificacao ? "Salvar Alterações" : "Criar Classificação"}
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

      {/* Dialog para criar termo inline */}
      <TermoForm 
        open={termoDialogOpen}
        onOpenChange={setTermoDialogOpen}
      />
    </>
  )
}
