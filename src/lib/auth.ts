
import { cookies } from "next/headers";

export async function clearCookieSession() {
  try{
    const cookieStore = await cookies();
    cookieStore.delete('authToken');
  }
  catch (error) {
    console.error("Erro ao deletar o cookie de autenticação:", error);
  }
}