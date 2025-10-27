"use server"

import { cookies } from "next/headers";

export async function clearCookieSession() {
  try{
    const cookieStore = cookies();
    (await cookieStore).delete('authToken');
  }
  catch (error) {
    console.error("Erro ao deletar o cookie de autenticação:", error);
  }
}