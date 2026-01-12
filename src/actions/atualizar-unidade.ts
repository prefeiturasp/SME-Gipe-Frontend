"use server";

import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

export type AtualizarUnidadeRequest = {
    tipo_unidade: string;
    nome: string;
    rede: string;
    codigo_eol: string;
    dre?: string | null;
    sigla?: string;
    ativa: boolean;
};

export type AtualizarUnidadeResult = {
    success: boolean;
    error?: string;
    field?: string;
};

type AtualizarUnidadeErrorResponse = {
    detail?: string;
    field?: string;
};

export async function atualizarUnidadeAction(
    uuid: string,
    dadosAtualizacao: AtualizarUnidadeRequest
): Promise<AtualizarUnidadeResult> {
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

        await axios.put(
            `${API_URL}/unidades/gestao-unidades/${uuid}/`,
            dadosAtualizacao,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        return { success: true };
    } catch (err) {
        const error = err as AxiosError<AtualizarUnidadeErrorResponse>;

        let message = "Erro ao atualizar unidade";
        let field: string | undefined;

        if (error.response?.status === 500) {
            message = "Erro interno no servidor";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }

        if (error.response?.data?.field) {
            field = error.response.data.field;
        }

        return { success: false, error: message, field };
    }
}
