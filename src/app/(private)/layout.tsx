import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"

export default function DecodeGovLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors duration-200" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-border/60" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/" className="hover:text-primary transition-colors duration-200">
                    DECODE-GOV
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-muted-foreground/60" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground/80">Dados, ética, controle, democratização em Governança de dados.</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 space-y-4 p-8 pt-6">
          {children}
        </div>
      </main>
      <Toaster />
    </SidebarProvider>
  )
}
