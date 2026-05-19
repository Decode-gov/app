"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useDeleteUsuariosId,
  useGetUsuarios,
  usePostUsuariosRegister,
  usePutUsuariosId,
} from "@/api/generated/endpoints/usuários/usuários";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDeleteDialog } from "@/components/users/confirm-delete-dialog";
import { UserFilters } from "@/components/users/user-filters";
import { UserForm } from "@/components/users/user-form";
import { UserStatsCards } from "@/components/users/user-stats-cards";
import { UserTable } from "@/components/users/user-table";
import type { UsuarioFormData } from "@/schemas";
import type { GetUsuarios200DataItem, Usuario } from "@/types/api";

export default function UsuariosPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<GetUsuarios200DataItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<GetUsuarios200DataItem | null>(null);

  // Hooks da API
  const { data: usuariosData, isFetching, error } = useGetUsuarios();
  const createMutation = usePostUsuariosRegister();
  const updateMutation = usePutUsuariosId();
  const deleteMutation = useDeleteUsuariosId();

  const usuarios = useMemo(() => usuariosData?.data ?? [], [usuariosData]);

  // Estatísticas dos usuários
  const stats = useMemo(() => {
    const total = usuarios.length;
    const ativos = usuarios.filter((usuario) => usuario.ativo).length;
    const inativos = usuarios.filter((u) => !u.ativo).length;
    return { total, ativos, inativos };
  }, [usuarios]);

  const handleNewUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: Usuario) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (user: Usuario) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteMutation.mutateAsync({ id: userToDelete.id });
        setUserToDelete(null);
        queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        toast.success("Usuário excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        toast.error("Erro ao excluir usuário");
      }
    }
  };

  const handleSubmitUser = async (data: UsuarioFormData) => {
    try {
      if (editingUser) {
        // Editar usuário existente
        await updateMutation.mutateAsync({
          id: editingUser.id,
          data: {
            nome: data.nome,
            email: data.email,
            ativo: data.ativo,
          },
        });
        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Criar novo usuário
        await createMutation.mutateAsync({
          data: {
            nome: data.nome,
            email: data.email,
            senha: data.senha ?? "mudar123",
            tipo: "USUARIO",
            empresaId: "",
          },
        });
        toast.success("Usuário criado com sucesso!");
      }
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast.error("Erro ao salvar usuário");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Usuários</h1>
        <p className="text-muted-foreground">Gerencie os usuários do sistema DECODE-GOV</p>
      </div>

      <UserStatsCards stats={stats} />

      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardContent className="space-y-4">
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onNewUser={handleNewUser}
          />

          {isFetching ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }, (_, i) => i).map((key) => (
                <div key={key} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Erro ao carregar usuários: {error.message}</p>
            </div>
          ) : (
            <UserTable
              data={usuarios}
              searchTerm={searchTerm}
              selectedStatus={selectedStatus}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          )}
        </CardContent>
      </Card>

      <UserForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        user={editingUser ? editingUser : undefined}
        onSubmit={handleSubmitUser}
      />

      <ConfirmDeleteDialog
        open={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        user={userToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
