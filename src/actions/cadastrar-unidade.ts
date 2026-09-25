"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import api from "@/lib/axios";

export type UnidadeCadastroPayload = {
    nome: string;
    codigo_eol: string;
    tipo_unidade: string;
    rede: string;
    sigla?: string;
    dre?: string | null;
    ativa: boolean;
};

export const cadastrarUnidadeAction = async (
    payload: UnidadeCadastroPayload,
): Promise<ActionResult> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        await api.post("/unidades/gestao-unidades/", payload, {
            headers: createAuthHeaders(token),
        });
        return { success: true };
    } catch (err) {
        return handleActionError(err, "Erro ao cadastrar unidade");
    }
};
