"use client"

import { useEffect } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateRepositorioDocumento, useUpdateRepositorioDocumento } from "@/hooks/api/use-repositorios-documento"
import { RepositorioDocumentoResponse } from "@/types/api"
import { CreateRepositorioDocumentoSchema, type CreateRepositorioDocumentoFormData } from "@/schemas"

interface RepositorioFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  repositorio?: RepositorioDocumentoResponse
}

export function RepositorioForm({ open, onOpenChange, repositorio }: RepositorioFormProps) {
  const createMutation = useCreateRepositorioDocumento()
  const updateMutation = useUpdateRepositorioDocumento()
  
  const form = useForm<CreateRepositorioDocumentoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateRepositorioDocumentoSchema) as any,
    defaultValues: {
      nome: "",
      ged: false,
      rede: false,
    },
  })

  useEffect(() => {
    if (open) {
      if (repositorio) {
        form.reset({
          nome: repositorio.nome,
          ged: repositorio.ged,
          rede: repositorio.rede,
        })
      } else {
        form.reset({
          nome: "",
          ged: false,
          rede: false,
        })
      }
    }
  }, [open, repositorio, form])

  const onSubmit = async (data: CreateRepositorioDocumentoFormData) => {
    try {
      if (repositorio) {
        await updateMutation.mutateAsync({
          id: repositorio.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar repositório:', error)
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {repositorio ? "Editar Repositório de Documentos" : "Novo Repositório de Documentos"}
          </DialogTitle>
          <DialogDescription>
            {repositorio 
              ? "Atualize as informações do repositório de documentos."
              : "Preencha os dados para criar um novo repositório de documentos."
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
                    <Input placeholder="Ex: Repositório Central de Documentos" {...field} />
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
              name="ged"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      GED (Gerenciamento Eletrônico de Documentos)
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Indica se este é um repositório de GED
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rede"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Repositório em Rede
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Indica se este repositório está em rede compartilhada
                    </FormDescription>
                  </div>
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
                {isSubmitting ? "Salvando..." : repositorio ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
