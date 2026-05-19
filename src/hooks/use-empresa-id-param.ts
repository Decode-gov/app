"use client";

import { useEmpresaAdmin } from "@/context/empresa-admin-context";

export function useEmpresaIdParam(): { empresaId?: string } {
  const { isAdmin, selectedEmpresaId } = useEmpresaAdmin();
  return isAdmin && selectedEmpresaId ? { empresaId: selectedEmpresaId } : {};
}
