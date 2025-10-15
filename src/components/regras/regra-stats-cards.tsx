"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Shield, Building } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface RegraStatsCardsProps {
  stats: {
    total: number
    porTermo: number
    porPolitica: number
    comResponsavel: number
  }
  isLoading?: boolean
}

export function RegraStatsCards({ stats, isLoading }: RegraStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-1" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Total de Regras",
      value: stats.total,
      description: "regras de negócio cadastradas",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Por Termo",
      value: stats.porTermo,
      description: "regras associadas a termos",
      icon: Building,
      color: "bg-green-500",
    },
    {
      title: "Por Política",
      value: stats.porPolitica,
      description: "regras vinculadas a políticas",
      icon: Shield,
      color: "bg-orange-500",
    },
    {
      title: "Com Responsável",
      value: stats.comResponsavel,
      description: "regras com responsável definido",
      icon: Users,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-md ${card.color}`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}