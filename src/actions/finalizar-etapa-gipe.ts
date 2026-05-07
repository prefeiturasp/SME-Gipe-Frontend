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
    FinalizarOcorrenciaResponse,
    MotivoEncerramentoBody,
} from "@/types/finalizar-etapa";

export const finalizarEtapaGipe = async (
    uuid: string,
    body: MotivoEncerramentoBody,
): Promise<ActionResult<FinalizarOcorrenciaResponse>> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await apiIntercorrencias.put(
            `/gipe/${uuid}/finalizar/`,
            body,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao enviar etapa para GIPE");
    }
};
