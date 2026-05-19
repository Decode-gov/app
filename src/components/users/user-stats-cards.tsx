import { UserCheck, Users, UserX } from "lucide-react";
import { type StatsCard, StatsCards } from "@/components/ui/stats-cards";
import type { UsuarioStats } from "@/types/user";

interface UserStatsCardsProps {
  stats: UsuarioStats;
}

export function UserStatsCards({ stats }: UserStatsCardsProps) {
  const cards: StatsCard[] = [
    {
      title: "Total de Usuários",
      value: stats.total,
      description: "Usuários cadastrados",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Usuários Ativos",
      value: stats.ativos,
      description: `${((stats.ativos / stats.total) * 100).toFixed(0)}% do total`,
      icon: UserCheck,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Usuários Inativos",
      value: stats.inativos,
      description: `${((stats.inativos / stats.total) * 100).toFixed(0)}% do total`,
      icon: UserX,
      gradient: "from-red-500 to-rose-500",
    },
  ];

  return <StatsCards cards={cards} animationDirection="right" />;
}
