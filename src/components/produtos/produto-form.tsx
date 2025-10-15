"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateProdutoDados, useUpdateProdutoDados } from "@/hooks/api/use-produtos-dados"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { usePoliticasInternas } from "@/hooks/api/use-politicas-internas"
import { ProdutoDadosResponse } from "@/types/api"

const formSchema = z.object({
  nome: z.string({ message: "Nome é obrigatório" }).min(1, "Nome é obrigatório"),
  descricao: z.string({ message: "Descrição é obrigatória" }).min(1, "Descrição é obrigatória"),
  dominioId: z.string().optional(),
  politicaId: z.string().optional(),
  regulacaoId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ProdutoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  produto?: ProdutoDadosResponse
}

export function ProdutoForm({ open, onOpenChange, produto }: ProdutoFormProps) {
  const isEditing = !!produto
  const createProduto = useCreateProdutoDados()
  const updateProduto = useUpdateProdutoDados()

  const { data: comunidadesData } = useComunidades({ page: 1, limit: 1000 })
  const { data: politicasData } = usePoliticasInternas({ page: 1, limit: 1000 })

  const comunidades = comunidadesData?.data || []
  const politicas = politicasData?.data || []

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      dominioId: "",
      politicaId: "",
      regulacaoId: "",
    },
  })

  useEffect(() => {
    if (produto) {
      form.reset({
        nome: produto.nome || "",
        descricao: produto.descricao || "",
        dominioId: produto.dominioId || "",
        politicaId: produto.politicaId || "",
        regulacaoId: produto.regulacaoId || "",
      })
    } else {
      form.reset({
        nome: "",
        descricao: "",
        dominioId: "",
        politicaId: "",
        regulacaoId: "",
      })
    }
  }, [produto, form])

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        nome: data.nome,
        descricao: data.descricao,
        dominioId: data.dominioId || undefined,
        politicaId: data.politicaId || undefined,
        regulacaoId: data.regulacaoId || undefined,
        // Arrays opcionais mantidos do produto existente ou vazios
        termos: produto?.termos || undefined,
        ativos: produto?.ativos || undefined,
        regrasNegocio: produto?.regrasNegocio || undefined,
        regrasQualidade: produto?.regrasQualidade || undefined,
      }

      if (isEditing) {
        await updateProduto.mutateAsync({ id: produto.id, data: payload })
      } else {
        await createProduto.mutateAsync(payload)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar" : "Novo"} Produto de Dados</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações do produto de dados"
              : "Preencha os campos para criar um novo produto de dados"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Cadastro de Clientes" {...field} />
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
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o produto de dados, sua finalidade e contexto"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dominioId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domínio (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o domínio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {comunidades.map((comunidade) => (
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

            <FormField
              control={form.control}
              name="politicaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Política (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a política" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      {politicas.map((politica) => (
                        <SelectItem key={politica.id} value={politica.id}>
                          {politica.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormDescription className="text-sm text-muted-foreground">
              💡 Relacionamentos com termos, ativos e regras serão gerenciados em telas específicas
            </FormDescription>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createProduto.isPending || updateProduto.isPending}>
                {createProduto.isPending || updateProduto.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
