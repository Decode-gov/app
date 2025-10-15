"use client"

import { useEffect } from "react"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCreatePoliticaInterna, useUpdatePoliticaInterna } from "@/hooks/api/use-politicas-internas"
import { PoliticaInternaResponse } from "@/types/api"

// Schema de formulário (usa Date objects, diferente da API que usa strings ISO)
// Baseado no PoliticaInternaSchema de @/schemas mas adaptado para forms
const politicaInternaFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255, "Nome deve ter no máximo 255 caracteres"),
  descricao: z.string().max(2000, "Descrição deve ter no máximo 2000 caracteres").optional(),
  escopo: z.enum(['SEGURANCA', 'QUALIDADE', 'GOVERNANCA', 'OUTRO']),
  status: z.enum(['ATIVA', 'REVOGADA', 'EM_REVISAO']),
  dataInicioVigencia: z.date({message: "Data de início é obrigatória"}),
  dataTermino: z.date().optional(),
})

type PoliticaInternaFormValues = z.infer<typeof politicaInternaFormSchema>

interface PoliticaInternaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  politica?: PoliticaInternaResponse
}

export function PoliticaInternaForm({ open, onOpenChange, politica }: PoliticaInternaFormProps) {
  const createMutation = useCreatePoliticaInterna()
  const updateMutation = useUpdatePoliticaInterna()
  
  const form = useForm<PoliticaInternaFormValues>({
    resolver: zodResolver(politicaInternaFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      escopo: "GOVERNANCA",
      status: "EM_REVISAO",
      dataInicioVigencia: new Date(),
      dataTermino: undefined,
    },
  })

  // Resetar form quando a política mudar ou dialog abrir
  useEffect(() => {
    if (open) {
      if (politica) {
        form.reset({
          nome: politica.nome,
          descricao: politica.descricao || "",
          escopo: politica.escopo,
          status: politica.status,
          dataInicioVigencia: new Date(politica.dataInicioVigencia),
          dataTermino: politica.dataTermino ? new Date(politica.dataTermino) : undefined,
        })
      } else {
        form.reset({
          nome: "",
          descricao: "",
          escopo: "GOVERNANCA",
          status: "EM_REVISAO",
          dataInicioVigencia: new Date(),
          dataTermino: undefined,
        })
      }
    }
  }, [open, politica, form])

  const onSubmit = async (data: PoliticaInternaFormValues) => {
    try {
      const payload = {
        ...data,
        dataInicioVigencia: data.dataInicioVigencia.toISOString(),
        dataTermino: data.dataTermino?.toISOString(),
      }

      if (politica) {
        await updateMutation.mutateAsync({
          id: politica.id,
          data: payload,
        })
      } else {
        await createMutation.mutateAsync(payload)
      }

      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar política:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createMutation.isPending && !updateMutation.isPending) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-border/60">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {politica ? "Editar Política Interna" : "Nova Política Interna"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {politica 
              ? "Atualize as informações da política de governança."
              : "Preencha os dados para criar uma nova política de governança."
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
                      placeholder="Nome da política interna"
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
                      placeholder="Descreva o propósito e conteúdo desta política..."
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

            <div className="grid grid-cols-2 gap-4">
              {/* Escopo (obrigatório) */}
              <FormField
                control={form.control}
                name="escopo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Escopo *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-border/60">
                          <SelectValue placeholder="Selecione o escopo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SEGURANCA">Segurança</SelectItem>
                        <SelectItem value="QUALIDADE">Qualidade</SelectItem>
                        <SelectItem value="GOVERNANCA">Governança</SelectItem>
                        <SelectItem value="OUTRO">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status (obrigatório) */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-border/60">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EM_REVISAO">Em Revisão</SelectItem>
                        <SelectItem value="ATIVA">Ativa</SelectItem>
                        <SelectItem value="REVOGADA">Revogada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Data de Início da Vigência (obrigatória) */}
              <FormField
                control={form.control}
                name="dataInicioVigencia"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-foreground">Data de Início da Vigência *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-background/50 border-border/60",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={ptBR}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs text-muted-foreground">
                      Data de início da vigência da política
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data de Término (opcional) */}
              <FormField
                control={form.control}
                name="dataTermino"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-foreground">Data de Término</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-background/50 border-border/60",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data (opcional)</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={ptBR}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs text-muted-foreground">
                      Data de término da vigência (se aplicável)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {isSubmitting ? "Salvando..." : politica ? "Salvar Alterações" : "Criar Política"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
