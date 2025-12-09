"use server";

import { cookies } from "next/headers";
import { AxiosError } from "axios";
import apiAnexos from "@/lib/axios-anexos";

export const baixarAnexo = async (
  uuid: string
): Promise<{ 
  success: true; 
  url: string; 
  nomeArquivo: string;
} | { 
  success: false; 
  error: string; 
}> => {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
      return {
        success: false,
        error: "Usuário não autenticado. Token não encontrado.",
      };
    }

    const response = await apiAnexos.get(`/anexos/${uuid}/url-download/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return {
      success: true,
      url: response.data.url_download,
      nomeArquivo: response.data.nome_arquivo,
    };
  } catch (err) {
    const error = err as AxiosError<{ detail?: string }>;
    let message = "Erro ao obter URL de download";

    if (error.response?.status === 401) {
      message = "Não autorizado. Faça login novamente.";
    } else if (error.response?.status === 404) {
      message = "Arquivo não encontrado";
    } else if (error.response?.status === 500) {
      message = "Erro interno no servidor";
    } else if (error.message) {
      message = error.message;
    }

    return { success: false, error: message };
  }
};