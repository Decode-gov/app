"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SistemaResponse } from "@/types/api";

interface SistemaTableProps {
  data: SistemaResponse[];
  onEdit: (sistema: SistemaResponse) => void;
  onDelete: (id: string) => void;
}

export function SistemaTable({ data, onEdit, onDelete }: SistemaTableProps) {
  const columns: ColumnDef<SistemaResponse>[] = [
    {
      accessorKey: "nome",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("nome")}</div>,
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ row }) => {
        const descricao = row.original.descricao;
        return (
          <div className="max-w-[300px] truncate text-sm text-muted-foreground">
            {descricao || "-"}
          </div>
        );
      },
    },
    {
      id: "bancos",
      header: "Bancos",
      cell: ({ row }) => {
        const bancos = (row.original as typeof row.original & { bancos?: unknown[] }).bancos;
        if (!bancos || bancos.length === 0) {
          return <span className="text-sm text-muted-foreground">0</span>;
        }
        return <Badge variant="secondary">{bancos.length}</Badge>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const sistema = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(sistema)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(sistema.id)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="nome"
      searchPlaceholder="Buscar sistemas..."
    />
  );
}
