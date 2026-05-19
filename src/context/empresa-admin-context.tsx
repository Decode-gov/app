"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, type ReactNode, useCallback, useContext, useEffect } from "react";
import { useGetEmpresas } from "@/api/generated/endpoints/empresas/empresas";
import { useGetUsuariosPerfil } from "@/api/generated/endpoints/usuários/usuários";
import type { GetEmpresas200 } from "@/api/generated/model";
import { setGlobalEmpresaId } from "@/lib/empresa-store";

interface EmpresaAdminContextValue {
  isAdmin: boolean;
  empresas: GetEmpresas200["data"];
  selectedEmpresaId: string | null;
  setSelectedEmpresaId: (id: string | null) => void;
  isLoading: boolean;
}

const EmpresaAdminContext = createContext<EmpresaAdminContextValue | null>(null);

export function EmpresaAdminProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data: perfil, isLoading: isLoadingPerfil } = useGetUsuariosPerfil();
  const isAdmin = (perfil?.data as { tipo?: string } | undefined)?.tipo === "ADMIN";

  const { data: empresasData, isLoading: isLoadingEmpresas } = useGetEmpresas({
    query: { enabled: isAdmin },
  });

  const empresas = empresasData?.data ?? [];
  const selectedEmpresaId = searchParams.get("empresaId");

  setGlobalEmpresaId(selectedEmpresaId);

  useEffect(() => {
    return () => {
      setGlobalEmpresaId(null);
    };
  }, []);

  const setSelectedEmpresaId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set("empresaId", id);
      } else {
        params.delete("empresaId");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <EmpresaAdminContext.Provider
      value={{
        isAdmin,
        empresas,
        selectedEmpresaId,
        setSelectedEmpresaId,
        isLoading: isLoadingPerfil || (isAdmin && isLoadingEmpresas),
      }}
    >
      {children}
    </EmpresaAdminContext.Provider>
  );
}

export function useEmpresaAdmin(): EmpresaAdminContextValue {
  const ctx = useContext(EmpresaAdminContext);
  if (!ctx) throw new Error("useEmpresaAdmin must be used within EmpresaAdminProvider");
  return ctx;
}
