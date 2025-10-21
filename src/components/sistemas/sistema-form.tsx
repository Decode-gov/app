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
import { useCreateSistema, useUpdateSistema } from "@/hooks/api/use-sistemas"
import { SistemaResponse } from "@/types/api"

const sistemaSchema = z.object({
  sistema: z.string().min(1, "Nome do sistema é obrigatório").max(255),
  bancoDados: z.string().max(255).optional(),
  repositorio: z.string().max(255).optional(),
  tecnologia: z.string().max(255).optional(),
  responsavelTecnico: z.string().max(255).optional(),
})

type SistemaFormValues = z.infer<typeof sistemaSchema>

interface SistemaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sistema?: SistemaResponse
}

export function SistemaForm({ open, onOpenChange, sistema }: SistemaFormProps) {
  const createMutation = useCreateSistema()
  const updateMutation = useUpdateSistema()
  
  const form = useForm<SistemaFormValues>({
    resolver: zodResolver(sistemaSchema),
    defaultValues: {
      sistema: "",
      bancoDados: "",
      repositorio: "",
      tecnologia: "",
      responsavelTecnico: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (sistema) {
        form.reset({
          sistema: sistema.sistema,
          bancoDados: sistema.bancoDados || "",
          repositorio: sistema.repositorio || "",
          tecnologia: sistema.tecnologia || "",
          responsavelTecnico: sistema.responsavelTecnico || "",
        })
      } else {
        form.reset({
          sistema: "",
          bancoDados: "",
          repositorio: "",
          tecnologia: "",
          responsavelTecnico: "",
        })
      }
    }
  }, [open, sistema, form])

  const onSubmit = async (data: SistemaFormValues) => {
    try {
      const payload = {
        nome: data.sistema,
        descricao: data.bancoDados,
      }
      if (sistema) {
        await updateMutation.mutateAsync({
          id: sistema.id,
          data: payload,
        })
      } else {
        await createMutation.mutateAsync(payload)
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar sistema:', error)
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
            {sistema ? "Editar Sistema" : "Novo Sistema"}
          </DialogTitle>
          <DialogDescription>
            {sistema 
              ? "Atualize as informações do sistema."
              : "Preencha os dados para criar um novo sistema."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sistema"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Sistema *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: ERP Financeiro" {...field} />
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
              name="bancoDados"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco de Dados</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: PostgreSQL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repositorio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repositório</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: github.com/org/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tecnologia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tecnologia</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Node.js, React" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsavelTecnico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável Técnico</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: João Silva" {...field} />
                  </FormControl>
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
                {isSubmitting ? "Salvando..." : sistema ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
