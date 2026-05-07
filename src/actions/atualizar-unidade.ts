"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
} from "@/lib/actionUtils";
import api from "@/lib/axios";

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
        return handleActionError(err, "Erro ao atualizar unidade");
    }
}
