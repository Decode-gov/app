"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type Politica } from "@/types/politica"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  politica: Politica | null
  onConfirm: () => Promise<void>
  isDeleting: boolean
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  politica,
  onConfirm,
  isDeleting,
}: ConfirmDeleteDialogProps) {
  if (!politica) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background/95 backdrop-blur-sm border-border/60">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground space-y-2">
            <span>
              Tem certeza de que deseja excluir a política <strong>&quot;{politica.nome}&quot;</strong>?
            </span>
            <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-2 text-sm">
              <div><strong>ID:</strong> <span>{politica.id}</span></div>
              <div><strong>Categoria:</strong> <span>{politica.categoria}</span></div>
              <div><strong>Status:</strong> <span>{
                politica.status === "Vigente" ? "Vigente" :
                politica.status === "Em_elaboracao" ? "Em Elaboração" :
                politica.status === "Revogada" ? "Revogada" : politica.status
              }</span></div>
              <div><strong>Responsável:</strong> <span>{politica.responsavel}</span></div>
              <div><strong>Versão:</strong> <span>{politica.versao}</span></div>
              <div><strong>Criada em:</strong> <span>{format(politica.dataCriacao, "dd/MM/yyyy", { locale: ptBR })}</span></div>
            </div>
            <span className="mt-4 font-semibold text-destructive">
              Esta ação não pode ser desfeita.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting}
            className="bg-background/50 border-border/60 hover:bg-accent/50"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isDeleting ? "Excluindo..." : "Excluir Política"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}