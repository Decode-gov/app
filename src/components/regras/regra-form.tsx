"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type CreateRegraNegocioFormData, CreateRegraNegocioSchema } from "@/schemas";
import type { RegraNegocioResponse } from "@/types/api";
import { usePostRegrasNegocio, usePutRegrasNegocioId } from "@/api/generated/endpoints/regras-de-negócio/regras-de-negócio";
import { useGetPoliticasInternas } from "@/api/generated/endpoints/políticas-internas/políticas-internas";
import { useGetSistemas } from "@/api/generated/endpoints/sistemas/sistemas";
import { useGetPapeis } from "@/api/generated/endpoints/papéis/papéis";
import { useGetDefinicoes } from "@/api/generated/endpoints/termos/termos";

interface RegraFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regra?: RegraNegocioResponse;
}

export function RegraForm({ open, onOpenChange, regra }: RegraFormProps) {
  const createMutation = usePostRegrasNegocio();
  const updateMutation = usePutRegrasNegocioId();
  const { data: politicasData } = useGetPoliticasInternas();
  const { data: sistemasData } = useGetSistemas();
  const { data: papeisData } = useGetPapeis();
  const { data: definicoesData } = useGetDefinicoes();

  const form = useForm<CreateRegraNegocioFormData>({
    resolver: zodResolver(CreateRegraNegocioSchema),
    defaultValues: {
      descricao: "",
      politicaId: "",
      sistemaId: null,
      responsavelId: "",
      termoId: "",
    },
  });

  useEffect(() => {
    if (regra) {
      form.reset({
        descricao: regra.descricao,
        politicaId: regra.politicaId,
        sistemaId: regra.sistemaId || null,
        responsavelId: regra.responsavelId,
        termoId: regra.termoId,
      });
    } else {
      form.reset({
        descricao: "",
        politicaId: "",
        sistemaId: null,
        responsavelId: "",
        termoId: "",
      });
    }
  }, [regra, form]);

  const onSubmit = async (data: CreateRegraNegocioFormData) => {
    try {
      const submitData = {
        ...data,
        sistemaId: data.sistemaId || undefined,
      };

      if (regra) {
        await updateMutation.mutateAsync({ id: regra.id, data: submitData });
      } else {
        await createMutation.mutateAsync({
          data: submitData
        });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar regra de negócio:", error);
    }
  };

  const politicas = politicasData?.data || [];
  const sistemas = sistemasData?.data || [];
  const papeis = papeisData?.data || [];
  const definicoes = definicoesData?.data || [];
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{regra ? "Editar Regra de Negócio" : "Nova Regra de Negócio"}</DialogTitle>
          <DialogDescription>
            {regra
              ? "Atualize as informações da regra de negócio."
              : "Preencha os campos para cadastrar uma nova regra de negócio."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a regra de negócio..."
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
              name="politicaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Política Interna *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a política" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {politicas.map((politica) => (
                        <SelectItem key={politica.id ?? ""} value={politica.id ?? ""}>
                          {politica.nome} (v{politica.versao})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sistemaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistema</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o sistema (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {sistemas.map((sistema) => (
                        <SelectItem key={sistema.id} value={sistema.id}>
                          {sistema.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsavelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o responsável" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

            <FormField
              control={form.control}
              name="termoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Termo (Definição) *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o termo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {definicoes.map((definicao) => (
                        <SelectItem key={definicao.id} value={definicao.id}>
                          {definicao.termo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {regra ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
