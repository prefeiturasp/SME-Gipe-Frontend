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
    OcorrenciaDreBody,
    OcorrenciaDreResponse,
} from "@/types/ocorrencia-dre";

export const atualizarOcorrenciaDre = async (
    uuid: string,
    body: OcorrenciaDreBody,
): Promise<ActionResult<OcorrenciaDreResponse>> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await apiIntercorrencias.put<OcorrenciaDreResponse>(
            `/dre/${uuid}/`,
            body,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao atualizar ocorrência DRE");
    }
};
