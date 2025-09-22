"use client"

import { TermoForm } from "@/components/termos/termo-form"
import { type TermoFormData, type Termo } from "@/types/termo"

interface TermoCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTermoCreated: (termo: Termo) => void
}

export function TermoCreateDialog({
  open,
  onOpenChange,
  onTermoCreated,
}: TermoCreateDialogProps) {

  const handleSubmit = async (data: TermoFormData) => {
    // Simular criação do termo (substituir por chamada real da API)
    const novoTermo: Termo = {
      id: crypto.randomUUID(),
      ...data,
    }
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    onTermoCreated(novoTermo)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <TermoForm
      open={open}
      onClose={handleClose}
      termo={null}
      onSubmit={handleSubmit}
    />
  )
}
