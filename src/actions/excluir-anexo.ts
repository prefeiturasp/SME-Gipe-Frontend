"use server";

import { cookies } from "next/headers";
import { AxiosError } from "axios";
import apiAnexos from "@/lib/axios-anexos";

export const excluirAnexo = async (
    uuid: string
): Promise<{ success: true } | { success: false; error: string }> => {
    try {
        const cookieStore = cookies();
        const authToken = cookieStore.get("auth_token")?.value;

        if (!authToken) {
            return {
                success: false,
                error: "Usuário não autenticado. Token não encontrado.",
            };
        }

        await apiAnexos.delete(`/anexos/${uuid}/`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        return { success: true };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao excluir arquivo.";

        if (error.response?.status === 401) {
            message = "Não autorizado. Faça login novamente.";
        } else if (error.response?.status === 404) {
            message = "Arquivo não encontrado.";
        } else if (error.response?.status === 500) {
            message = "Erro interno no servidor.";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }

        return { success: false, error: message };
    }
};
