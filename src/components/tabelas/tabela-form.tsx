"use client"

import { useEffect, useState } from "react"
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
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
import { TabelaResponse } from "@/types/api"
import { CreateTabelaSchema, type CreateTabelaFormData } from "@/schemas"
import { BancoForm } from "@/components/bancos/banco-form"

interface TabelaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tabela?: TabelaResponse
}

export function TabelaForm({ open, onOpenChange, tabela }: TabelaFormProps) {
  const [bancoDialogOpen, setBancoDialogOpen] = useState(false)
  
  const createMutation = useCreateTabela()
  const updateMutation = useUpdateTabela()
  const { data: bancosData } = useBancos()
  
  const form = useForm<CreateTabelaFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateTabelaSchema) as any,
    defaultValues: {
      nome: "",
      bancoId: null,
    },
  })

  useEffect(() => {
    if (open) {
      if (tabela) {
        form.reset({
          nome: tabela.nome,
          bancoId: tabela.bancoId || null,
        })
      } else {
        form.reset({
          nome: "",
          bancoId: null,
        })
      }
    }
  }, [open, tabela, form])

  const onSubmit = async (data: CreateTabelaFormData) => {
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
                name="bancoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banco de Dados</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione o banco" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Nenhum</SelectItem>
                            {bancos.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhum banco encontrado
                              </div>
                            ) : (
                              bancos.map((banco) => (
                                <SelectItem key={banco.id} value={banco.id}>
                                  {banco.nome}
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
    </>
  )
}
