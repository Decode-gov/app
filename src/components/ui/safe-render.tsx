"use client"

import { ReactNode } from "react"
import { useHydration } from "@/providers/hydration-provider"

interface SafeRenderProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Componente para renderização segura que evita problemas de hidratação
 * Renderiza o fallback durante a hidratação inicial e o conteúdo após montar no cliente
 */
export function SafeRender({ children, fallback = null }: SafeRenderProps) {
  const { isHydrated } = useHydration()
  
  if (!isHydrated) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

interface SafeDateProps {
  date: string | Date | null | undefined
  format?: 'date' | 'datetime'
  className?: string
  fallback?: ReactNode
}

/**
 * Componente para renderização segura de datas
 */
export function SafeDate({ date, format = 'date', className = "", fallback = "--/--/----" }: SafeDateProps) {
  const { isHydrated } = useHydration()
  
  if (!date || !isHydrated) {
    return <span className={className}>{fallback}</span>
  }
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const formatted = format === 'datetime' 
      ? dateObj.toLocaleString('pt-BR')
      : dateObj.toLocaleDateString('pt-BR')
    
    return <span className={className}>{formatted}</span>
  } catch {
    return <span className={className}>{fallback}</span>
  }
}

interface SafeDateComparisonProps {
  date: string | Date | null | undefined
  compareDate?: Date
  children: (isOverdue: boolean, formattedDate: string) => ReactNode
}

/**
 * Componente para comparação segura de datas
 */
export function SafeDateComparison({ 
  date, 
  compareDate = new Date(), 
  children 
}: SafeDateComparisonProps) {
  const { isHydrated } = useHydration()
  
  if (!date || !isHydrated) {
    return <>{children(false, "--/--/----")}</>
  }
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const isOverdue = dateObj < compareDate
    const formatted = dateObj.toLocaleDateString('pt-BR')
    
    return <>{children(isOverdue, formatted)}</>
  } catch {
    return <>{children(false, "--/--/----")}</>
  }
}