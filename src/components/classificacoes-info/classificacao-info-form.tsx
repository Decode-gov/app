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
import { Plus } from "lucide-react"
import { useCreateClassificacao, useUpdateClassificacao } from "@/hooks/api/use-classificacoes-informacao"
import { useListasClassificacao } from "@/hooks/api/use-listas-classificacao"
import { useDefinicoes } from "@/hooks/api/use-definicoes"
import { ClassificacaoInformacaoResponse } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { TermoForm } from "@/components/termos/termo-form"
import { CreateClassificacaoInformacaoSchema } from "@/schemas"
import type { CreateClassificacaoInformacaoFormData } from "@/schemas"

type ClassificacaoFormValues = CreateClassificacaoInformacaoFormData

interface ClassificacaoInfoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classificacao?: ClassificacaoInformacaoResponse
}

export function ClassificacaoInfoForm({ open, onOpenChange, classificacao }: ClassificacaoInfoFormProps) {
  const [termoDialogOpen, setTermoDialogOpen] = useState(false)
  const createMutation = useCreateClassificacao()
  const updateMutation = useUpdateClassificacao()
  const { data: listasData } = useListasClassificacao()
  const { data: termosData } = useDefinicoes()
  
  const form = useForm<ClassificacaoFormValues>({
    resolver: zodResolver(CreateClassificacaoInformacaoSchema),
    defaultValues: {
      classificacaoId: "",
      termoId: "",
    },
  })

  // Resetar form quando a classificacao mudar ou dialog abrir
  useEffect(() => {
    if (open) {
      if (classificacao) {
        form.reset({
          classificacaoId: classificacao.classificacaoId,
          termoId: classificacao.termoId,
        })
      } else {
        form.reset({
          classificacaoId: "",
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

  // Obter dados
  const listas = listasData?.data || []
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
              {/* Lista de Classificação (obrigatória) */}
              <FormField
                control={form.control}
                name="classificacaoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Lista de Classificação *</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/60 w-full">
                              <SelectValue placeholder="Selecione a lista de classificação" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listas.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhuma lista de classificação encontrada
                              </div>
                            ) : (
                              listas.map((lista) => (
                                <SelectItem key={lista.id} value={lista.id}>
                                  <div className="flex flex-col">
                                    <span>{lista.classificacao}</span>
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
                        onClick={() => window.open('/listas-classificacao', '_blank')}
                        className="bg-background/50 border-border/60 hover:bg-accent/50 flex-shrink-0"
                        title="Criar nova lista de classificação"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs text-muted-foreground">
                      Lista de referência da classificação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Termo de Negócio (obrigatório) */}
              <FormField
                control={form.control}
                name="termoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Termo de Negócio *</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/60 w-full">
                              <SelectValue placeholder="Selecione o termo" />
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
                                    {termo.sigla && (
                                      <Badge variant="outline" className="text-xs w-fit">
                                        {termo.sigla}
                                      </Badge>
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
                      Termo relacionado a esta classificação
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

      {/* Dialog para criar termo inline */}
      <TermoForm 
        open={termoDialogOpen}
        onOpenChange={setTermoDialogOpen}
      />
    </>
  )
}
