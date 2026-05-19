"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import type { GetRegulacoesCompletas200Output } from "@/api/generated/model/getRegulacoesCompletas200.zod";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Regulacao = GetRegulacoesCompletas200Output["data"][number];

interface RegulacoesTableProps {
  data: Regulacao[];
  onEdit: (regulacao: Regulacao) => void;
  onDelete: (id: string) => void;
}

function buildColumns(
  onEdit: RegulacoesTableProps["onEdit"],
  onDelete: RegulacoesTableProps["onDelete"],
): ColumnDef<Regulacao>[] {
  return [
    {
      accessorKey: "epigrafe",
      header: "Epígrafe",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.epigrafe}</span>
      ),
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate" title={row.original.descricao}>
          {row.original.descricao}
        </div>
      ),
    },
    {
      accessorKey: "orgao",
      header: "Órgão Regulador",
      cell: ({ row }) => row.original.orgao || "-",
    },
    {
      accessorKey: "dataInicio",
      header: "Início da Vigência",
      cell: ({ row }) =>
        new Date(row.original.dataInicio).toLocaleDateString("pt-BR"),
    },
    {
      accessorKey: "dataFim",
      header: "Fim da Vigência",
      cell: ({ row }) =>
        row.original.dataFim
          ? new Date(row.original.dataFim).toLocaleDateString("pt-BR")
          : "-",
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString("pt-BR")
          : "-",
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Ações</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

export function RegulacoesTable({ data, onEdit, onDelete }: RegulacoesTableProps) {
  const columns = buildColumns(onEdit, onDelete);

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="epigrafe"
      searchPlaceholder="Buscar regulações..."
    />
  );
}
