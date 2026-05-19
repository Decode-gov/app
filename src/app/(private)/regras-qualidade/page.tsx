"use client";

import { Plus, Search, Target } from "lucide-react";
import { useState } from "react";
import { useGetColunas } from "@/api/generated/endpoints/colunas/colunas";
import { useGetDimensoesQualidade } from "@/api/generated/endpoints/dimensões-de-qualidade/dimensões-de-qualidade";
import { useGetPapeis } from "@/api/generated/endpoints/papéis/papéis";
import {
  useDeleteRegrasQualidadeId,
  useGetRegrasQualidade,
} from "@/api/generated/endpoints/regras-de-qualidade/regras-de-qualidade";
import { useGetTabelas } from "@/api/generated/endpoints/tabelas/tabelas";
import { useEmpresaIdParam } from "@/hooks/use-empresa-id-param";
import { RegraQualidadeForm } from "@/components/regras-qualidade/regra-qualidade-form";
import { RegrasQualidadeTable } from "@/components/regras-qualidade/regras-qualidade-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RegraQualidadeResponse } from "@/types/api";

export default function RegrasQualidadePage() {
  const empresaParams = useEmpresaIdParam();
  const [searchTerm, setSearchTerm] = useState("");
  const [dimensaoFilter, setDimensaoFilter] = useState<string>("");
  const [page] = useState(1);
  const [limit] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRegra, setSelectedRegra] = useState<RegraQualidadeResponse | undefined>();

  void page;
  void limit;
  void searchTerm;
  void dimensaoFilter;

  const { data: regrasData, isLoading, error } = useGetRegrasQualidade(empresaParams);
  const { data: dimensoesData } = useGetDimensoesQualidade(empresaParams);
  const { data: tabelasData } = useGetTabelas();
  const { data: colunasData } = useGetColunas(empresaParams);
  const { data: papeisData } = useGetPapeis(empresaParams);

  const deleteRegra = useDeleteRegrasQualidadeId();

  const regras = regrasData?.data ?? [];
  const dimensoes = dimensoesData?.data ?? [];
  const tabelas = tabelasData?.data ?? [];
  const colunas = colunasData?.data ?? [];
  const papeis = papeisData?.data ?? [];

  const handleEdit = (regra: RegraQualidadeResponse) => {
    setSelectedRegra(regra);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setSelectedRegra(undefined);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta regra de qualidade?")) {
      await deleteRegra.mutateAsync({ id });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Regras de Qualidade
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as regras de qualidade de dados do sistema DECODE-GOV
          </p>
        </div>

        <div className="grid gap-4">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <Target className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{regras.length || 0}</div>
              <p className="text-xs text-muted-foreground">regras cadastradas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Regras de Qualidade</CardTitle>
                <CardDescription>Lista de todas as regras cadastradas</CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Nova Regra
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar regras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select
                value={dimensaoFilter || "todas"}
                onValueChange={(value) => setDimensaoFilter(value === "todas" ? "" : value)}
              >
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filtrar por dimensão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as dimensões</SelectItem>
                  {dimensoes.map((dimensao) => (
                    <SelectItem key={dimensao.id} value={dimensao.id}>
                      {dimensao.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <RegrasQualidadeTable
                data={regras}
                dimensoes={dimensoes}
                tabelas={tabelas}
                colunas={colunas}
                papeis={papeis}
                isLoading={isLoading}
                error={error}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
          </CardContent>
        </Card>
      </div>

      <RegraQualidadeForm open={isFormOpen} onOpenChange={setIsFormOpen} regra={selectedRegra} />
    </>
  );
}
