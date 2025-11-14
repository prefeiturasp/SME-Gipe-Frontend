"use server";

import { AxiosError } from "axios";
import { cookies } from "next/headers";
import apiAnexos from "@/lib/axios-anexos";

export type EnviarAnexoResult = {
    success: boolean;
    error?: string;
    data?: {
        id: string;
        url: string;
    };
};

export async function enviarAnexoAction(
    formData: FormData
): Promise<EnviarAnexoResult> {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return {
                success: false,
                error: "Token de autenticação não encontrado",
            };
        }

        const response = await apiAnexos.post("/anexos/", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string; errors?: unknown }>;
        let message = "Erro ao enviar anexo";

        if (error.response?.status === 401) {
            message = "Não autorizado";
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
