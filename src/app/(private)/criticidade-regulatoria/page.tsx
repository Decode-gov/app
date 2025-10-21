"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { CriticidadeRegulatoriaForm } from "@/components/criticidade-regulatoria/criticidade-regulatoria-form";
import {
  useCriticidadesRegulatoria,
  useDeleteCriticidadeRegulatoria,
} from "@/hooks/api/use-criticidade-regulatoria";
import { CriticidadeRegulatoriaResponse } from "@/types/api";

const getGrauColor = (grau: string) => {
  switch (grau) {
    case "CRITICA":
      return "bg-red-100 text-red-800";
    case "ALTA":
      return "bg-orange-100 text-orange-800";
    case "MEDIA":
      return "bg-yellow-100 text-yellow-800";
    case "BAIXA":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getGrauLabel = (grau: string) => {
  switch (grau) {
    case "CRITICA":
      return "Crítica";
    case "ALTA":
      return "Alta";
    case "MEDIA":
      return "Média";
    case "BAIXA":
      return "Baixa";
    default:
      return grau;
  }
};

export default function CriticidadeRegulatoriPage() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCriticidade, setSelectedCriticidade] =
    useState<CriticidadeRegulatoriaResponse>();

  const { data, isLoading, isError } = useCriticidadesRegulatoria({});
  const deleteMutation = useDeleteCriticidadeRegulatoria();

  const criticidades = data?.data || [];

  const filteredCriticidades = criticidades.filter((criticidade) => {
    const searchLower = search.toLowerCase();
    const regulacaoText = criticidade.regulacao?.epigrafe || "";
    const regraText = criticidade.regraQualidade?.descricao || "";

    return (
      regulacaoText.toLowerCase().includes(searchLower) ||
      regraText.toLowerCase().includes(searchLower)
    );
  });

  // Calcular estatísticas por grau de criticidade
  const stats = {
    critica: criticidades.filter((c) => c.grauCriticidade === "CRITICA").length,
    alta: criticidades.filter((c) => c.grauCriticidade === "ALTA").length,
    media: criticidades.filter((c) => c.grauCriticidade === "MEDIA").length,
    baixa: criticidades.filter((c) => c.grauCriticidade === "BAIXA").length,
  };

  const handleEdit = (criticidade: CriticidadeRegulatoriaResponse) => {
    setSelectedCriticidade(criticidade);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir esta criticidade regulatória?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedCriticidade(undefined);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Criticidade Regulatória
          </h1>
          <p className="text-muted-foreground mt-2">
            Avalie e gerencie a criticidade regulatória dos ativos de dados
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-[300px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-destructive">
            Criticidade Regulatória
          </h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar criticidades regulatórias
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Criticidade Regulatória
        </h1>
        <p className="text-muted-foreground mt-2">
          Avalie e gerencie a criticidade regulatória dos ativos de dados no sistema DECODE-GOV
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="group hover:shadow-lg transition-all duration-300 border-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crítica</CardTitle>
            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors duration-300">
              <span className="text-xl">🔴</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critica}</div>
            <p className="text-xs text-muted-foreground">criticidades críticas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta</CardTitle>
            <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
              <span className="text-xl">🟠</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.alta}</div>
            <p className="text-xs text-muted-foreground">criticidades altas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-100 group-hover:bg-yellow-200 transition-colors duration-300">
              <span className="text-xl">🟡</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.media}</div>
            <p className="text-xs text-muted-foreground">criticidades médias</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Baixa</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
              <span className="text-xl">🟢</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.baixa}</div>
            <p className="text-xs text-muted-foreground">criticidades baixas</p>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Criticidades Regulatórias</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Lista de todas as avaliações de criticidade cadastradas
              </p>
            </div>
            <Button className="gap-2" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" />
              Nova Criticidade
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar por regulação ou regra de qualidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Regulação</TableHead>
                  <TableHead>Regra de Qualidade</TableHead>
                  <TableHead>Grau de Criticidade</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCriticidades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {search
                        ? "Nenhuma criticidade encontrada com os critérios de busca"
                        : "Nenhuma criticidade regulatória cadastrada"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCriticidades.map((criticidade) => (
                    <TableRow key={criticidade.id}>
                      <TableCell className="font-medium max-w-[250px]">
                        <div className="truncate" title={criticidade.regulacao?.epigrafe}>
                          {criticidade.regulacao?.epigrafe || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate" title={criticidade.regraQualidade?.descricao}>
                          {criticidade.regraQualidade?.descricao || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGrauColor(criticidade.grauCriticidade)}>
                          {getGrauLabel(criticidade.grauCriticidade)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(criticidade.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(criticidade)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(criticidade.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <CriticidadeRegulatoriaForm
        open={formOpen}
        onOpenChange={handleCloseForm}
        criticidade={selectedCriticidade}
      />
    </div>
  );
}
