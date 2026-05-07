"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { SecaoInicialBody } from "@/types/secao-inicial";

export const atualizarSecaoInicial = async (
    uuid: string,
    body: SecaoInicialBody,
): Promise<ActionResult<{ uuid: string }>> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await apiIntercorrencias.put(
            `/diretor/${uuid}/secao-inicial/`,
            body,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao atualizar ocorrência");
    }
};
