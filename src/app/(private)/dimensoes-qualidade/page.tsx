"use client";

import { Plus, Search, Target } from "lucide-react";
import { useCallback, useState } from "react";
import {
  useDeleteDimensoesQualidadeId,
  useGetDimensoesQualidade,
} from "@/api/generated/endpoints/dimensões-de-qualidade/dimensões-de-qualidade";
import { useGetPoliticasInternas } from "@/api/generated/endpoints/políticas-internas/políticas-internas";
import { DimensaoQualidadeForm } from "@/components/dimensoes/dimensao-form";
import { DimensoesTable } from "@/components/dimensoes/dimensoes-table";
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
import type { DimensaoQualidadeResponse } from "@/types/api";

export default function DimensoesQualidadePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [politicaFilter, setPoliticaFilter] = useState<string>("");
  const [page] = useState(1);
  const [limit] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDimensao, setSelectedDimensao] = useState<DimensaoQualidadeResponse | undefined>();

  void page;
  void limit;
  void searchTerm;
  void politicaFilter;

  const { data: dimensoesData, isLoading, error } = useGetDimensoesQualidade();
  const { data: politicasData } = useGetPoliticasInternas();

  const deleteDimensao = useDeleteDimensoesQualidadeId();

  const handleEdit = useCallback((dimensao: DimensaoQualidadeResponse) => {
    setSelectedDimensao(dimensao);
    setIsFormOpen(true);
  }, []);

  const handleNew = () => {
    setSelectedDimensao(undefined);
    setIsFormOpen(true);
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm("Tem certeza que deseja excluir esta dimensão de qualidade?")) {
        await deleteDimensao.mutateAsync({ id });
      }
    },
    [deleteDimensao],
  );

  const dimensoes = dimensoesData?.data ?? [];
  const politicas = politicasData?.data ?? [];

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dimensões de Qualidade
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as dimensões de qualidade de dados do sistema DECODE-GOV
          </p>
        </div>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Dimensões</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <Target className="h-4 w-4 text-blue-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dimensoes.length}</div>
            <p className="text-xs text-muted-foreground">dimensões cadastradas</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Dimensões de Qualidade</CardTitle>
                <CardDescription>Lista de todas as dimensões cadastradas</CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Nova Dimensão
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar dimensões..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select
                value={politicaFilter || "todas"}
                onValueChange={(value) => setPoliticaFilter(value === "todas" ? "" : value)}
              >
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filtrar por política" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as políticas</SelectItem>
                  {politicas.map((politica) => (
                    <SelectItem key={politica.id} value={politica?.id ?? ""}>
                      {politica.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DimensoesTable
              data={dimensoes}
              politicas={politicas}
              isLoading={isLoading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>

      <DimensaoQualidadeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        dimensao={selectedDimensao}
      />
    </>
  );
}
