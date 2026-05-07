"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { OcorrenciaDreResponse } from "@/types/ocorrencia-dre";

export async function obterOcorrenciaDre(
    uuid: string,
): Promise<ActionResult<OcorrenciaDreResponse>> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await apiIntercorrencias.get<OcorrenciaDreResponse>(
            `/dre/${uuid}/`,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao obter ocorrência DRE");
    }
}
