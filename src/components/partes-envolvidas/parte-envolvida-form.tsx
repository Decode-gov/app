"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateParteEnvolvida, useUpdateParteEnvolvida } from "@/hooks/api/use-partes-envolvidas"
import { usePapeis } from "@/hooks/api/use-papeis"
import { ParteEnvolvidaResponse } from "@/types/api"

const formSchema = z.object({
  nome: z.string({ message: "Nome é obrigatório" }).min(1, "Nome é obrigatório"),
  tipo: z.enum(['PESSOA_FISICA', 'PESSOA_JURIDICA', 'ORGAO_PUBLICO', 'ENTIDADE_EXTERNA'], {
    message: "Tipo é obrigatório",
  }),
  contato: z.string().optional(),
  papelId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ParteEnvolvidaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parte?: ParteEnvolvidaResponse
}

export function ParteEnvolvidaForm({ open, onOpenChange, parte }: ParteEnvolvidaFormProps) {
  const isEditing = !!parte
  const createParte = useCreateParteEnvolvida()
  const updateParte = useUpdateParteEnvolvida()

  const { data: papeisData } = usePapeis({ page: 1, limit: 1000 })
  const papeis = papeisData?.data || []

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      tipo: "PESSOA_FISICA",
      contato: "",
      papelId: "",
    },
  })

  useEffect(() => {
    if (parte) {
      form.reset({
        nome: parte.nome || "",
        tipo: parte.tipo || "PESSOA_FISICA",
        contato: parte.contato || "",
        papelId: parte.papelId || "",
      })
    } else {
      form.reset({
        nome: "",
        tipo: "PESSOA_FISICA",
        contato: "",
        papelId: "",
      })
    }
  }, [parte, form])

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        nome: data.nome,
        tipo: data.tipo,
        contato: data.contato || undefined,
        papelId: data.papelId || undefined,
      }

      if (isEditing) {
        await updateParte.mutateAsync({ id: parte.id, data: payload })
      } else {
        await createParte.mutateAsync(payload)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro ao salvar parte envolvida:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar" : "Nova"} Parte Envolvida</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações da parte envolvida"
              : "Preencha os campos para criar uma nova parte envolvida"}
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
                    <Input placeholder="Ex: João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PESSOA_FISICA">Pessoa Física</SelectItem>
                      <SelectItem value="PESSOA_JURIDICA">Pessoa Jurídica</SelectItem>
                      <SelectItem value="ORGAO_PUBLICO">Órgão Público</SelectItem>
                      <SelectItem value="ENTIDADE_EXTERNA">Entidade Externa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: joao.silva@email.com ou (11) 98765-4321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="papelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Papel (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o papel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {papeis.map((papel) => (
                        <SelectItem key={papel.id} value={papel.id}>
                          {papel.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createParte.isPending || updateParte.isPending}>
                {createParte.isPending || updateParte.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
