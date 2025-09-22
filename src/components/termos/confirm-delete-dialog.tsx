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
import { type Termo } from "@/types/termo"

interface ConfirmDeleteDialogProps {
  open: boolean
  onClose: () => void
  termo: Termo | null
  onConfirm: () => void
}

export function ConfirmDeleteDialog({ open, onClose, termo, onConfirm }: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-background/95 backdrop-blur-md border-border/50">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja excluir o termo{" "}
            <span className="font-semibold text-foreground">{termo?.nome}</span>?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-background/50 backdrop-blur-sm border-border/60 hover:bg-accent/50">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
