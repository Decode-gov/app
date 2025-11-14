"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCreateBanco, useUpdateBanco } from "@/hooks/api/use-bancos"
import { useSistemas } from "@/hooks/api/use-sistemas"
import { BancoResponse } from "@/types/api"

const bancoSchema = z.object({
  nome: z.string().min(1, "Nome do banco é obrigatório").max(255),
  descricao: z.string().max(1000).optional(),
  sistemaId: z.string().optional(),
})

type BancoFormValues = z.infer<typeof bancoSchema>

interface BancoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  banco?: BancoResponse
}

export function BancoForm({ open, onOpenChange, banco }: BancoFormProps) {
  const isEditing = !!banco
  const createBanco = useCreateBanco()
  const updateBanco = useUpdateBanco()
  const { data: sistemasData } = useSistemas({ page: 1, limit: 1000 })

  const form = useForm<BancoFormValues>({
    resolver: zodResolver(bancoSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      sistemaId: "",
    },
  })

  useEffect(() => {
    if (banco && open) {
      form.reset({
        nome: banco.nome,
        sistemaId: banco.sistemaId || "",
      })
    } else if (!open) {
      form.reset()
    }
  }, [banco, open, form])

  const onSubmit = async (data: BancoFormValues) => {
    try {
      // Converter strings vazias em undefined
      const payload = {
        ...data,
        descricao: data.descricao || undefined,
        sistemaId: data.sistemaId || undefined,
      }

      if (isEditing) {
        await updateBanco.mutateAsync({ id: banco.id, data: payload })
      } else {
        await createBanco.mutateAsync(payload)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro:", error)
    }
  }

  const sistemas = sistemasData?.data || []
  const sistemaSelecionado = form.watch("sistemaId")
  const sistema = sistemas.find(s => s.id === sistemaSelecionado)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Banco de Dados" : "Novo Banco de Dados"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize os dados do banco de dados." 
              : "Preencha os dados para criar um novo banco de dados."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Banco *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: db_producao, db_analytics" {...field} />
                  </FormControl>
                  <FormDescription>Nome ou identificador do banco de dados (máx. 255 caracteres)</FormDescription>
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
                      placeholder="Descrição do banco de dados, finalidade, etc." 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Informações adicionais sobre o banco (opcional, máx. 1000 caracteres)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sistemaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistema</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      // Converter "none" de volta para string vazia
                      field.onChange(value === "none" ? "" : value)
                    }} 
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o sistema (opcional)">
                          {field.value && sistema && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{sistema.nome}</Badge>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhum sistema</SelectItem>
                      {sistemas.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          Nenhum sistema cadastrado
                        </div>
                      ) : (
                        sistemas.map(sistema => (
                          <SelectItem key={sistema.id} value={sistema.id}>
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">{sistema.nome}</span>
                              {sistema.descricao && (
                                <span className="text-xs text-muted-foreground">
                                  {sistema.descricao}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>Sistema ao qual este banco pertence (opcional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createBanco.isPending || updateBanco.isPending}
              >
                {createBanco.isPending || updateBanco.isPending 
                  ? "Salvando..." 
                  : isEditing ? "Atualizar" : "Criar"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
