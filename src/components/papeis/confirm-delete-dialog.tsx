"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { type Papel } from "@/types/papel"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  papel: Papel | null
  onConfirm: () => void
  isDeleting?: boolean
}

// Mock data das políticas para display
const mockPoliticasMap = {
  "550e8400-e29b-41d4-a716-446655440001": "Política de Segurança da Informação",
  "550e8400-e29b-41d4-a716-446655440002": "Política de Privacidade de Dados",
  "550e8400-e29b-41d4-a716-446655440003": "Política de Retenção de Documentos",
  "550e8400-e29b-41d4-a716-446655440004": "Política de Classificação de Informações",
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  papel,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  if (!papel) return null

  const getPoliticaNome = (politicaId: string): string => {
    return mockPoliticasMap[politicaId as keyof typeof mockPoliticasMap] || `Política ${politicaId.slice(0, 8)}...`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-sm border-border/60">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-foreground">
                Confirmar Exclusão
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Você está prestes a excluir o seguinte papel:
          </p>

          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-semibold text-foreground">
                  {papel.nome}
                </h4>
                <p className="text-xs text-muted-foreground">
                  ID: {papel.id}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-xs text-muted-foreground">Descrição:</span>
                <p className="text-sm text-foreground mt-1">
                  {papel.descricao}
                </p>
              </div>

              <div>
                <span className="text-xs text-muted-foreground">Política:</span>
                <div className="mt-1">
                  <Badge variant="outline" className="text-xs">
                    {getPoliticaNome(papel.politicaId)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/60">
                <div>
                  <span className="text-xs text-muted-foreground">Criado em:</span>
                  <p className="text-sm text-foreground">
                    {format(papel.criadoEm, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Atualizado em:</span>
                  <p className="text-sm text-foreground">
                    {format(papel.atualizadoEm, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
            <p className="text-sm text-destructive font-medium">
              ⚠️ Atenção: Esta ação é permanente
            </p>
            <p className="text-xs text-destructive/80 mt-1">
              O papel será removido definitivamente do sistema e não poderá ser recuperado.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="bg-background/50 border-border/60 hover:bg-accent/50"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}