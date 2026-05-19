"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  getGetComunidadesQueryKey,
  useGetComunidades,
  usePostComunidades,
  usePutComunidadesId,
} from "@/api/generated/endpoints/comunidades/comunidades";
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
import { useEmpresaIdParam } from "@/hooks/use-empresa-id-param";
import type { ComunidadeResponse } from "@/types/api";

const comunidadeSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
  parentId: z.string().optional(),
});

type ComunidadeFormValues = z.infer<typeof comunidadeSchema>;

interface ComunidadeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comunidade?: ComunidadeResponse;
}

export function ComunidadeForm({ open, onOpenChange, comunidade }: ComunidadeFormProps) {
  const queryClient = useQueryClient();
  const empresaParams = useEmpresaIdParam();
  const createMutation = usePostComunidades();
  const updateMutation = usePutComunidadesId();
  const { data: comunidadesData } = useGetComunidades(empresaParams);

  const form = useForm<ComunidadeFormValues>({
    resolver: zodResolver(comunidadeSchema),
    defaultValues: {
      nome: "",
      parentId: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (comunidade) {
        form.reset({
          nome: comunidade.nome,
          parentId: comunidade.parentId || "",
        });
      } else {
        form.reset({
          nome: "",
          parentId: "",
        });
      }
    }
  }, [open, comunidade, form]);

  const onSubmit = async (data: ComunidadeFormValues) => {
    try {
      const payload = {
        ...data,
        parentId: data.parentId || undefined,
      };

      if (comunidade) {
        await updateMutation.mutateAsync(
          {
            id: comunidade.id,
            data: payload,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: getGetComunidadesQueryKey(),
              });
              toast.success("Comunidade atualizada com sucesso!");
            },
          },
        );
      } else {
        await createMutation.mutateAsync(
          {
            data: payload,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: getGetComunidadesQueryKey(),
              });
              toast.success("Comunidade criada com sucesso!");
            },
          },
        );
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar comunidade:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createMutation.isPending && !updateMutation.isPending) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const comunidades = comunidadesData?.data || [];

  // Filtrar comunidades para não incluir a própria comunidade sendo editada
  const availableParents = comunidades.filter((c) => c.id !== comunidade?.id);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {comunidade ? "Editar domínio de dados" : "Novo domínio de dados"}
          </DialogTitle>
          <DialogDescription>
            {comunidade
              ? "Atualize as informações do domínio de dados."
              : "Preencha os dados para criar um novo domínio de dados."}
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
                    <Input placeholder="Ex: Vendas, TI, Marketing" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">Máximo 255 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comunidade Pai (Opcional)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "NONE" ? "" : value)}
                    value={field.value || "NONE"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a comunidade pai" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NONE">Nenhuma (raiz)</SelectItem>
                      {availableParents.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Define a hierarquia entre comunidades
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
                {isSubmitting ? "Salvando..." : comunidade ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
