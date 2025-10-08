"use server";

import { cookies } from "next/headers";
import { AxiosError } from "axios";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { NovaOcorrenciaBody } from "@/types/nova-ocorrencia";

export const novaOcorrencia = async (body: NovaOcorrenciaBody) => {
    try {
        const cookieStore = cookies();
        const authToken = cookieStore.get("auth_token")?.value;

        if (!authToken) {
            throw new Error("Usuário não autenticado. Token não encontrado.");
        }

        await apiIntercorrencias.post("/intercorrencias/", body, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return { success: true };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao criar ocorrência";
        if (error.response?.status === 500) {
            message = "Erro interno no servidor";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }
        return { success: false, error: message };
    }
};
