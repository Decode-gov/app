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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCreatePoliticaInterna, useUpdatePoliticaInterna } from "@/hooks/api/use-politicas-internas"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { PoliticaInternaResponse } from "@/types/api"
import { DominioForm } from "@/components/dominios/dominio-form"

// Schema de formulário para UI (usa Date objects)
const politicaInternaFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
  descricao: z.string().min(1, "Descrição é obrigatória").max(2000),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  objetivo: z.string().min(1, "Objetivo é obrigatório"),
  escopo: z.string().min(1, "Escopo é obrigatório"),
  dominioDadosId: z.string().optional(),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  dataCriacao: z.coerce.date({message: "Data de criação é obrigatória"}),
  dataInicioVigencia: z.coerce.date({message: "Data de início é obrigatória"}),
  dataTermino: z.coerce.date().optional(),
  status: z.enum(['Em_elaboracao', 'Vigente', 'Revogada']),
  versao: z.string().min(1, "Versão é obrigatória"),
  anexosUrl: z.string().optional(),
  relacionamento: z.string().optional(),
  observacoes: z.string().optional(),
})

type PoliticaInternaFormValues = z.infer<typeof politicaInternaFormSchema>

interface PoliticaInternaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  politica?: PoliticaInternaResponse
}

export function PoliticaInternaForm({ open, onOpenChange, politica }: PoliticaInternaFormProps) {
  const [dominioDialogOpen, setDominioDialogOpen] = useState(false)
  
  const createMutation = useCreatePoliticaInterna()
  const updateMutation = useUpdatePoliticaInterna()
  const { data: comunidadesData } = useComunidades({ page: 1, limit: 1000 })
  
  const comunidades = comunidadesData?.data || []
  
  const form = useForm<PoliticaInternaFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(politicaInternaFormSchema) as any,
    defaultValues: {
      nome: "",
      descricao: "",
      categoria: "",
      objetivo: "",
      escopo: "",
      dominioDadosId: undefined,
      responsavel: "",
      dataCriacao: new Date(),
      dataInicioVigencia: new Date(),
      dataTermino: new Date(),
      status: "Em_elaboracao",
      versao: "",
      anexosUrl: "",
      relacionamento: "",
      observacoes: "",
    },
  })

  // Resetar form quando a política mudar ou dialog abrir
  useEffect(() => {
    if (open) {
      if (politica) {
        form.reset({
          nome: politica.nome,
          descricao: politica.descricao,
          categoria: politica.categoria,
          objetivo: politica.objetivo,
          escopo: politica.escopo,
          dominioDadosId: politica.dominioDadosId || undefined,
          responsavel: politica.responsavel,
          dataCriacao: new Date(politica.dataCriacao),
          dataInicioVigencia: new Date(politica.dataInicioVigencia),
          dataTermino: politica.dataTermino || new Date(),
          status: politica.status,
          versao: politica.versao,
          anexosUrl: politica.anexosUrl || "",
          relacionamento: politica.relacionamento || "",
          observacoes: politica.observacoes || "",
        })
      } else {
        form.reset({
          nome: "",
          descricao: "",
          categoria: "",
          objetivo: "",
          escopo: "",
          dominioDadosId: undefined,
          responsavel: "",
          dataCriacao: new Date(),
          dataInicioVigencia: new Date(),
          dataTermino: new Date(),
          status: "Em_elaboracao",
          versao: "",
          anexosUrl: "",
          relacionamento: "",
          observacoes: "",
        })
      }
    }
  }, [open, politica, form])

  const onSubmit = async (data: PoliticaInternaFormValues) => {
    try {

      if (politica) {
        await updateMutation.mutateAsync({
          id: politica.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
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
    <>
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

            {/* Descrição (opcional) */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Descrição</FormLabel>
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
                    <Input
                      placeholder="Descreva o escopo da política"
                      {...field}
                      className="bg-background/50 border-border/60"
                    />
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
                        <SelectItem value="Em_elaboracao">Em elaboração</SelectItem>
                        <SelectItem value="Vigente">Vigente</SelectItem>
                        <SelectItem value="Revogada">Revogada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Data de Criação (obrigatória) */}
              <FormField
                control={form.control}
                name="dataCriacao"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-foreground">Data de Criação *</FormLabel>
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
                              <span>Selecione data</span>
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
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data de Início da Vigência (obrigatória) */}
              <FormField
                control={form.control}
                name="dataInicioVigencia"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-foreground">Data de Início *</FormLabel>
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs text-muted-foreground">
                      Data de término da vigência (opcional, formato: AAAA-MM-DD)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Categoria (obrigatória) */}
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Categoria *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Proteção de Dados, Segurança da Informação"
                      {...field}
                      className="bg-background/50 border-border/60"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Objetivo (obrigatório) */}
            <FormField
              control={form.control}
              name="objetivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Objetivo *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo principal desta política..."
                      className="min-h-[80px] bg-background/50 border-border/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Responsável (obrigatório) */}
              <FormField
                control={form.control}
                name="responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Responsável *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do responsável"
                        {...field}
                        className="bg-background/50 border-border/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Versão (obrigatória) */}
              <FormField
                control={form.control}
                name="versao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Versão *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 1.0, 2.1"
                        {...field}
                        className="bg-background/50 border-border/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Domínio de Dados (opcional) */}
            <FormField
              control={form.control}
              name="dominioDadosId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Domínio de Dados</FormLabel>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select 
                        onValueChange={(value) => field.onChange(value || undefined)} 
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border/60">
                            <SelectValue placeholder="Selecione o domínio de dados" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {comunidades.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground text-center">
                              Nenhum domínio encontrado
                            </div>
                          ) : (
                            comunidades.map((comunidade) => (
                              <SelectItem key={comunidade.id} value={comunidade.id}>
                                {comunidade.nome}
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
                      onClick={() => setDominioDialogOpen(true)}
                      className="bg-background/50 border-border/60 hover:bg-accent/50 flex-shrink-0"
                      title="Criar novo domínio"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription className="text-xs text-muted-foreground">
                    Selecione o domínio de dados associado (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Anexos URL (opcional) */}
            <FormField
              control={form.control}
              name="anexosUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">URL dos Anexos</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
                      type="url"
                      {...field}
                      className="bg-background/50 border-border/60"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Relacionamento (opcional) */}
            <FormField
              control={form.control}
              name="relacionamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Relacionamento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Relacionamento com outras políticas ou normas"
                      {...field}
                      className="bg-background/50 border-border/60"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observações (opcional) */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações adicionais..."
                      className="min-h-[80px] bg-background/50 border-border/60"
                      {...field}
                    />
                  </FormControl>
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
                {isSubmitting ? "Salvando..." : politica ? "Salvar Alterações" : "Criar Política"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

    {/* Dialog para criar domínio inline */}
    <DominioForm 
      open={dominioDialogOpen}
      onOpenChange={setDominioDialogOpen}
    />
  </>
  )
}
