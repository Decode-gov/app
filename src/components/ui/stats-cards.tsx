"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCard {
  title: string
  value: number
  description: string
  icon: LucideIcon
  gradient: string
}

interface StatsCardsProps {
  cards: StatsCard[]
  animationDirection?: "left" | "right"
}

export function StatsCards({ cards, animationDirection = "left" }: StatsCardsProps) {
  const animationClass = animationDirection === "left" ? "animate-slide-in-left" : "animate-slide-in-right"

  return (
    <div className={`grid gap-4 md:grid-cols-3 ${animationClass}`}>
      {cards.map((card, index) => (
        <Card 
          key={card.title} 
          className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${card.gradient} shadow-md`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export type { StatsCard }
