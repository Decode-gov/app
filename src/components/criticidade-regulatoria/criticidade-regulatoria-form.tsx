"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
    CreateCriticidadeRegulatoriaFormData,
    CreateCriticidadeRegulatoriaSchema,
} from "@/schemas";
import {
    useCreateCriticidadeRegulatoria,
    useUpdateCriticidadeRegulatoria,
} from "@/hooks/api/use-criticidade-regulatoria";
import { useRegulacoes } from "@/hooks/api/use-regulacao";
import { useRegrasQualidade } from "@/hooks/api/use-regras-qualidade";
import { CriticidadeRegulatoriaResponse } from "@/types/api";
import {
    Dialog,
    DialogContent,
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
import { Button } from "@/components/ui/button";

interface CriticidadeRegulatoriaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  criticidade?: CriticidadeRegulatoriaResponse;
}

export function CriticidadeRegulatoriaForm({
  open,
  onOpenChange,
  criticidade,
}: CriticidadeRegulatoriaFormProps) {
  const isEditing = !!criticidade;

  const form = useForm<CreateCriticidadeRegulatoriaFormData>({
    resolver: zodResolver(CreateCriticidadeRegulatoriaSchema),
    defaultValues: {
      regulacaoId: "",
      regraQualidadeId: "",
      grauCriticidade: "BAIXA",
    },
  });

  const { data: regulacoes, isLoading: loadingRegulacoes } = useRegulacoes({});
  const { data: regrasQualidade, isLoading: loadingRegras } =
    useRegrasQualidade({});

  const createMutation = useCreateCriticidadeRegulatoria();
  const updateMutation = useUpdateCriticidadeRegulatoria();

  useEffect(() => {
    if (criticidade) {
      form.reset({
        regulacaoId: criticidade.regulacaoId,
        regraQualidadeId: criticidade.regraQualidadeId,
        grauCriticidade: criticidade.grauCriticidade,
      });
    } else {
      form.reset({
        regulacaoId: "",
        regraQualidadeId: "",
        grauCriticidade: "BAIXA",
      });
    }
  }, [criticidade, form]);

  const onSubmit = async (data: CreateCriticidadeRegulatoriaFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: criticidade.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar criticidade regulatória:", error);
    }
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    loadingRegulacoes ||
    loadingRegras;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Editar Criticidade Regulatória"
              : "Nova Criticidade Regulatória"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="regulacaoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regulação *</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={(value) => {
                      field.onChange(value === "none" ? "" : value);
                    }}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma regulação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        Selecione uma regulação
                      </SelectItem>
                      {regulacoes?.data?.map((regulacao) => (
                        <SelectItem key={regulacao.id} value={regulacao.id}>
                          {regulacao.epigrafe} - {regulacao.nome}
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
              name="regraQualidadeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regra de Qualidade *</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={(value) => {
                      field.onChange(value === "none" ? "" : value);
                    }}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma regra de qualidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        Selecione uma regra de qualidade
                      </SelectItem>
                      {regrasQualidade?.data?.map((regra) => (
                        <SelectItem key={regra.id} value={regra.id}>
                          {regra.descricao}
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
              name="grauCriticidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grau de Criticidade *</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o grau de criticidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BAIXA">Baixa</SelectItem>
                      <SelectItem value="MEDIA">Média</SelectItem>
                      <SelectItem value="ALTA">Alta</SelectItem>
                      <SelectItem value="CRITICA">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Salvar Alterações" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
