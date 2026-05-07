"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import api from "@/lib/axios";

export type ConsultarEolUnidadeResponse = {
    etapa_modalidade: string;
    nome_unidade: string;
    codigo_dre?: string;
};

export const consultarEolUnidadeAction = async (
    codigoEol: string,
    etapaModalidade: string,
): Promise<ActionResult<ConsultarEolUnidadeResponse>> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await api.get<ConsultarEolUnidadeResponse>(
            `/unidades/gestao-unidades/consultar-eol/?codigo_eol=${codigoEol}&etapa_modalidade=${etapaModalidade}`,
            { headers: createAuthHeaders(token) },
        );
        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao consultar código EOL");
    }
};
