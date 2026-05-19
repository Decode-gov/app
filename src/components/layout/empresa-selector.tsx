"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmpresaAdmin } from "@/context/empresa-admin-context";

export function EmpresaSelector() {
  const { isAdmin, empresas, selectedEmpresaId, setSelectedEmpresaId } = useEmpresaAdmin();

  if (!isAdmin || empresas.length === 0) return null;

  return (
    <Select value={selectedEmpresaId ?? ""} onValueChange={(v) => setSelectedEmpresaId(v || null)}>
      <SelectTrigger className="w-md text-sm">
        <SelectValue placeholder="Selecionar empresa..." />
      </SelectTrigger>
      <SelectContent>
        {empresas.map((empresa) => (
          <SelectItem key={empresa.id} value={empresa.id}>
            {String(empresa.nome)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
