"use client"

import { cn } from "@/lib/utils"

interface DecodeGovIconProps {
  className?: string
  size?: number
}

export function DecodeGovIcon({ className, size = 32 }: DecodeGovIconProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Base hexagonal (representando estrutura/governança) */}
        <path
          d="M16 2L26 8V24L16 30L6 24V8L16 2Z"
          fill="rgba(59, 130, 246, 0.2)"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
        />
        
        {/* Camadas de dados (três círculos concêntricos) */}
        <circle
          cx="16"
          cy="16"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
          opacity="0.8"
        />
        <circle
          cx="16"
          cy="16"
          r="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
          opacity="0.6"
        />
        <circle
          cx="16"
          cy="16"
          r="4"
          fill="currentColor"
          className="text-primary"
          opacity="0.4"
        />
        
        {/* Pontos de dados conectados */}
        <circle cx="16" cy="9" r="1.5" fill="currentColor" className="text-secondary" />
        <circle cx="23" cy="16" r="1.5" fill="currentColor" className="text-secondary" />
        <circle cx="16" cy="23" r="1.5" fill="currentColor" className="text-secondary" />
        <circle cx="9" cy="16" r="1.5" fill="currentColor" className="text-secondary" />
        
        {/* Linhas conectoras (representando fluxo de dados) */}
        <line
          x1="16"
          y1="11"
          x2="16"
          y2="15"
          stroke="currentColor"
          strokeWidth="1"
          className="text-secondary"
          opacity="0.7"
        />
        <line
          x1="21"
          y1="16"
          x2="17"
          y2="16"
          stroke="currentColor"
          strokeWidth="1"
          className="text-secondary"
          opacity="0.7"
        />
        <line
          x1="16"
          y1="21"
          x2="16"
          y2="17"
          stroke="currentColor"
          strokeWidth="1"
          className="text-secondary"
          opacity="0.7"
        />
        <line
          x1="11"
          y1="16"
          x2="15"
          y2="16"
          stroke="currentColor"
          strokeWidth="1"
          className="text-secondary"
          opacity="0.7"
        />
        
        {/* Centro - representando governança central */}
        <circle
          cx="16"
          cy="16"
          r="2"
          fill="currentColor"
          className="text-primary"
        />
      </svg>
      
      {/* Efeito de brilho/pulso */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse blur-sm" />
    </div>
  )
}
