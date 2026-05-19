"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  usePostProdutosDados,
  usePutProdutosDadosId,
} from "@/api/generated/endpoints/produtos-de-dados/produtos-de-dados";
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
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProdutoDadosResponse } from "@/types/api";

const formSchema = z.object({
  nome: z.string({ message: "Nome é obrigatório" }).min(1, "Nome é obrigatório"),
  descricao: z.string({ message: "Descrição é obrigatória" }).min(1, "Descrição é obrigatória"),
  dominioId: z.string().optional(),
  politicaId: z.string().optional(),
  regulacaoId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProdutoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produto?: ProdutoDadosResponse;
}

export function ProdutoForm({ open, onOpenChange, produto }: ProdutoFormProps) {
  const isEditing = !!produto;
  const createProduto = usePostProdutosDados();
  const updateProduto = usePutProdutosDadosId();


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: produto?.nome ?? '',
      descricao: produto?.descricao ?? "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {

      if (isEditing) {
        await updateProduto.mutateAsync({ id: produto.id, data });
      } else {
        await createProduto.mutateAsync({ data });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar" : "Novo"} Produto de Dados</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações do produto de dados"
              : "Preencha os campos para criar um novo produto de dados"}
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
                    <Input placeholder="Ex: Cadastro de Clientes" {...field} />
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
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o produto de dados, sua finalidade e contexto"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createProduto.isPending || updateProduto.isPending}>
                {createProduto.isPending || updateProduto.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
