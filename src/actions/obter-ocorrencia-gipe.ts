"use server";

import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { cookies } from "next/headers";
import { AxiosError } from "axios";
import { OcorrenciaGipeResponse } from "@/types/ocorrencia-gipe";

export async function obterOcorrenciaGipe(
    uuid: string
): Promise<
    | { success: true; data: OcorrenciaGipeResponse }
    | { success: false; error: string }
> {
    try {
        const cookieStore = cookies();
        const authToken = cookieStore.get("auth_token")?.value;

        if (!authToken) {
            return {
                success: false,
                error: "Usuário não autenticado. Token não encontrado.",
            };
        }

        const response = await apiIntercorrencias.get<OcorrenciaGipeResponse>(
            `/gipe/${uuid}/`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        return { success: true, data: response.data };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao obter ocorrência GIPE";

        if (error.response?.status === 401) {
            message = "Não autorizado. Faça login novamente.";
        } else if (error.response?.status === 404) {
            message = "Ocorrência GIPE não encontrada";
        } else if (error.response?.status === 500) {
            message = "Erro interno no servidor";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }

        return { success: false, error: message };
    }
}
