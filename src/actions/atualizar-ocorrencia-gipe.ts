"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import {
    OcorrenciaGipeBody,
    OcorrenciaGipeResponse,
} from "@/types/ocorrencia-gipe";

export const atualizarOcorrenciaGipe = async (
    uuid: string,
    body: OcorrenciaGipeBody,
): Promise<ActionResult<OcorrenciaGipeResponse>> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await apiIntercorrencias.put<OcorrenciaGipeResponse>(
            `/gipe/${uuid}/`,
            body,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao atualizar ocorrência GIPE");
    }
};
