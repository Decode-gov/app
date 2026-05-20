"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  usePostRegulacoesCompletas,
  usePutRegulacoesCompletasId,
} from "@/api/generated/endpoints/regulações-completas/regulações-completas";
import {
  type PostRegulacoesCompletasBody,
  PostRegulacoesCompletasBody as PostRegulacoesCompletasBodySchema,
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { RegulacaoResponse } from "@/types/api";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface RegulacaoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regulacao?: RegulacaoResponse;
}

export function RegulacaoForm({ open, onOpenChange, regulacao }: RegulacaoFormProps) {
  const isEditing = !!regulacao;
  const createRegulacao = usePostRegulacoesCompletas();
  const updateRegulacao = usePutRegulacoesCompletasId();

  const form = useForm<PostRegulacoesCompletasBody>({
    resolver: zodResolver(PostRegulacoesCompletasBodySchema),
    defaultValues: {
      epigrafe: regulacao?.epigrafe,
      descricao: regulacao?.descricao,
      orgao: regulacao?.orgao || "",
      dataInicio: regulacao?.dataInicio ? new Date(regulacao.dataInicio) : new Date(),
      dataFim: regulacao?.dataFim ? new Date(regulacao.dataFim) : new Date(),
    },
  });

  const onSubmit = async (data: PostRegulacoesCompletasBody) => {
    try {
      if (isEditing) {
        await updateRegulacao.mutateAsync({ id: regulacao.id, data });
      } else {
        await createRegulacao.mutateAsync({
          data
        });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Regulação" : "Nova Regulação"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados da regulação."
              : "Preencha os dados para criar uma nova regulação."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="epigrafe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Epígrafe *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Lei 13.709/2018, Resolução BCB 4658/2018" {...field} />
                  </FormControl>
                  <FormDescription>
                    Identificador formal da regulação (lei, resolução, etc.)
                  </FormDescription>
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
                      placeholder="Descrição do objetivo e escopo da regulação"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Resumo do conteúdo e finalidade da regulação</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orgao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Órgão Regulador</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: ANPD, Banco Central, CVM" {...field} />
                  </FormControl>
                  <FormDescription>Órgão responsável pela regulação (opcional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data inicio de Vigência</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value as Date, "PPP", {
                              locale: ptBR
                            })
                          ) : (
                            <span>Selecione a data de inicio</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value as Date | undefined}
                        onSelect={field.onChange}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataFim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data final de vigencia</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value as Date, "PPP", {
                              locale: ptBR
                            })
                          ) : (
                            <span>Selecione a data de final da vigencia</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value as Date | undefined}
                        onSelect={field.onChange}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />


            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createRegulacao.isPending || updateRegulacao.isPending}
              >
                {createRegulacao.isPending || updateRegulacao.isPending
                  ? "Salvando..."
                  : isEditing
                    ? "Atualizar"
                    : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
