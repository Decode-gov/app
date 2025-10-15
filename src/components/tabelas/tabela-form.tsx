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
import { useCreateTabela, useUpdateTabela } from "@/hooks/api/use-tabelas"
import { useBancos } from "@/hooks/api/use-bancos"
import { useSistemas } from "@/hooks/api/use-sistemas"
import { TabelaResponse } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { BancoForm } from "@/components/bancos/banco-form"
import { SistemaForm } from "@/components/sistemas/sistema-form"

const tabelaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
  descricao: z.string().max(1000).optional(),
  bancoId: z.string().min(1, "Banco é obrigatório"),
  sistemaId: z.string().min(1, "Sistema é obrigatório"),
})

type TabelaFormValues = z.infer<typeof tabelaSchema>

interface TabelaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tabela?: TabelaResponse
}

export function TabelaForm({ open, onOpenChange, tabela }: TabelaFormProps) {
  const [bancoDialogOpen, setBancoDialogOpen] = useState(false)
  const [sistemaDialogOpen, setSistemaDialogOpen] = useState(false)
  
  const createMutation = useCreateTabela()
  const updateMutation = useUpdateTabela()
  const { data: bancosData } = useBancos()
  const { data: sistemasData } = useSistemas()
  
  const form = useForm<TabelaFormValues>({
    resolver: zodResolver(tabelaSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      bancoId: "",
      sistemaId: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (tabela) {
        form.reset({
          nome: tabela.nome,
          descricao: tabela.descricao || "",
          bancoId: tabela.bancoId,
          sistemaId: tabela.sistemaId,
        })
      } else {
        form.reset({
          nome: "",
          descricao: "",
          bancoId: "",
          sistemaId: "",
        })
      }
    }
  }, [open, tabela, form])

  const onSubmit = async (data: TabelaFormValues) => {
    try {
      if (tabela) {
        await updateMutation.mutateAsync({
          id: tabela.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar tabela:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createMutation.isPending && !updateMutation.isPending) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const bancos = bancosData?.data || []
  const sistemas = sistemasData?.data || []

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {tabela ? "Editar Tabela" : "Nova Tabela"}
            </DialogTitle>
            <DialogDescription>
              {tabela 
                ? "Atualize as informações da tabela."
                : "Preencha os dados para criar uma nova tabela."
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
                      <Input placeholder="Ex: tb_clientes" {...field} />
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
                        placeholder="Descrição da tabela..."
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
                name="bancoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banco de Dados *</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o banco" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bancos.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhum banco encontrado
                              </div>
                            ) : (
                              bancos.map((banco) => (
                                <SelectItem key={banco.id} value={banco.id}>
                                  <div className="flex flex-col">
                                    <span>{banco.nome}</span>
                                    {banco.descricao && (
                                      <span className="text-xs text-muted-foreground line-clamp-1">
                                        {banco.descricao}
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
                        onClick={() => setBancoDialogOpen(true)}
                        title="Criar novo banco"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs">
                      Banco de dados onde a tabela está armazenada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sistemaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sistema *</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o sistema" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sistemas.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhum sistema encontrado
                              </div>
                            ) : (
                              sistemas.map((sistema) => (
                                <SelectItem key={sistema.id} value={sistema.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{sistema.sistema}</span>
                                    {sistema.tecnologia && (
                                      <Badge variant="outline" className="text-xs">
                                        {sistema.tecnologia}
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
                        onClick={() => setSistemaDialogOpen(true)}
                        title="Criar novo sistema"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs">
                      Sistema que utiliza esta tabela
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
                  {isSubmitting ? "Salvando..." : tabela ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <BancoForm 
        open={bancoDialogOpen}
        onOpenChange={setBancoDialogOpen}
      />

      <SistemaForm 
        open={sistemaDialogOpen}
        onOpenChange={setSistemaDialogOpen}
      />
    </>
  )
}
