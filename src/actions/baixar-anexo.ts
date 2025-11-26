"use server";

import { cookies } from "next/headers";
import { AxiosError } from "axios";
import apiAnexos from "@/lib/axios-anexos";

export const baixarAnexo = async (uuid: string) => {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
      throw new Error("Usuário não autenticado. Token não encontrado.");
    }

    const response = await apiAnexos.get(`/anexos/${uuid}/download/`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });


    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    throw new Error(error.message || "Erro ao baixar arquivo");
  }
};
