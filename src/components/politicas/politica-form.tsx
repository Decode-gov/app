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
import { type Politica, type PoliticaFormData, politicaFormSchema } from "@/types/politica"

interface PoliticaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  politica?: Politica | null
  onSubmit: (data: PoliticaFormData) => Promise<void>
  isSubmitting: boolean
}

const statusOptions = [
  { value: "Em_elaboracao", label: "Em Elaboração" },
  { value: "Vigente", label: "Vigente" },
  { value: "Revogada", label: "Revogada" },
]

const categoriaOptions = [
  { value: "Privacidade", label: "Privacidade" },
  { value: "Classificação", label: "Classificação" },
  { value: "Retenção", label: "Retenção" },
  { value: "Backup", label: "Backup" },
  { value: "Segurança", label: "Segurança" },
]

export function PoliticaForm({
  open,
  onOpenChange,
  politica,
  onSubmit,
  isSubmitting,
}: PoliticaFormProps) {
  const isEditing = Boolean(politica)

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

  // Resetar form quando a política mudar
  useEffect(() => {
    if (politica) {
      form.reset({
        nome: politica.nome,
        descricao: politica.descricao || "",
        categoria: politica.categoria,
        objetivo: politica.objetivo,
        escopo: politica.escopo,
        dominioDadosId: politica.dominioDadosId || "",
        responsavel: politica.responsavel,
        dataCriacao: politica.dataCriacao,
        dataInicioVigencia: politica.dataInicioVigencia,
        dataTermino: politica.dataTermino || undefined,
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
      })
    }
  }, [politica, form])

  const handleSubmit = async (data: PoliticaFormData) => {
    await onSubmit(data)
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
          <DialogTitle className="text-foreground">
            {isEditing ? "Editar Política" : "Nova Política"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing 
              ? "Atualize as informações da política de governança."
              : "Preencha os dados para criar uma nova política de governança."
            }
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-border/60">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriaOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        placeholder="Escopo da política"
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
                        placeholder="Nome do responsável"
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
                        placeholder="Ex: 1.0"
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
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                        placeholder="ID do domínio de dados"
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
                    <FormLabel className="text-foreground">Data Criação *</FormLabel>
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
                    <FormLabel className="text-foreground">Início Vigência *</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataTermino"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-foreground">Data Término</FormLabel>
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
                    <FormLabel className="text-foreground">URL de Anexos</FormLabel>
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
                    <FormLabel className="text-foreground">Relacionamento</FormLabel>
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
                {isSubmitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Política"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}