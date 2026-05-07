"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import api from "@/lib/axios";

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
    data_inativacao_formatada: string | null;
    responsavel_inativacao_nome: string | null;
    motivo_inativacao: string | null;
};

export async function obterUnidadeGestao(
    uuid: string,
): Promise<ActionResult<ObterUnidadeGestaoResponse>> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await api.get<ObterUnidadeGestaoResponse>(
            `/unidades/gestao-unidades/${uuid}/`,
            { headers: createAuthHeaders(token) },
        );
        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao buscar unidade");
    }
}
