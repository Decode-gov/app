"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PoliticaInternaForm } from "@/components/politicas/politica-interna-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PapelResponse } from "@/types/api";
import { usePostPapeis, usePutPapeisId } from "@/api/generated/endpoints/papéis/papéis";
import { useGetPoliticasInternas } from "@/api/generated/endpoints/políticas-internas/políticas-internas";
import { CreatePapelSchema, PapelFormData } from "@/schemas";

// Schema alinhado com a especificação do prompt e tipos da API
const papelSchema = z.object({
  listaPapelId: z.uuid("Lista de Papel é obrigatória").optional(),
  nome: z.string().min(1, "Nome é obrigatório").max(255, "Nome deve ter no máximo 255 caracteres"),
  descricao: z.string().max(2000, "Descrição deve ter no máximo 2000 caracteres").optional(),
  politicaId: z.uuid("Política é obrigatória"),
});

type PapelFormValues = z.infer<typeof papelSchema>;

interface PapelGovernancaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  papel?: PapelResponse;
}

export function PapelGovernancaForm({ open, onOpenChange, papel }: PapelGovernancaFormProps) {
  const [politicaDialogOpen, setPoliticaDialogOpen] = useState(false);
  const createMutation = usePostPapeis();
  const updateMutation = usePutPapeisId();
  const { data: politicasData } = useGetPoliticasInternas();

  const form = useForm<PapelFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // biome-ignore lint/suspicious/noExplicitAny: form type workaround
    resolver: zodResolver(CreatePapelSchema) as any,
    defaultValues: {
      nome: "",
      descricao: "",
      politicaId: "",
    },
    mode: "onChange",
  });

  // Resetar form quando o papel mudar ou dialog abrir
  useEffect(() => {
    if (open) {
      if (papel) {
        form.reset({
          nome: papel.nome,
          descricao: papel.descricao || "",
          politicaId: papel.politicaId,
        });
      } else {
        form.reset({
          nome: "",
          descricao: "",
          politicaId: "",
        });
      }
    }
  }, [open, papel, form]);

  const onSubmit = async (data: PapelFormValues) => {
    try {
      if (papel) {
        await updateMutation.mutateAsync({
          id: papel.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // biome-ignore lint/suspicious/noExplicitAny: form type workaround
          data: data as any,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // biome-ignore lint/suspicious/noExplicitAny: form type workaround
        await createMutation.mutateAsync(data as any);
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar papel:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createMutation.isPending && !updateMutation.isPending) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Filtrar políticas ativas
  const politicasAtivas = politicasData?.data ?? [];

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="overflow-y-auto bg-background/95 backdrop-blur-sm border-border/60">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {papel ? "Editar Papel de Governança" : "Novo Papel de Governança"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {papel
                ? "Atualize as informações do papel de governança."
                : "Preencha os dados para criar um novo papel de governança."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Nome (obrigatório) */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Nome *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Data Steward, Data Owner, DPO"
                        {...field}
                        className="bg-background/50 border-border/60 focus:border-primary/60"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Máximo 255 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descrição (obrigatória) */}
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Descrição *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva as responsabilidades e atribuições deste papel..."
                        className="min-h-[100px] bg-background/50 border-border/60 focus:border-primary/60"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Máximo 2000 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Política (obrigatória) */}
              <FormField
                control={form.control}
                name="politicaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Política Associada *</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/60 w-full">
                              <SelectValue placeholder="Selecione a política" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {politicasAtivas.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhuma política ativa encontrada
                              </div>
                            ) : (
                              politicasAtivas.map((politica) => (
                                <SelectItem key={politica.id ?? ""} value={politica.id ?? ""}>
                                  {politica.nome}
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
                        onClick={() => setPoliticaDialogOpen(true)}
                        className="bg-background/50 border-border/60 hover:bg-accent/50 flex-shrink-0"
                        title="Criar nova política"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs text-muted-foreground">
                      Selecione a política que define este papel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isSubmitting}
                  className="bg-background/50 border-border/60 hover:bg-accent/50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? "Salvando..." : papel ? "Salvar Alterações" : "Criar Papel"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog para criar política inline */}
      <PoliticaInternaForm open={politicaDialogOpen} onOpenChange={setPoliticaDialogOpen} />
    </>
  );
}
