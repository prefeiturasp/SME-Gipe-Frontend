"use server";

import { AxiosError } from "axios";
import { cookies } from "next/headers";
import apiAnexos from "@/lib/axios-anexos";
import { ObterAnexosResponse } from "@/types/anexo";

type ObterAnexosParams = {
    intercorrenciaUuid: string;
    perfil?: string;
};

type ObterAnexosResult =
    | { success: true; data: ObterAnexosResponse }
    | { success: false; error: string };

export async function obterAnexos({
    intercorrenciaUuid,
    perfil,
}: ObterAnexosParams): Promise<ObterAnexosResult> {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return {
                success: false,
                error: "Token de autenticação não encontrado",
            };
        }

        const perfilParam = perfil ? `&perfil=${perfil}` : "";
        const response = await apiAnexos.get<ObterAnexosResponse>(
            `/anexos/?intercorrencia_uuid=${intercorrenciaUuid}${perfilParam}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            success: true,
            data: response.data,
        };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string; errors?: unknown }>;
        let message = "Erro ao buscar anexos";

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
