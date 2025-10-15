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
import { RegraNegocio } from "@/types"

interface ConfirmDeleteDialogProps {
  regra: RegraNegocio | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading?: boolean
}

export function ConfirmDeleteDialog({
  regra,
  open,
  onOpenChange,
  onConfirm,
  isLoading
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta regra de negócio?
            <br />
            <strong className="text-foreground">&ldquo;{regra?.regra?.slice(0, 100)}...&rdquo;</strong>
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}