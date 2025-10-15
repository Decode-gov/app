"use client"

import { useState, useMemo } from "react"
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
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { Plus } from "lucide-react"
import { classificacaoFormSchema, type ClassificacaoFormData, type Classificacao, type Politica } from "@/types/classificacao"
import { type Termo } from "@/types/termo"
import { PoliticaCreateDialog } from "../politicas/politica-create-dialog"
import { TermoCreateDialog } from "../termos/termo-create-dialog"

interface ClassificacaoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classificacao?: Classificacao | null
  onSubmit: (data: ClassificacaoFormData) => void
  isSubmitting?: boolean
}

// Mock data - substituir por dados reais da API
const mockPoliticas: Politica[] = [
  {
    id: "1",
    nome: "Política de Segurança da Informação",
    descricao: "Política para proteção de informações confidenciais",
    categoria: "Segurança",
    objetivo: "Proteger informações sensíveis da organização",
    escopo: "Toda a organização",
    dominioDadosId: null,
    responsavel: "CISO",
    dataCriacao: new Date("2024-01-01"),
    dataInicioVigencia: new Date("2024-01-15"),
    dataTermino: null,
    status: "Vigente",
    versao: "1.0",
    anexosUrl: null,
    relacionamento: null,
    observacoes: null
  },
  {
    id: "2",
    nome: "Política de Privacidade de Dados",
    descricao: "Política de conformidade com LGPD",
    categoria: "Privacidade",
    objetivo: "Garantir conformidade com legislação de proteção de dados",
    escopo: "Dados pessoais",
    dominioDadosId: null,
    responsavel: "DPO",
    dataCriacao: new Date("2024-01-02"),
    dataInicioVigencia: new Date("2024-01-16"),
    dataTermino: null,
    status: "Vigente",
    versao: "1.0",
    anexosUrl: null,
    relacionamento: null,
    observacoes: null
  },
  {
    id: "3",
    nome: "Política de Retenção de Documentos",
    descricao: "Política para gestão do ciclo de vida de documentos",
    categoria: "Governança",
    objetivo: "Definir prazos de retenção de documentos",
    escopo: "Todos os documentos organizacionais",
    dominioDadosId: null,
    responsavel: "Gestor de Documentos",
    dataCriacao: new Date("2024-01-03"),
    dataInicioVigencia: new Date("2024-01-17"),
    dataTermino: null,
    status: "Vigente",
    versao: "1.0",
    anexosUrl: null,
    relacionamento: null,
    observacoes: null
  },
  {
    id: "4",
    nome: "Política de Classificação de Informações",
    descricao: "Política para classificação de sensibilidade de informações",
    categoria: "Classificação",
    objetivo: "Padronizar classificação de informações",
    escopo: "Todas as informações organizacionais",
    dominioDadosId: null,
    responsavel: "Gestor de Informações",
    dataCriacao: new Date("2024-01-04"),
    dataInicioVigencia: new Date("2024-01-18"),
    dataTermino: null,
    status: "Vigente",
    versao: "1.0",
    anexosUrl: null,
    relacionamento: null,
    observacoes: null
  },
]

const mockTermos: Termo[] = [
  { id: "1", nome: "Dados Pessoais", descricao: "Informações relacionadas a pessoa natural identificada ou identificável", ativo: true },
  { id: "2", nome: "Dados Sensíveis", descricao: "Dados pessoais sobre origem racial, convicções religiosas, opiniões políticas", ativo: true },
  { id: "3", nome: "Informação Confidencial", descricao: "Informação que deve ser protegida contra acesso não autorizado", ativo: true },
  { id: "4", nome: "Documento Público", descricao: "Documento de acesso livre ao público em geral", ativo: true },
]

export function ClassificacaoForm({
  open,
  onOpenChange,
  classificacao,
  onSubmit,
  isSubmitting = false,
}: ClassificacaoFormProps) {
  const [termoDialogOpen, setTermoDialogOpen] = useState(false)
  const [politicaDialogOpen, setPoliticaDialogOpen] = useState(false)
  const [termosDisponiveis, setTermosDisponiveis] = useState<Termo[]>(mockTermos)
  const [politicasDisponiveis, setPoliticasDisponiveis] = useState<Politica[]>(mockPoliticas)

  const isEditing = !!classificacao

  const form = useForm<ClassificacaoFormData>({
    resolver: zodResolver(classificacaoFormSchema),
    defaultValues: {
      nome: classificacao?.nome || "",
      descricao: classificacao?.descricao || "",
      politicaId: classificacao?.politicaId || "",
      termoId: classificacao?.termoId || "",
    },
  })

  const politicasAtivas = useMemo(() => {
    return politicasDisponiveis
  }, [politicasDisponiveis])

  const termosAtivos = useMemo(() => {
    return termosDisponiveis.filter(termo => termo.ativo)
  }, [termosDisponiveis])

  // Preparar opções para os comboboxes
  const politicasOptions: ComboboxOption[] = useMemo(() => {
    return politicasAtivas.map(politica => ({
      value: politica.id,
      label: politica.nome
    }))
  }, [politicasAtivas])

  const termosOptions: ComboboxOption[] = useMemo(() => {
    return termosAtivos.map(termo => ({
      value: termo.id,
      label: termo.nome
    }))
  }, [termosAtivos])

  const handleSubmit = (data: ClassificacaoFormData) => {
    onSubmit(data)
    form.reset()
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  const handleTermoCreated = (novoTermo: Termo) => {
    setTermosDisponiveis(prev => [...prev, novoTermo])
    form.setValue("termoId", novoTermo.id)
  }

  const handlePoliticaCreated = (novaPolitica: Politica) => {
    setPoliticasDisponiveis(prev => [...prev, novaPolitica])
    form.setValue("politicaId", novaPolitica.id)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-sm border-border/60">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {isEditing ? "Editar Classificação" : "Nova Classificação"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isEditing
                ? "Faça as alterações necessárias na classificação."
                : "Preencha os dados para criar uma nova classificação."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Nome *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome da classificação"
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
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o propósito e critérios desta classificação..."
                        className="min-h-[100px] bg-background/50 border-border/60 focus:border-primary/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid">
                <FormField
                  control={form.control}
                  name="politicaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Política *</FormLabel>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Combobox
                            options={politicasOptions}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Selecione uma política"
                            searchPlaceholder="Buscar política..."
                            emptyMessage="Nenhuma política encontrada."
                            className="bg-background/50 border-border/60"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            console.log('Abrindo dialog de política...')
                            setPoliticaDialogOpen(true)
                          }}
                          className="bg-background/50 border-border/60 hover:bg-accent/50 flex-shrink-0"
                          title="Criar nova política"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid">
                <FormField
                  control={form.control}
                  name="termoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Termo/Definição</FormLabel>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Combobox
                            options={termosOptions}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Selecione um termo"
                            searchPlaceholder="Buscar termo..."
                            emptyMessage="Nenhum termo encontrado."
                            className="bg-background/50 border-border/60"
                            allowEmpty={true}
                            emptyLabel="Nenhum termo selecionado"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            console.log('Abrindo dialog de termo...')
                            setTermoDialogOpen(true)
                          }}
                          className="bg-background/50 border-border/60 hover:bg-accent/50 flex-shrink-0"
                          title="Criar novo termo"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  className="bg-background/50 border-border/60 hover:bg-accent/50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting
                    ? (isEditing ? "Salvando..." : "Criando...")
                    : (isEditing ? "Salvar Alterações" : "Criar Classificação")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <TermoCreateDialog
        open={termoDialogOpen}
        onOpenChange={setTermoDialogOpen}
        onTermoCreated={handleTermoCreated}
      />

      <PoliticaCreateDialog
        open={politicaDialogOpen}
        onOpenChange={setPoliticaDialogOpen}
        onPoliticaCreated={handlePoliticaCreated}
      />
    </>
  )
}
