"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
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
import { useCreateColuna, useUpdateColuna } from "@/hooks/api/use-colunas"
import { useTabelas } from "@/hooks/api/use-tabelas"
import { useDefinicoes } from "@/hooks/api/use-definicoes"
import { useNecessidadesInformacao } from "@/hooks/api/use-necessidades-informacao"
import { ColunaResponse } from "@/types/api"
import { CreateColunaSchema, type CreateColunaFormData } from "@/schemas"
import { TabelaForm } from "@/components/tabelas/tabela-form"

interface ColunaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coluna?: ColunaResponse
}

export function ColunaForm({ open, onOpenChange, coluna }: ColunaFormProps) {
  const [tabelaDialogOpen, setTabelaDialogOpen] = useState(false)
  
  const createMutation = useCreateColuna()
  const updateMutation = useUpdateColuna()
  const { data: tabelasData } = useTabelas({ page: 1, limit: 1000 })
  const { data: termosData } = useDefinicoes({ page: 1, limit: 1000 })
  const { data: necessidadesData } = useNecessidadesInformacao({ page: 1, limit: 1000 })
  
  const form = useForm<CreateColunaFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateColunaSchema) as any,
    defaultValues: {
      nome: "",
      descricao: null,
      tabelaId: "",
      politicaInternaId: null,
      termoId: null,
      necessidadeInformacaoId: null,
    },
  })

  useEffect(() => {
    if (open) {
      if (coluna) {
        form.reset({
          nome: coluna.nome,
          descricao: coluna.descricao || null,
          tabelaId: coluna.tabelaId,
          termoId: coluna.termoId || null,
          necessidadeInformacaoId: coluna.necessidadeInformacaoId || null,
        })
      } else {
        form.reset({
          nome: "",
          descricao: null,
          tabelaId: "",
          termoId: null,
          necessidadeInformacaoId: null,
        })
      }
    }
  }, [open, coluna, form])

  const onSubmit = async (data: CreateColunaFormData) => {
    try {
      if (coluna) {
        await updateMutation.mutateAsync({
          id: coluna.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar coluna:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createMutation.isPending && !updateMutation.isPending) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const tabelas = tabelasData?.data || []
  const termos = termosData?.data || []
  const necessidades = necessidadesData?.data || []

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {coluna ? "Editar Coluna" : "Nova Coluna"}
            </DialogTitle>
            <DialogDescription>
              {coluna 
                ? "Atualize as informações da coluna."
                : "Preencha os dados para criar uma nova coluna."
              }
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
                      <Input placeholder="Ex: id_cliente, nome_produto" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Máximo 255 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição da coluna..."
                        className="min-h-[80px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Máximo 1000 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tabelaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tabela *</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione a tabela" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tabelas.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhuma tabela encontrada
                              </div>
                            ) : (
                              tabelas.map((tabela) => (
                                <SelectItem key={tabela.id} value={tabela.id}>
                                  {tabela.nome}
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
                        onClick={() => setTabelaDialogOpen(true)}
                        title="Criar nova tabela"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs">
                      Tabela à qual esta coluna pertence
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termo</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === "none" ? null : value)} 
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o termo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
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
                    <FormDescription className="text-xs">
                      Termo de negócio associado à coluna
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="necessidadeInformacaoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Necessidade de Informação</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === "none" ? null : value)} 
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a necessidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma</SelectItem>
                        {necessidades.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            Nenhuma necessidade encontrada
                          </div>
                        ) : (
                          necessidades.map((necessidade) => (
                            <SelectItem key={necessidade.id} value={necessidade.id}>
                              <div className="flex flex-col">
                                <span className="line-clamp-1">{necessidade.questaoGerencial}</span>
                                {necessidade.elementoEstrategico && (
                                  <span className="text-xs text-muted-foreground line-clamp-1">
                                    {necessidade.elementoEstrategico}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Necessidade de informação que justifica a coluna
                    </FormDescription>
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
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : coluna ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <TabelaForm 
        open={tabelaDialogOpen}
        onOpenChange={setTabelaDialogOpen}
      />
    </>
  )
}
