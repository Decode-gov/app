"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { type CreateUsuarioFormData, CreateUsuarioSchema } from "@/schemas";
import type { GetUsuarios200DataItem } from "@/types/api";
import { Switch } from "../ui/switch";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  user?: GetUsuarios200DataItem | null;
  onSubmit: (data: CreateUsuarioFormData) => Promise<void>;
}

export function UserForm({ open, onClose, user, onSubmit }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!user;

  const form = useForm<CreateUsuarioFormData>({
    resolver: zodResolver(CreateUsuarioSchema),
    values: {
      nome: user?.nome || "",
      email: user?.email || "",
      senha: "",
    },
  });

  const handleSubmit = async (data: CreateUsuarioFormData) => {
    try {
      setIsLoading(true);
      // Validação adicional para senha no modo de criação
      if (!isEditing && (!data.senha || data.senha.length < 6)) {
        form.setError("senha", { message: "Senha deve ter pelo menos 6 caracteres" });
        return;
      }
      await onSubmit(data);
      // onClose será chamado pelo componente pai após sucesso
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-md border-border/50">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? "Atualize as informações do usuário."
              : "Preencha as informações para criar um novo usuário."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome completo"
                      className="bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite o email"
                      className="bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Digite a senha"
                        className="bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {user && (
              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Status do usuário</FormLabel>
                      <FormDescription>
                        Alterar o status do usuário ativando ou desativando!
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="bg-background/50 backdrop-blur-sm border-border/60 hover:bg-accent/50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
