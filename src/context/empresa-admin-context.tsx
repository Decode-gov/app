"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useGetEmpresas } from "@/api/generated/endpoints/empresas/empresas"
import { setGlobalEmpresaId } from "@/lib/empresa-store"
import type { GetEmpresas200DataItem } from "@/api/generated/model"
import { useGetUsuariosPerfil } from "@/api/generated/endpoints/usuarios/usuarios";

interface EmpresaAdminContextValue {
  isAdmin: boolean
  empresas: GetEmpresas200DataItem[]
  selectedEmpresaId: string | null
  setSelectedEmpresaId: (id: string | null) => void
  isLoading: boolean
}

const EmpresaAdminContext = createContext<EmpresaAdminContextValue | null>(null)

export function EmpresaAdminProvider({ children }: { children: ReactNode }) {
  const [selectedEmpresaId, setSelectedEmpresaIdState] = useState<string | null>(null)

  const { data: perfil, isLoading: isLoadingPerfil } = useGetUsuariosPerfil()
  const isAdmin = (perfil?.data as { tipo?: string } | undefined)?.tipo === "ADMIN"

  const { data: empresasData, isLoading: isLoadingEmpresas } = useGetEmpresas({ query: { enabled: isAdmin } })

  const empresas = empresasData?.data ?? []

  const setSelectedEmpresaId = useCallback((id: string | null) => {
    setSelectedEmpresaIdState(id)
    setGlobalEmpresaId(id)
  }, [])

  // Limpa empresaId global ao desmontar (logout/troca de usuário)
  useEffect(() => {
    return () => {
      setGlobalEmpresaId(null)
    }
  }, [])

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
  )
}

export function useEmpresaAdmin(): EmpresaAdminContextValue {
  const ctx = useContext(EmpresaAdminContext)
  if (!ctx) throw new Error("useEmpresaAdmin must be used within EmpresaAdminProvider")
  return ctx
}
