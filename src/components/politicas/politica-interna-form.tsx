"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useGetComunidades } from "@/api/generated/endpoints/comunidades/comunidades";
import {
  getGetPoliticasInternasQueryKey,
  usePostPoliticasInternas,
  usePutPoliticasInternasId,
} from "@/api/generated/endpoints/políticas-internas/políticas-internas";
import { ComunidadeForm } from "@/components/dominios/comunidade-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { GetPoliticasInternas200DataItem } from "@/types/api";

const politicaInternaFormSchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().min(1).optional(),
  categoria: z.string().min(1).optional(),
  objetivo: z.string().min(1).optional(),
  escopo: z.string().min(1).optional(),
  dominioDadosId: z.uuid().optional(),
  responsavel: z.string().min(1).optional(),
  dataCriacao: z.coerce.date(),
  dataInicioVigencia: z.coerce.date(),
  dataTermino: z.coerce.date().optional(),
  status: z.enum(["Em_elaboracao", "Vigente", "Revogada"]),
  versao: z.string().min(1),
  anexosUrl: z.string().optional(),
  relacionamento: z.string().optional(),
  observacoes: z.string().optional(),
});

type PoliticaInternaFormValues = z.infer<typeof politicaInternaFormSchema>;

interface PoliticaInternaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  politica?: GetPoliticasInternas200DataItem;
}

export function PoliticaInternaForm({ open, onOpenChange, politica }: PoliticaInternaFormProps) {
  const [dominioDialogOpen, setDominioDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = usePostPoliticasInternas({
    mutation: {
      onSuccess: () => {
        toast.success("Politica interna criada com sucesso!");

        queryClient.invalidateQueries({
          queryKey: getGetPoliticasInternasQueryKey(),
        });
      },
      onError: () => {
        toast.error("Falha ao criar Politica interna!");
      },
    },
  });
  const updateMutation = usePutPoliticasInternasId({
    mutation: {
      onSuccess: () => {
        toast.success("Politica interna atualizada com sucesso!");

        queryClient.invalidateQueries({
          queryKey: getGetPoliticasInternasQueryKey(),
        });
      },
      onError: () => {
        toast.error("Falha ao atualizar Politica interna!");
      },
    },
  });
  const { data: comunidadesData } = useGetComunidades();

  const comunidades = comunidadesData?.data || [];

  const form = useForm<PoliticaInternaFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // biome-ignore lint/suspicious/noExplicitAny: form type workaround
    resolver: zodResolver(politicaInternaFormSchema) as any,
    defaultValues: {
      nome: politica ? politica.nome : "",
      descricao: politica ? politica.descricao : "",
      categoria: politica ? politica.categoria : "",
      objetivo: politica ? politica.objetivo : "",
      escopo: politica ? politica.escopo : "",
      dominioDadosId: (politica?.dominioDadosId) ? politica.dominioDadosId : '',
      responsavel: politica ? politica.responsavel : "",
      dataCriacao: politica ? new Date(politica.dataCriacao) : new Date(),
      dataInicioVigencia: politica ? new Date(politica.dataInicioVigencia) : new Date(),
      status: politica ? politica.status : "Em_elaboracao",
      versao: politica ? politica.versao : "",
      anexosUrl: (politica?.anexosUrl) ? politica.anexosUrl : "",
      relacionamento: (politica?.relacionamento) ? politica.relacionamento : "",
      observacoes: (politica?.observacoes) ? politica.observacoes : "",
    },
  });

  const onSubmit = async (data: PoliticaInternaFormValues) => {
    try {
      if (politica) {
        await updateMutation.mutateAsync({
          id: politica.id ?? "",
          data,
        });
      } else {
        await createMutation.mutateAsync({
          data,
        });
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar política:", error);
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
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-border/60">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {politica ? "Editar Política Interna" : "Nova Política Interna"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {politica
                ? "Atualize as informações da política de governança."
                : "Preencha os dados para criar uma nova política de governança."}
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
                        placeholder="Nome da política interna"
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

              {/* Descrição (opcional) */}
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o propósito e conteúdo desta política..."
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

              <div className="grid grid-cols-2 gap-4">
                {/* Escopo (obrigatório) */}
                <FormField
                  control={form.control}
                  name="escopo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Escopo *</FormLabel>
                      <Input
                        placeholder="Descreva o escopo da política"
                        {...field}
                        className="bg-background/50 border-border/60"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status (obrigatório) */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Status *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border/60 w-full">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Em_elaboracao">Em elaboração</SelectItem>
                          <SelectItem value="Vigente">Vigente</SelectItem>
                          <SelectItem value="Revogada">Revogada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Data de Criação (obrigatória) */}
                <FormField
                  control={form.control}
                  name="dataCriacao"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-foreground">Data de Criação *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-background/50 border-border/60",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", {
                                  locale: ptBR,
                                })
                              ) : (
                                <span>Selecione data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={ptBR}
                            disabled={(date) => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Data de Início da Vigência (obrigatória) */}
                <FormField
                  control={form.control}
                  name="dataInicioVigencia"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-foreground">Data de Início *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-background/50 border-border/60",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={ptBR}
                            disabled={(date) => date < new Date("1900-01-01")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Data de Término (opcional) */}
                <FormField
                  control={form.control}
                  name="dataTermino"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-foreground">Data de Término</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-background/50 border-border/60",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ?? new Date()}
                            onSelect={field.onChange}
                            locale={ptBR}
                            disabled={(date) => date < new Date("1900-01-01")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Categoria (obrigatória) */}
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Categoria *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Proteção de Dados, Segurança da Informação"
                        {...field}
                        className="bg-background/50 border-border/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Objetivo (obrigatório) */}
              <FormField
                control={form.control}
                name="objetivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Objetivo *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o objetivo principal desta política..."
                        className="min-h-[80px] bg-background/50 border-border/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Responsável (obrigatório) */}
                <FormField
                  control={form.control}
                  name="responsavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Responsável *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome do responsável"
                          {...field}
                          className="bg-background/50 border-border/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Versão (obrigatória) */}
                <FormField
                  control={form.control}
                  name="versao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Versão *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: 1.0, 2.1"
                          {...field}
                          className="bg-background/50 border-border/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Domínio de Dados (opcional) */}
              <FormField
                control={form.control}
                name="dominioDadosId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Domínio de Dados</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select
                          onValueChange={(value) => field.onChange(value || undefined)}
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/60 w-full">
                              <SelectValue placeholder="Selecione o domínio de dados" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {comunidades.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhum domínio encontrado
                              </div>
                            ) : (
                              comunidades.map((comunidade) => (
                                <SelectItem key={comunidade.id} value={comunidade.id}>
                                  {comunidade.nome}
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
                        onClick={() => setDominioDialogOpen(true)}
                        className="bg-background/50 border-border/60 hover:bg-accent/50 flex-shrink-0"
                        title="Criar novo domínio"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription className="text-xs text-muted-foreground">
                      Selecione o domínio de dados associado (opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Anexos URL (opcional) */}
              <FormField
                control={form.control}
                name="anexosUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">URL dos Anexos</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        type="url"
                        {...field}
                        className="bg-background/50 border-border/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Relacionamento (opcional) */}
              <FormField
                control={form.control}
                name="relacionamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Relacionamento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Relacionamento com outras políticas ou normas"
                        {...field}
                        className="bg-background/50 border-border/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Observações (opcional) */}
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observações adicionais..."
                        className="min-h-[80px] bg-background/50 border-border/60"
                        {...field}
                      />
                    </FormControl>
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
                  {isSubmitting ? "Salvando..." : politica ? "Salvar Alterações" : "Criar Política"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog para criar domínio inline */}
      <ComunidadeForm open={dominioDialogOpen} onOpenChange={setDominioDialogOpen} />
    </>
  );
}
