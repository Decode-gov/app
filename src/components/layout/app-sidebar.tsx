"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Users, BarChart3, Database,
  Shield,
  BookOpen, Building, FileCheck, Home,
  Workflow,
  Tag,
  UserCheck,
  HelpCircle,
  Table, FileSpreadsheet,
  Server,
  FileText,
  Activity,
  CheckCircle
} from "lucide-react"
import { DecodeGovIcon } from "@/components/ui/decode-gov-icon"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
  },
  {
    title: "Gestão de Usuários",
    icon: Users,
    url: "/usuarios",
  },
  {
    title: "Necessidades de Negócio",
    items: [
      { title: "Necessidades de Informação", icon: HelpCircle, url: "/necessidades-informacao" },
    ],
  },
  {
    title: "Definições e Termos",
    items: [
      { title: "Termos de Negócio", icon: BookOpen, url: "/termos-negocio" },
      { title: "Referencial de Classificação", icon: Tag, url: "/referencial-classificacao" },
      { title: "Classificação das Informações", icon: Tag, url: "/classificacoes-informacao" },
      { title: "Listas de Referência", icon: FileSpreadsheet, url: "/listas-referencia" },
    ],
  },
  {
    title: "Governança",
    items: [
      { title: "Políticas Internas", icon: Shield, url: "/politicas-internas" },
      { title: "Papéis de Governança", icon: UserCheck, url: "/papeis" },
      { title: "Domínios/Comunidades", icon: Building, url: "/dominios" },
      { title: "Atribuições Papel↔Domínio", icon: Workflow, url: "/atribuicoes-papel-dominio" },
    ],
  },
  {
    title: "Regras e Qualidade",
    items: [
      { title: "Regras de Negócio", icon: FileCheck, url: "/regras-negocio" },
      { title: "Dimensões de Qualidade", icon: BarChart3, url: "/dimensoes-qualidade" },
      { title: "Regras de Qualidade", icon: CheckCircle, url: "/regras-qualidade" },
      { title: "Métricas de Qualidade", icon: Activity, url: "/metricas-qualidade" },
    ],
  },
  {
    title: "Ativos Tecnológicos",
    items: [
      { title: "Ativos Tecnológicos", icon: Server, url: "/ativos-tecnologicos" },
      { title: "Tabelas e Colunas", icon: Table, url: "/tabelas-colunas" },
    ],
  },
  {
    title: "Regulação e Conformidade",
    items: [
      { title: "Regulação", icon: FileText, url: "/regulacao" },
      { title: "Criticidade Regulatória", icon: Activity, url: "/criticidade-regulatoria" },
    ],
  },
  {
    title: "Análise e Métricas",
    items: [
      { title: "KPIs", icon: BarChart3, url: "/kpis" },
      { title: "Produtos de Dados", icon: Database, url: "/produtos-dados" },
    ],
  },
  {
    title: "Gestão Documental",
    items: [
      { title: "Documentos", icon: FileText, url: "/documentos" },
      { title: "Partes Envolvidas", icon: Users, url: "/partes-envolvidas" },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" className="border-r border-sidebar-border/60">
      <SidebarHeader className="border-b border-sidebar-border/60 bg-sidebar/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <DecodeGovIcon size={32} className="text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DECODE-GOV
            </span>
            <span className="text-xs text-muted-foreground">Governança de Dados</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar/30 backdrop-blur-sm">
        {menuItems.map((item, index) => (
          <SidebarGroup key={index} className="px-2">
            {item.title && !item.items && (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    className={`group transition-all duration-200 hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground ${
                      pathname === item.url ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' : ''
                    }`}
                  >
                    <Link href={item.url!}>
                      {item.icon && <item.icon className="group-hover:scale-110 transition-transform duration-200" />}
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
            {item.items && (
              <>
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 px-2 py-1 uppercase tracking-wide">
                  {item.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`group transition-all duration-200 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground ml-2 ${
                            pathname === subItem.url ? 'bg-sidebar-primary/80 text-sidebar-primary-foreground shadow-sm border-l-2 border-primary' : ''
                          }`}
                        >
                          <Link href={subItem.url}>
                            <subItem.icon className="group-hover:scale-110 transition-transform duration-200" />
                            <span className="group-hover:translate-x-1 transition-transform duration-200">{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/60 bg-sidebar/50 backdrop-blur-sm">
        <div className="px-4 py-3">
          <div className="text-xs text-muted-foreground/80">
            Sistema de Governança de Dados
          </div>
          <div className="text-xs text-muted-foreground/60 flex items-center gap-1 mt-1">
            <span>v1.0</span>
            <span className="text-primary">•</span>
            <span>2024</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
