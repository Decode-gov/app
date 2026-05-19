"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  usePostComitesAprovadores,
  usePutComitesAprovadoresId,
} from "@/api/generated/endpoints/comitês-aprovadores/comitês-aprovadores";
import {
  type PostComitesAprovadoresBody,
  PostComitesAprovadoresBody as PostComitesAprovadoresBodySchema,
} from "@/api/generated/model";
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
import type { GetComiteAprovador200DataItem } from "@/types/api";

interface ComiteAprovadorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comite?: GetComiteAprovador200DataItem;
}

export function ComiteAprovadorForm({ open, onOpenChange, comite }: ComiteAprovadorFormProps) {
  const createMutation = usePostComitesAprovadores();
  const updateMutation = usePutComitesAprovadoresId();

  const form = useForm<PostComitesAprovadoresBody>({
    resolver: zodResolver(PostComitesAprovadoresBodySchema),
    defaultValues: {
      nome: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (comite) {
        form.reset({
          nome: comite.nome,
        });
      } else {
        form.reset({
          nome: "",
        });
      }
    }
  }, [open, comite, form]);

  const onSubmit = async (data: PostComitesAprovadoresBody) => {
    try {
      if (comite) {
        await updateMutation.mutateAsync({
          id: comite.id,
          data,
        });
      } else {
        await createMutation.mutateAsync({
          data
        });
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar comitê aprovador:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createMutation.isPending && !updateMutation.isPending) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{comite ? "Editar comitê aprovador" : "Novo comitê aprovador"}</DialogTitle>
          <DialogDescription>
            {comite
              ? "Atualize as informações do comitê aprovador."
              : "Preencha os dados para criar um novo comitê aprovador."}
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
                    <Input placeholder="Ex: Comitê de Governança" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">Máximo 255 caracteres</FormDescription>
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
                {isSubmitting ? "Salvando..." : comite ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
