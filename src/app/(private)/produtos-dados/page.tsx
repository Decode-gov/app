"use client";

import {
  Edit,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { useDeleteProdutosDadosId, useGetProdutosDados } from "@/api/generated/endpoints/produtos-de-dados/produtos-de-dados";
import { ProdutoForm } from "@/components/produtos/produto-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProdutoDadosResponse } from "@/types/api";

export default function ProdutosDadosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dominioFilter, setDominioFilter] = useState<string>("");
  const [page] = useState(1);
  const [limit] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<ProdutoDadosResponse | undefined>();

  void page;
  void limit;
  void searchTerm;
  void dominioFilter;

  const { data: produtosData, isLoading, error } = useGetProdutosDados();

  const deleteProduto = useDeleteProdutosDadosId();

  const handleEdit = (produto: ProdutoDadosResponse) => {
    setSelectedProduto(produto);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setSelectedProduto(undefined);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto de dados?")) {
      await deleteProduto.mutateAsync({ id });
    }
  };

  const produtos = produtosData?.data ?? [];

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Produtos de Dados
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os produtos de dados do sistema DECODE-GOV
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Produtos de Dados</CardTitle>
                <CardDescription>Lista de todos os produtos cadastrados</CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : error ? (
              <p className="text-center text-muted-foreground py-8">
                Erro ao carregar produtos. Tente novamente.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Domínio</TableHead>
                      <TableHead>Termos</TableHead>
                      <TableHead>Ativos</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos.map((produto: ProdutoDadosResponse) => {
                      return (
                        <TableRow key={produto.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-blue-500" />
                              {produto.nome}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[300px] truncate" title={produto.descricao}>
                              {produto.descricao}
                            </div>
                          </TableCell>

                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(produto)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDelete(produto.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ProdutoForm open={isFormOpen} onOpenChange={setIsFormOpen} produto={selectedProduto} />
    </>
  );
}
