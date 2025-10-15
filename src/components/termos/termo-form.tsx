"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DefinicaoResponse } from "@/types/api"
import { useCreateDefinicao, useUpdateDefinicao } from "@/hooks/api/use-definicoes"

const formSchema = z.object({
  termo: z.string().min(1, "Termo é obrigatório"),
  definicao: z.string().min(1, "Definição é obrigatória"),
  exemploUso: z.string().optional(),
  sinonimos: z.string().optional(),
  fonteOrigem: z.string().optional(),
  ativo: z.boolean().default(true),
})

type FormData = z.infer<typeof formSchema>

interface TermoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  termo?: DefinicaoResponse
}

export function TermoForm({ open, onOpenChange, termo }: TermoFormProps) {
  const createMutation = useCreateDefinicao()
  const updateMutation = useUpdateDefinicao()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      termo: "",
      definicao: "",
      exemploUso: "",
      sinonimos: "",
      fonteOrigem: "",
      ativo: true,
    },
  })

  useEffect(() => {
    if (termo) {
      form.reset({
        termo: termo.termo,
        definicao: termo.definicao,
        exemploUso: termo.exemploUso || "",
        sinonimos: termo.sinonimos || "",
        fonteOrigem: termo.fonteOrigem || "",
        ativo: termo.ativo,
      })
    } else {
      form.reset({
        termo: "",
        definicao: "",
        exemploUso: "",
        sinonimos: "",
        fonteOrigem: "",
        ativo: true,
      })
    }
  }, [termo, form])

  const onSubmit = async (data: FormData) => {
    try {
      if (termo) {
        await updateMutation.mutateAsync({ id: termo.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erro ao salvar termo:", error)
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {termo ? "Editar Termo" : "Novo Termo"}
          </DialogTitle>
          <DialogDescription>
            {termo
              ? "Atualize as informações do termo."
              : "Preencha os campos para cadastrar um novo termo."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="termo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Termo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o termo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="definicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Definição *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite a definição"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exemploUso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exemplo de Uso</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite um exemplo"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sinonimos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sinônimos</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Separados por vírgula" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fonteOrigem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fonte de Origem</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite a fonte" 
                      {...field} 
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Termo ativo</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {termo ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
