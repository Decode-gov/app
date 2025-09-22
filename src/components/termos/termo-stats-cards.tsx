"use client"

import { BookOpen, CheckCircle, XCircle } from "lucide-react"
import { type TermoStats } from "@/types/termo"
import { StatsCards, type StatsCard } from "@/components/ui/stats-cards"

interface TermoStatsCardsProps {
  stats: TermoStats
}

export function TermoStatsCards({ stats }: TermoStatsCardsProps) {
  const cards: StatsCard[] = [
    {
      title: "Total de Termos",
      value: stats.total,
      description: "Termos cadastrados",
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Termos Ativos", 
      value: stats.ativos,
      description: "Termos em uso",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Termos Inativos",
      value: stats.inativos, 
      description: "Termos arquivados",
      icon: XCircle,
      gradient: "from-red-500 to-rose-500",
    },
  ]

  return <StatsCards cards={cards} animationDirection="left" />
}
