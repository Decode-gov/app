"use client"

import { useState } from "react"
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
import { type Politica } from "@/types/classificacao"

const politicaFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  objetivo: z.string().min(1, "Objetivo é obrigatório"),
  escopo: z.string().min(1, "Escopo é obrigatório"),
  dominioDadosId: z.string().optional(),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  dataCriacao: z.date({ message: "Data de criação é obrigatória" }),
  dataInicioVigencia: z.date({ message: "Data de início de vigência é obrigatória" }),
  dataTermino: z.date().optional(),
  status: z.enum(["Em_elaboracao", "Vigente", "Revogada"], { 
    message: "Status é obrigatório"
  }),
  versao: z.string().min(1, "Versão é obrigatória"),
  anexosUrl: z.string().optional(),
  relacionamento: z.string().optional(),
  observacoes: z.string().optional(),
})

type PoliticaFormData = z.infer<typeof politicaFormSchema>

interface PoliticaCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPoliticaCreated: (politica: Politica) => void
}

const statusOptions = [
  { value: "Em_elaboracao", label: "Em Elaboração" },
  { value: "Vigente", label: "Vigente" },
  { value: "Revogada", label: "Revogada" },
]

export function PoliticaCreateDialog({
  open,
  onOpenChange,
  onPoliticaCreated,
}: PoliticaCreateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PoliticaFormData>({
    resolver: zodResolver(politicaFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      categoria: "",
      objetivo: "",
      escopo: "",
      dominioDadosId: "",
      responsavel: "",
      dataCriacao: new Date(),
      dataInicioVigencia: new Date(),
      dataTermino: undefined,
      status: "Em_elaboracao",
      versao: "1.0",
      anexosUrl: "",
      relacionamento: "",
      observacoes: "",
    },
  })

  const handleSubmit = async (data: PoliticaFormData) => {
    setIsSubmitting(true)
    try {
      // Simular criação da política
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const novaPolitica: Politica = {
        id: `politica_${Date.now()}`,
        nome: data.nome,
        descricao: data.descricao || "",
        categoria: data.categoria,
        objetivo: data.objetivo,
        escopo: data.escopo,
        dominioDadosId: data.dominioDadosId || null,
        responsavel: data.responsavel,
        dataCriacao: data.dataCriacao,
        dataInicioVigencia: data.dataInicioVigencia,
        dataTermino: data.dataTermino || null,
        status: data.status,
        versao: data.versao,
        anexosUrl: data.anexosUrl || null,
        relacionamento: data.relacionamento || null,
        observacoes: data.observacoes || null
      }

      onPoliticaCreated(novaPolitica)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao criar política:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSubmitting) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-border/60">
        <DialogHeader>
          <DialogTitle className="text-foreground">Nova Política</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha os dados para criar uma nova política de governança.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Nome *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome da política"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Categoria *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Categoria da política"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o propósito desta política..."
                      className="min-h-[80px] bg-background/50 border-border/60 focus:border-primary/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="objetivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Objetivo *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Objetivo da política"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="escopo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Escopo *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Escopo de aplicação da política"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Responsável *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Responsável pela política"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="versao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Versão *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1.0"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dominioDadosId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Domínio de Dados</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ID do domínio (opcional)"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
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
                              "bg-background/50 border-border/60 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataInicioVigencia"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-foreground">Início de Vigência *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "bg-background/50 border-border/60 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
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
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                              "bg-background/50 border-border/60 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Data opcional</span>
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
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="anexosUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">URL dos Anexos</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/anexos"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relacionamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Relacionamentos</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Relacionamentos com outras políticas"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações adicionais..."
                      className="min-h-[60px] bg-background/50 border-border/60 focus:border-primary/60"
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
                {isSubmitting ? "Criando..." : "Criar Política"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}