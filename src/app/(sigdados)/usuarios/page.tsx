"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserStatsCards } from "@/components/users/user-stats-cards"
import { UserFilters } from "@/components/users/user-filters"
import { UserForm } from "@/components/users/user-form"
import { ConfirmDeleteDialog } from "@/components/users/confirm-delete-dialog"
import { type Usuario, type UsuarioFormData } from "@/types/user"
import { UserTable } from "@/components/users/user-table"

// Dados de exemplo para simular a API
const mockUsuarios: Usuario[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@empresa.com",
    status: "ativo",
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria.santos@empresa.com",
    status: "ativo",
  },
  {
    id: "3",
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@empresa.com",
    status: "inativo",
  },
  {
    id: "4",
    nome: "Ana Costa",
    email: "ana.costa@empresa.com",
    status: "ativo",
  },
  {
    id: "5",
    nome: "Carlos Ferreira",
    email: "carlos.ferreira@empresa.com",
    status: "inativo",
  },
]

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null)

  // Estatísticas dos usuários
  const stats = useMemo(() => {
    const total = usuarios.length
    const ativos = usuarios.filter(u => u.status === "ativo").length
    const inativos = usuarios.filter(u => u.status === "inativo").length
    return { total, ativos, inativos }
  }, [usuarios])

  const handleNewUser = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const handleEditUser = (user: Usuario) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleDeleteUser = (user: Usuario) => {
    setUserToDelete(user)
  }

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsuarios(prev => prev.filter(u => u.id !== userToDelete.id))
      setUserToDelete(null)
    }
  }

  const handleSubmitUser = async (data: UsuarioFormData) => {
    try {
      if (editingUser) {
        // Editar usuário existente
        setUsuarios(prev => prev.map(u => 
          u.id === editingUser.id 
            ? { ...u, ...data } 
            : u
        ))
      } else {
        // Criar novo usuário
        const newUser: Usuario = {
          id: Date.now().toString(),
          ...data,
        }
        setUsuarios(prev => [...prev, newUser])
      }
      setIsFormOpen(false)
      setEditingUser(null)
    } catch (error) {
      console.error("Erro ao salvar usuário:", error)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Usuários
        </h1>
        <p className="text-muted-foreground">
          Gerencie os usuários do sistema DECODE-GOV
        </p>
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

          <UserTable
            data={usuarios}
            searchTerm={searchTerm}
            selectedStatus={selectedStatus}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </CardContent>
      </Card>

      <UserForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        user={editingUser}
        onSubmit={handleSubmitUser}
      />

      <ConfirmDeleteDialog
        open={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        user={userToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
