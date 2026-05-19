"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import {
  getGetEmpresasQueryKey,
  postEmpresas,
  putEmpresasId,
} from "@/api/generated/endpoints/empresas/empresas";
import type { GetEmpresas200 } from "@/api/generated/model";
import { PostEmpresasBody } from "@/api/generated/zod/empresas/empresas.zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormData = z.output<typeof PostEmpresasBody>;

interface EmpresaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa?: GetEmpresas200["data"][number];
}

export function EmpresaForm({ open, onOpenChange, empresa }: EmpresaFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!empresa;

  const form = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(PostEmpresasBody),
    defaultValues: { nome: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ nome: empresa?.nome ?? "" });
    }
  }, [empresa, open, form]);

  const createMutation = useMutation({
    mutationFn: (data: FormData) => postEmpresas(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetEmpresasQueryKey() });
      toast.success("Empresa criada com sucesso!");
      onOpenChange(false);
    },
    onError: () => toast.error("Erro ao criar empresa"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => putEmpresasId(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetEmpresasQueryKey() });
      toast.success("Empresa atualizada com sucesso!");
      onOpenChange(false);
    },
    onError: () => toast.error("Erro ao atualizar empresa"),
  });

  const onSubmit = async (data: FormData) => {
    if (isEdit && empresa) {
      await updateMutation.mutateAsync({ id: empresa.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Empresa" : "Nova Empresa"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize as informações da empresa."
              : "Preencha os campos para cadastrar uma nova empresa."}
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
                    <Input placeholder="Digite o nome da empresa..." {...field} />
                  </FormControl>
                  <FormMessage />
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
                {isEdit ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
