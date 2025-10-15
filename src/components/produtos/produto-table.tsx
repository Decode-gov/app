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
import { Edit, Trash2, Package, FileText, Layers } from "lucide-react"
import { ProdutoDados } from "@/types"

interface ProdutoDadosTableProps {
  data: ProdutoDados[]
  isLoading?: boolean
  onEdit: (produto: ProdutoDados) => void
  onDelete: (produto: ProdutoDados) => void
}

export function ProdutoDadosTable({ data, isLoading, onEdit, onDelete }: ProdutoDadosTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Domínio</TableHead>
              <TableHead>Regulação</TableHead>
              <TableHead>Ativos</TableHead>
              <TableHead>Termos</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
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
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Domínio</TableHead>
              <TableHead>Regulação</TableHead>
              <TableHead>Ativos</TableHead>
              <TableHead>Termos</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Package className="h-12 w-12" />
                  <p>Nenhum produto de dados encontrado</p>
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
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Domínio</TableHead>
            <TableHead>Regulação</TableHead>
            <TableHead>Ativos</TableHead>
            <TableHead>Termos</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((produto) => (
            <TableRow key={produto.id}>
              <TableCell className="font-medium">{produto.nome}</TableCell>
              <TableCell className="max-w-[300px] truncate">{produto.descricao}</TableCell>
              <TableCell>
                {produto.dominioId ? (
                  <Badge variant="outline" className="text-xs">
                    {produto.dominioId}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                {produto.regulacaoId ? (
                  <Badge variant="secondary" className="text-xs">
                    {produto.regulacaoId}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {produto.ativos && produto.ativos.length > 0 ? (
                    <>
                      <Layers className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">{produto.ativos.length}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground text-sm">0</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {produto.termos && produto.termos.length > 0 ? (
                    <>
                      <FileText className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{produto.termos.length}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground text-sm">0</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(produto)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(produto)}
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