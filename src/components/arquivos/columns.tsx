"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Download, Trash2 } from "lucide-react";
import type { GetArquivos200 } from "@/api/generated/model";
import { Button } from "@/components/ui/button";

export type ArquivoItem = GetArquivos200["data"][number];

interface ColumnsProps {
  onDownload: (arquivo: ArquivoItem) => void;
  onDelete: (id: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const createColumns = ({ onDownload, onDelete }: ColumnsProps): ColumnDef<ArquivoItem>[] => [
  {
    accessorKey: "nomeOriginal",
    header: "Nome",
    cell: ({ row }) => (
      <span className="font-medium truncate max-w-[240px] block">
        {row.getValue("nomeOriginal")}
      </span>
    ),
  },
  {
    accessorKey: "tipoMime",
    header: "Tipo",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{row.getValue("tipoMime")}</span>
    ),
  },
  {
    accessorKey: "tamanhoBytes",
    header: "Tamanho",
    cell: ({ row }) => (
      <span className="text-sm">{formatBytes(row.getValue("tamanhoBytes"))}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Data de Upload",
    cell: ({ row }) => (
      <span className="text-sm">{formatDate(row.getValue("createdAt"))}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const arquivo = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDownload(arquivo)}
          >
            <Download className="h-4 w-4 mr-1" />
            Baixar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(arquivo.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      );
    },
  },
];
