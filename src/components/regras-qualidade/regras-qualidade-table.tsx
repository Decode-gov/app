"use client";

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
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
import type { RegraQualidadeResponse } from "@/types/api";

type Lookup = { id: string; nome: string };

interface RegrasQualidadeTableProps {
  data: RegraQualidadeResponse[];
  dimensoes: Lookup[];
  tabelas: Lookup[];
  colunas: Lookup[];
  papeis: Lookup[];
  isLoading: boolean;
  error: unknown;
  onEdit?: (regra: RegraQualidadeResponse) => void;
  onDelete?: (id: string) => void;
}

function BadgeOrDash({ item }: { item: Lookup | undefined; variant?: "secondary" | "outline" }) {
  return item ? (
    <Badge variant="secondary">{item.nome}</Badge>
  ) : (
    <span className="text-muted-foreground">-</span>
  );
}

const SKELETON_ROWS = 5;
const COLUMN_COUNT = 6;

export function RegrasQualidadeTable({
  data,
  dimensoes,
  tabelas,
  colunas,
  papeis,
  isLoading,
  error,
  onEdit,
  onDelete,
}: RegrasQualidadeTableProps) {
  const columns = useMemo<ColumnDef<RegraQualidadeResponse>[]>(
    () => [
      {
        accessorKey: "descricao",
        header: "Descrição",
        cell: ({ row }) => (
          <div className="truncate font-medium max-w-[300px]" title={row.original.descricao}>
            {row.original.descricao}
          </div>
        ),
      },
      {
        id: "dimensao",
        header: "Dimensão",
        cell: ({ row }) => {
          const r = row.original;
          const item = r.dimensao ?? dimensoes.find((d) => d.id === r.dimensaoId);
          return <BadgeOrDash item={item} />;
        },
      },
      {
        id: "tabela",
        header: "Tabela",
        cell: ({ row }) => {
          const r = row.original;
          const item = r.tabela ?? tabelas.find((t) => t.id === r.tabelaId);
          return item ? (
            <Badge variant="outline">{item.nome}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        id: "coluna",
        header: "Coluna",
        cell: ({ row }) => {
          const r = row.original;
          const item = r.coluna ?? colunas.find((c) => c.id === r.colunaId);
          return item ? (
            <Badge variant="outline">{item.nome}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        id: "responsavel",
        header: "Responsável",
        cell: ({ row }) => {
          const r = row.original;
          const item = r.responsavel ?? papeis.find((p) => p.id === r.responsavelId);
          return item ? (
            <Badge variant="outline">{item.nome}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        id: "acoes",
        header: () => <span className="w-[70px] inline-block">Ações</span>,
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
    [dimensoes, tabelas, colunas, papeis, onEdit, onDelete],
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
                <TableHead key={header.id}>
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
            Array.from({ length: SKELETON_ROWS }, (_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-[250px]" />
                </TableCell>
                {Array.from({ length: COLUMN_COUNT - 2 }, (_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-[100px]" />
                  </TableCell>
                ))}
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))
          ) : error ? (
            <TableRow>
              <TableCell colSpan={COLUMN_COUNT} className="text-center text-muted-foreground py-8">
                Erro ao carregar regras. Tente novamente.
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMN_COUNT} className="text-center text-muted-foreground py-8">
                Nenhuma regra encontrada
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
