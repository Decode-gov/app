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
import { Badge } from "@/components/ui/badge"
import { Classificacao } from "@/types/classificacao"

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classificacao: Classificacao | null
  onConfirm: () => void
  isDeleting?: boolean
}

// Mock data para mapear IDs para nomes
const mockPoliticas: Record<string, string> = {
  "1": "Política de Segurança da Informação",
  "2": "Política de Privacidade de Dados", 
  "3": "Política de Retenção de Documentos",
  "4": "Política de Classificação de Informações",
}

const mockTermos: Record<string, string> = {
  "1": "Dados Pessoais",
  "2": "Dados Sensíveis",
  "3": "Informação Confidencial",
  "4": "Documento Público",
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  classificacao,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  if (!classificacao) return null

  const politicaNome = mockPoliticas[classificacao.politicaId] || "Política não encontrada"
  const termoNome = classificacao.termoId ? mockTermos[classificacao.termoId] || "Termo não encontrado" : "Nenhum termo"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background/95 backdrop-blur-sm border-border/60">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Tem certeza que deseja excluir esta classificação? Esta ação não pode ser desfeita.
              </p>
              
              <div className="rounded-lg border border-border/60 p-4 bg-card/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Nome:</span>
                  <span className="text-foreground">{classificacao.nome}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Descrição:</span>
                  <span className="text-foreground text-sm">
                    {classificacao.descricao || "Sem descrição"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Política:</span>
                  <Badge variant="secondary" className="whitespace-nowrap">
                    {politicaNome}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Termo:</span>
                  <Badge variant="outline" className="whitespace-nowrap">
                    {termoNome}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Criado em:</span>
                  <span className="text-sm text-muted-foreground">
                    {classificacao.criadoEm.toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Atenção: Todas as informações associadas a esta classificação serão removidas permanentemente.
                </p>
              </div>
            </div>
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
            {isDeleting ? "Excluindo..." : "Excluir Classificação"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
