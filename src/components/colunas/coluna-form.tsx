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
import { Plus } from "lucide-react"
import { useCreateColuna, useUpdateColuna } from "@/hooks/api/use-colunas"
import { useTabelas } from "@/hooks/api/use-tabelas"
import { useTiposDados } from "@/hooks/api/use-tipos-dados"
import { ColunaResponse } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { TabelaForm } from "@/components/tabelas/tabela-form"
import { TipoDadosForm } from "@/components/tipos-dados/tipo-dados-form"

const colunaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
  descricao: z.string().max(1000).optional(),
  tabelaId: z.string().min(1, "Tabela é obrigatória"),
  tipoDadosId: z.string().min(1, "Tipo de dados é obrigatório"),
})

type ColunaFormValues = z.infer<typeof colunaSchema>

interface ColunaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coluna?: ColunaResponse
}

export function ColunaForm({ open, onOpenChange, coluna }: ColunaFormProps) {
  const [tabelaDialogOpen, setTabelaDialogOpen] = useState(false)
  const [tipoDadosDialogOpen, setTipoDadosDialogOpen] = useState(false)
  
  const createMutation = useCreateColuna()
  const updateMutation = useUpdateColuna()
  const { data: tabelasData } = useTabelas()
  const { data: tiposDadosData } = useTiposDados()
  
  const form = useForm<ColunaFormValues>({
    resolver: zodResolver(colunaSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      tabelaId: "",
      tipoDadosId: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (coluna) {
        form.reset({
          nome: coluna.nome,
          descricao: coluna.descricao || "",
          tabelaId: coluna.tabelaId,
          tipoDadosId: coluna.tipoDadosId,
        })
      } else {
        form.reset({
          nome: "",
          descricao: "",
          tabelaId: "",
          tipoDadosId: "",
        })
      }
    }
  }, [open, coluna, form])

  const onSubmit = async (data: ColunaFormValues) => {
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
  const tiposDados = tiposDadosData?.data || []

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
                            <SelectTrigger>
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
                                  <div className="flex flex-col">
                                    <span>{tabela.nome}</span>
                                    {tabela.descricao && (
                                      <span className="text-xs text-muted-foreground line-clamp-1">
                                        {tabela.descricao}
                                      </span>
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
                name="tipoDadosId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Dados *</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposDados.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhum tipo de dados encontrado
                              </div>
                            ) : (
                              tiposDados.map((tipo) => (
                                <SelectItem key={tipo.id} value={tipo.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{tipo.nome}</span>
                                    {tipo.categoria && (
                                      <Badge variant="outline" className="text-xs">
                                        {tipo.categoria}
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
                        onClick={() => setTipoDadosDialogOpen(true)}
                        title="Criar novo tipo de dados"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs">
                      Tipo de dados que define a coluna
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

      <TipoDadosForm 
        open={tipoDadosDialogOpen}
        onOpenChange={setTipoDadosDialogOpen}
      />
    </>
  )
}
