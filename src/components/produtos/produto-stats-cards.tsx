"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Layers, FileText, ShieldCheck } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ProdutoDadosStatsCardsProps {
  stats: {
    total: number
    comTermos: number
    comRegulacao: number
    comAtivos: number
  }
  isLoading?: boolean
}

export function ProdutoDadosStatsCards({ stats, isLoading }: ProdutoDadosStatsCardsProps) {
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
      title: "Total de Produtos",
      value: stats.total,
      description: "produtos de dados cadastrados",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Com Termos",
      value: stats.comTermos,
      description: "produtos com termos associados",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      title: "Com Regulação",
      value: stats.comRegulacao,
      description: "produtos com regulação definida",
      icon: ShieldCheck,
      color: "bg-orange-500",
    },
    {
      title: "Com Ativos",
      value: stats.comAtivos,
      description: "produtos com ativos tecnológicos",
      icon: Layers,
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