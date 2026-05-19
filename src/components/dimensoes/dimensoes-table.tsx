"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DimensaoQualidadeResponse, GetPoliticasInternas200DataItem } from "@/types/api";

interface DimensoesTableProps {
  data: DimensaoQualidadeResponse[];
  politicas: GetPoliticasInternas200DataItem[];
  isLoading: boolean;
  error: unknown;
  onEdit?: (dimensao: DimensaoQualidadeResponse) => void;
  onDelete?: (id: string) => void;
}

export function DimensoesTable({ data, politicas, isLoading, error, onEdit, onDelete }: DimensoesTableProps) {
  const columns = useMemo<ColumnDef<DimensaoQualidadeResponse>[]>(
    () => [
      {
        accessorKey: "nome",
        header: "Nome",
        cell: ({ row }) => (
          <div className="font-medium max-w-[300px] truncate" title={row.original.nome}>
            {row.original.nome}
          </div>
        ),
      },
      {
        accessorKey: "descricao",
        header: "Descrição",
        cell: ({ row }) => (
          <div className="max-w-[400px] truncate" title={row.original.descricao ?? ""}>
            {row.original.descricao}
          </div>
        ),
      },
      {
        accessorKey: "politicaId",
        header: "Política",
        cell: ({ row }) => {
          const politica = politicas.find((p) => p.id === row.original.politicaId);
          return politica ? (
            <Badge variant="secondary">{politica.nome}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Data de Criação",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString("pt-BR") : "-"}
          </span>
        ),
      },
      {
        id: "acoes",
        header: () => <span className="sr-only">Ações</span>,

        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {
                onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(row.original)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                )
              }
              {
                onDelete && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(row.original.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                )
              }
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [politicas, onEdit, onDelete],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={header.column.id === "acoes" ? "w-[70px]" : undefined}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }, (_, i) => i).map((key) => (
              <TableRow key={key}>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[300px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))
          ) : error ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
                Erro ao carregar dimensões. Tente novamente.
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
                Nenhuma dimensão encontrada
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
