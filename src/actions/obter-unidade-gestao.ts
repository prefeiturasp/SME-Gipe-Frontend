"use server";

import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

export type ObterUnidadeGestaoResponse = {
    uuid: string;
    codigo_eol: string;
    nome: string;
    tipo_unidade: "ADM" | "CEU" | "EMEF" | "EMEI" | "EMEBS" | "CEI";
    tipo_unidade_label: string;
    rede: "DIRETA" | "INDIRETA";
    rede_label: string;
    dre_uuid: string;
    dre_nome: string;
    sigla: string;
    ativa: boolean;
};

export type ObterUnidadeGestaoResult =
    | { success: true; data: ObterUnidadeGestaoResponse }
    | { success: false; error: string };

export async function obterUnidadeGestao(
    uuid: string
): Promise<ObterUnidadeGestaoResult> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return {
                success: false,
                error: "Token de autenticação não encontrado",
            };
        }

        const response = await axios.get<ObterUnidadeGestaoResponse>(
            `${API_URL}/unidades/gestao-unidades/${uuid}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        return { success: true, data: response.data };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao buscar unidade";

        if (error.response?.status === 401) {
            message = "Não autorizado";
        } else if (error.response?.status === 404) {
            message = "Unidade não encontrada";
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
