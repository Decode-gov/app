"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { termoFormSchema, type Termo, type TermoFormData } from "@/types/termo"

interface TermoFormProps {
  open: boolean
  onClose: () => void
  termo?: Termo | null
  onSubmit: (data: TermoFormData) => Promise<void>
}

export function TermoForm({ open, onClose, termo, onSubmit }: TermoFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!termo

  const form = useForm<TermoFormData>({
    resolver: zodResolver(termoFormSchema),
    values: {
      nome: termo?.nome || "",
      descricao: termo?.descricao || "",
      sigla: termo?.sigla || "",
      ativo: termo?.ativo ?? true,
    },
  })

  const handleSubmit = async (data: TermoFormData) => {
    try {
      setIsLoading(true)
      await onSubmit(data)
    } catch (error) {
      console.error("Erro ao salvar termo:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-md border-border/50">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? "Editar Termo" : "Novo Termo"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? "Atualize as informações do termo."
              : "Preencha as informações para criar um novo termo."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome do termo"
                      {...field}
                      className="bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50"
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite a descrição do termo"
                      {...field}
                      className="bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50 min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sigla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sigla (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite a sigla do termo"
                      {...field}
                      className="bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === "true")} 
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Ativo</SelectItem>
                      <SelectItem value="false">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="bg-background/50 backdrop-blur-sm border-border/60 hover:bg-accent/50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
