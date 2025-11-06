"use client"

import { NecessidadeInformacaoResponse } from "@/types/api"
import { DataTable } from "./data-table"
import { createColumns } from "./necessidades-columns"

interface NecessidadesTableProps {
  data: NecessidadeInformacaoResponse[]
  onEdit: (necessidade: NecessidadeInformacaoResponse) => void
  onDelete: (id: string) => void
}

export function NecessidadesTable({ 
  data, 
  onEdit, 
  onDelete 
}: NecessidadesTableProps) {
  const columns = createColumns(onEdit, onDelete)

  return (
    <DataTable 
      columns={columns} 
      data={data}
      searchKey="questaoGerencial"
      searchPlaceholder="Buscar necessidades..."
    />
  )
}
