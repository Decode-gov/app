import axios from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor de resposta para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login ou lidar com autenticação
      console.error("Não autorizado")
    }
    return Promise.reject(error)
  }
)

export default api
