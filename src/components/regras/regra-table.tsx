"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Trash2, FileText, User, Building2, Shield } from "lucide-react"
import { RegraNegocio } from "@/types"

interface RegraTableProps {
  data: RegraNegocio[]
  isLoading?: boolean
  onEdit: (regra: RegraNegocio) => void
  onDelete: (regra: RegraNegocio) => void
}

export function RegraTable({ data, isLoading, onEdit, onDelete }: RegraTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Regra</TableHead>
              <TableHead>Termo</TableHead>
              <TableHead>Política</TableHead>
              <TableHead>Sistema</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Regra</TableHead>
              <TableHead>Termo</TableHead>
              <TableHead>Política</TableHead>
              <TableHead>Sistema</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <FileText className="h-12 w-12" />
                  <p>Nenhuma regra de negócio encontrada</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Regra</TableHead>
            <TableHead>Termo</TableHead>
            <TableHead>Política</TableHead>
            <TableHead>Sistema</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((regra) => (
            <TableRow key={regra.id}>
              <TableCell className="font-medium max-w-[300px]">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="break-words">{regra.regra}</span>
                </div>
              </TableCell>
              <TableCell>
                {regra.termoId ? (
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {regra.termoId}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                {regra.politicaId ? (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {regra.politicaId}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                {regra.sistemaId ? (
                  <Badge variant="outline" className="text-xs">
                    {regra.sistemaId}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                {regra.responsavelId ? (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-purple-500" />
                    <span>{regra.responsavelId}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(regra)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(regra)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}