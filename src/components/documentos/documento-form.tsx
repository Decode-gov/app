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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCreateDocumento, useUpdateDocumento } from "@/hooks/api/use-documentos"
import { DocumentoResponse } from "@/types/api"

// Schema baseado nos requisitos
const documentoFormSchema = z.object({
  entidadeId: z.string().uuid("ID de entidade inválido").min(1, "Entidade é obrigatória"),
  tipoEntidade: z.enum([
    'Politica',
    'Papel',
    'Atribuicao',
    'Processo',
    'Termo',
    'KPI',
    'RegraNegocio',
    'RegraQualidade',
    'Dominio',
    'Sistema',
    'Tabela',
    'Coluna'
  ], { message: "Tipo de entidade é obrigatório" }),
  nomeArquivo: z.string().min(1, "Nome do arquivo é obrigatório"),
  tamanhoBytes: z.number().int().positive("Tamanho deve ser positivo"),
  tipoArquivo: z.string().min(1, "Tipo de arquivo é obrigatório"),
  caminhoArquivo: z.string().min(1, "Caminho do arquivo é obrigatório"),
  descricao: z.string().optional(),
  metadados: z.string().optional(),
  checksum: z.string().optional(),
  versao: z.number().int().positive().default(1),
  ativo: z.boolean().default(true),
})

type DocumentoFormValues = z.infer<typeof documentoFormSchema>

interface DocumentoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documento?: DocumentoResponse
}

const tiposEntidade = [
  { value: 'Politica', label: 'Política' },
  { value: 'Papel', label: 'Papel' },
  { value: 'Atribuicao', label: 'Atribuição' },
  { value: 'Processo', label: 'Processo' },
  { value: 'Termo', label: 'Termo' },
  { value: 'KPI', label: 'KPI' },
  { value: 'RegraNegocio', label: 'Regra de Negócio' },
  { value: 'RegraQualidade', label: 'Regra de Qualidade' },
  { value: 'Dominio', label: 'Domínio' },
  { value: 'Sistema', label: 'Sistema' },
  { value: 'Tabela', label: 'Tabela' },
  { value: 'Coluna', label: 'Coluna' },
]

export function DocumentoForm({ open, onOpenChange, documento }: DocumentoFormProps) {
  const isEditing = !!documento
  const createMutation = useCreateDocumento()
  const updateMutation = useUpdateDocumento()
  
  const form = useForm<DocumentoFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(documentoFormSchema) as any,
    defaultValues: {
      entidadeId: "",
      tipoEntidade: "Politica",
      nomeArquivo: "",
      tamanhoBytes: 0,
      tipoArquivo: "",
      caminhoArquivo: "",
      descricao: "",
      metadados: "",
      checksum: "",
      versao: 1,
      ativo: true,
    },
  })

  useEffect(() => {
    if (open) {
      if (documento) {
        form.reset({
          entidadeId: documento.entidadeId,
          tipoEntidade: documento.tipoEntidade,
          nomeArquivo: documento.nomeArquivo,
          tamanhoBytes: documento.tamanhoBytes,
          tipoArquivo: documento.tipoArquivo,
          caminhoArquivo: documento.caminhoArquivo,
          descricao: documento.descricao || "",
          metadados: documento.metadados || "",
          checksum: documento.checksum || "",
          versao: documento.versao,
          ativo: documento.ativo,
        })
      } else {
        form.reset({
          entidadeId: "",
          tipoEntidade: "Politica",
          nomeArquivo: "",
          tamanhoBytes: 0,
          tipoArquivo: "",
          caminhoArquivo: "",
          descricao: "",
          metadados: "",
          checksum: "",
          versao: 1,
          ativo: true,
        })
      }
    }
  }, [open, documento, form])

  const onSubmit = async (data: DocumentoFormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: documento.id,
          data: {
            descricao: data.descricao,
            metadados: data.metadados,
            ativo: data.ativo,
          },
        })
      } else {
        await createMutation.mutateAsync(data)
      }

      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar documento:', error)
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Metadados do Documento" : "Registrar Novo Documento"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize apenas descricao, metadados e status ativo."
              : "Registre as informações do documento. Sistema genérico para anexar a qualquer entidade."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isEditing && (
              <>
                {/* Entidade ID */}
                <FormField
                  control={form.control}
                  name="entidadeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID da Entidade *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="UUID da entidade (Política, Sistema, Termo, etc.)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        ID da entidade à qual este documento será anexado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tipo de Entidade */}
                <FormField
                  control={form.control}
                  name="tipoEntidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Entidade *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposEntidade.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Tipo da entidade (Política, Papel, Sistema, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* Nome do Arquivo */}
                  <FormField
                    control={form.control}
                    name="nomeArquivo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Arquivo *</FormLabel>
                        <FormControl>
                          <Input placeholder="documento.pdf" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tipo de Arquivo */}
                  <FormField
                    control={form.control}
                    name="tipoArquivo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Arquivo *</FormLabel>
                        <FormControl>
                          <Input placeholder="application/pdf" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Tamanho em Bytes */}
                  <FormField
                    control={form.control}
                    name="tamanhoBytes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamanho (bytes) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1024"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Versão */}
                  <FormField
                    control={form.control}
                    name="versao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Versão *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Caminho do Arquivo */}
                <FormField
                  control={form.control}
                  name="caminhoArquivo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caminho do Arquivo *</FormLabel>
                      <FormControl>
                        <Input placeholder="/uploads/documentos/arquivo.pdf" {...field} />
                      </FormControl>
                      <FormDescription>
                        Caminho onde o arquivo está armazenado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Checksum */}
                <FormField
                  control={form.control}
                  name="checksum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Checksum</FormLabel>
                      <FormControl>
                        <Input placeholder="Hash MD5/SHA256 do arquivo" {...field} />
                      </FormControl>
                      <FormDescription>
                        Hash para verificação de integridade (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Descrição */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o documento..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Metadados (JSON) */}
            <FormField
              control={form.control}
              name="metadados"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metadados (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{"autor": "Nome", "departamento": "TI"}'
                      className="min-h-[80px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Metadados adicionais no formato JSON (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ativo */}
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Documento Ativo
                    </FormLabel>
                    <FormDescription>
                      Define se o documento está ativo no sistema
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Documento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
