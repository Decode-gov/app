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
import { useCreateComunidade, useUpdateComunidade } from "@/hooks/api/use-comunidades"
import { ComunidadeResponse } from "@/types/api"

// Schema alinhado com a especificação do prompt e tipos da API
const comunidadeSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255, "Nome deve ter no máximo 255 caracteres"),
  descricao: z.string().min(1, "Descrição é obrigatória").max(2000, "Descrição deve ter no máximo 2000 caracteres"),
  categoria: z.string().max(100, "Categoria deve ter no máximo 100 caracteres").optional(),
})

type ComunidadeFormValues = z.infer<typeof comunidadeSchema>

interface DominioFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comunidade?: ComunidadeResponse
}

// Categorias sugeridas
const categoriasSugeridas = [
  "Dados Mestres",
  "Dados Transacionais",
  "Dados Analíticos",
  "Dados Operacionais",
  "Dados Financeiros",
  "Dados de Clientes",
  "Dados de Produtos",
  "Dados de RH",
  "Dados de Vendas",
  "Dados de Marketing",
  "Outro"
]

export function DominioForm({ open, onOpenChange, comunidade }: DominioFormProps) {
  const createMutation = useCreateComunidade()
  const updateMutation = useUpdateComunidade()
  
  const form = useForm<ComunidadeFormValues>({
    resolver: zodResolver(comunidadeSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      categoria: "",
    },
  })

  // Resetar form quando a comunidade mudar ou dialog abrir
  useEffect(() => {
    if (open) {
      if (comunidade) {
        form.reset({
          nome: comunidade.nome,
          descricao: comunidade.descricao,
          categoria: comunidade.categoria || "",
        })
      } else {
        form.reset({
          nome: "",
          descricao: "",
          categoria: "",
        })
      }
    }
  }, [open, comunidade, form])

  const onSubmit = async (data: ComunidadeFormValues) => {
    try {
      if (comunidade) {
        await updateMutation.mutateAsync({
          id: comunidade.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }

      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar domínio/comunidade:', error)
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-border/60">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {comunidade ? "Editar Domínio/Comunidade" : "Novo Domínio/Comunidade"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {comunidade 
              ? "Atualize as informações do domínio/comunidade."
              : "Preencha os dados para criar um novo domínio/comunidade."
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
                      placeholder="Ex: Domínio de Clientes, Comunidade de Vendas"
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
                      placeholder="Descreva o propósito e escopo deste domínio/comunidade..."
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

            {/* Categoria (opcional) */}
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50 border-border/60">
                        <SelectValue placeholder="Selecione uma categoria (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriasSugeridas.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-muted-foreground">
                    Classifique o tipo de domínio/comunidade
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
                {isSubmitting ? "Salvando..." : comunidade ? "Salvar Alterações" : "Criar Domínio"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
