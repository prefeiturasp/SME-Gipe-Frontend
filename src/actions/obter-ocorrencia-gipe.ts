"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { OcorrenciaGipeResponse } from "@/types/ocorrencia-gipe";

export async function obterOcorrenciaGipe(
    uuid: string,
): Promise<ActionResult<OcorrenciaGipeResponse>> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await apiIntercorrencias.get<OcorrenciaGipeResponse>(
            `/gipe/${uuid}/`,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao obter ocorrência GIPE");
    }
}
