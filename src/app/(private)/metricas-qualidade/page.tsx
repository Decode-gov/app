"use client";

import { Activity, BarChart3, Search } from "lucide-react";
import { useState } from "react";
import { useGetDimensoesQualidade } from "@/api/generated/endpoints/dimensões-de-qualidade/dimensões-de-qualidade";
import { useGetPoliticasInternas } from "@/api/generated/endpoints/políticas-internas/políticas-internas";
import { useGetRegrasQualidade } from "@/api/generated/endpoints/regras-de-qualidade/regras-de-qualidade";
import { DimensoesTable } from "@/components/dimensoes/dimensoes-table";
import { RegrasQualidadeTable } from "@/components/regras-qualidade/regras-qualidade-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTabelas } from "@/api/generated/endpoints/tabelas/tabelas";
import { useGetColunas } from "@/api/generated/endpoints/colunas/colunas";
import { useGetPapeis } from "@/api/generated/endpoints/papéis/papéis";
import { useEmpresaIdParam } from "@/hooks/use-empresa-id-param";

export default function MetricasQualidadePage() {
  const empresaParams = useEmpresaIdParam();
  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(1);
  const [limit] = useState(10);

  void page;
  void limit;
  void searchTerm;

  const {
    data: dimensoesData,
    isLoading: isLoadingDimensoes,
    error: errorDimensoes,
  } = useGetDimensoesQualidade(empresaParams);
  const {
    data: regrasData,
    isLoading: isLoadingRegras,
    error: errorRegras,
  } = useGetRegrasQualidade(empresaParams);

  const { data: politicasData } = useGetPoliticasInternas(empresaParams);
  const { data: tabelasData } = useGetTabelas();
  const { data: colunasData } = useGetColunas(empresaParams);
  const { data: papeisData } = useGetPapeis(empresaParams);

  const politicas = politicasData?.data ?? [];
  const dimensoes = dimensoesData?.data ?? [];
  const tabelas = tabelasData?.data ?? [];
  const colunas = colunasData?.data ?? [];
  const papeis = papeisData?.data ?? [];
  const regras = regrasData?.data ?? [];
  
  const isLoading = isLoadingDimensoes || isLoadingRegras;
  const error = errorDimensoes || errorRegras;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Métricas de Qualidade
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitore indicadores e métricas da qualidade dos dados
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }, (_, i) => i).map((key) => (
            <Card key={key} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[140px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-10 w-[300px]" />
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => i).map((key) => (
                <Skeleton key={key} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-destructive">
            Métricas de Qualidade
          </h1>
          <p className="text-muted-foreground mt-2">Erro ao carregar métricas de qualidade</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Métricas de Qualidade
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitore indicadores e métricas da qualidade dos dados no sistema DECODE-GOV
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Dimensões</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <BarChart3 className="h-4 w-4 text-blue-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dimensoes.length}</div>
            <p className="text-xs text-muted-foreground">dimensões cadastradas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Regras</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
              <Activity className="h-4 w-4 text-green-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{regras.length}</div>
            <p className="text-xs text-muted-foreground">regras de qualidade</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Dimensões */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <CardTitle>Dimensões de Qualidade</CardTitle>
          <CardDescription>Lista de todas as dimensões de qualidade cadastradas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar dimensões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <DimensoesTable
            data={dimensoes}
            politicas={politicas}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>

      {/* Tabela de Regras */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <CardTitle>Regras de Qualidade</CardTitle>
          <CardDescription>Lista de todas as regras de qualidade cadastradas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RegrasQualidadeTable
            data={regras}
            dimensoes={dimensoes}
            tabelas={tabelas}
            colunas={colunas}
            papeis={papeis}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}
