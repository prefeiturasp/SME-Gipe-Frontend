"use server";

import {
    createAuthHeaders,
    getAuthToken,
    validateAuthToken,
} from "@/lib/actionUtils";
import api from "@/lib/axios";
import { AxiosError } from "axios";

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
    dadosAtualizacao: AtualizarUnidadeRequest,
): Promise<AtualizarUnidadeResult> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        await api.put(`/unidades/gestao-unidades/${uuid}/`, dadosAtualizacao, {
            headers: createAuthHeaders(token),
        });

        return { success: true };
    } catch (err) {
        const error = err as AxiosError<AtualizarUnidadeErrorResponse>;

        let message = "Erro ao atualizar unidade";
        let field: string | undefined;

        if (error.response?.status === 401) {
            message = "Não autorizado. Faça login novamente.";
        } else if (error.response?.status === 500) {
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
