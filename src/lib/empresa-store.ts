let _selectedEmpresaId: string | null = null;

export function setGlobalEmpresaId(id: string | null): void {
  _selectedEmpresaId = id;
}

export function getGlobalEmpresaId(): string | null {
  return _selectedEmpresaId;
}
