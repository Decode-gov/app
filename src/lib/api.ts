import axios from "axios";
import { getGlobalEmpresaId } from "@/lib/empresa-store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Injeta empresaId quando ADMIN selecionou uma empresa
api.interceptors.request.use((config) => {
  const empresaId = getGlobalEmpresaId();
  if (empresaId) {
    const method = config.method?.toLowerCase();
    if (!method || method === "get" || method === "delete" || method === "head") {
      config.params = { ...config.params, empresaId };
    } else {
      config.data = { ...config.data, empresaId };
    }
  }
  return config;
});

// Interceptor de resposta para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login ou lidar com autenticação
      console.error("Não autorizado");
    }
    return Promise.reject(error);
  },
);

export default api;
