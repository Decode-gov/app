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
import { papelFormSchema, type PapelFormData, type Papel } from "@/types/papel"
import { type Politica } from "@/types/classificacao"
import { PoliticaCreateDialog } from "@/components/politicas/politica-create-dialog"

interface PapelFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  papel?: Papel | null
  onSubmit: (data: PapelFormData) => void
  isSubmitting?: boolean
}

// Mock data - substituir por dados reais da API
const mockPoliticas: Politica[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
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
    id: "550e8400-e29b-41d4-a716-446655440002",
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
    id: "550e8400-e29b-41d4-a716-446655440003",
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
    id: "550e8400-e29b-41d4-a716-446655440004",
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

export function PapelForm({
  open,
  onOpenChange,
  papel,
  onSubmit,
  isSubmitting = false,
}: PapelFormProps) {
  const [politicaDialogOpen, setPoliticaDialogOpen] = useState(false)
  const [politicasDisponiveis, setPoliticasDisponiveis] = useState<Politica[]>(mockPoliticas)

  const isEditing = !!papel

  const form = useForm<PapelFormData>({
    resolver: zodResolver(papelFormSchema),
    defaultValues: {
      nome: papel?.nome || "",
      descricao: papel?.descricao || "",
      politicaId: papel?.politicaId || "",
    },
  })

  const politicasAtivas = useMemo(() => {
    return politicasDisponiveis
  }, [politicasDisponiveis])

  // Preparar opções para os comboboxes
  const politicasOptions: ComboboxOption[] = useMemo(() => {
    return politicasAtivas.map(politica => ({
      value: politica.id,
      label: politica.nome
    }))
  }, [politicasAtivas])

  const handleSubmit = (data: PapelFormData) => {
    onSubmit(data)
    form.reset()
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
    }
    onOpenChange(newOpen)
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
              {isEditing ? "Editar Papel" : "Novo Papel"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isEditing
                ? "Faça as alterações necessárias no papel."
                : "Preencha os dados para criar um novo papel."}
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
                        placeholder="Nome do papel"
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
                    <FormLabel className="text-foreground">Descrição *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o papel e suas responsabilidades..."
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
                    : (isEditing ? "Salvar Alterações" : "Criar Papel")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <PoliticaCreateDialog
        open={politicaDialogOpen}
        onOpenChange={setPoliticaDialogOpen}
        onPoliticaCreated={handlePoliticaCreated}
      />
    </>
  )
}