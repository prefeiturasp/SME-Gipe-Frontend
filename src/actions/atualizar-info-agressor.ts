"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { InfoAgressorBody, InfoAgressorResponse } from "@/types/info-agressor";

export const atualizarInfoAgressor = async (
    uuid: string,
    body: InfoAgressorBody,
): Promise<ActionResult<InfoAgressorResponse>> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await apiIntercorrencias.put<InfoAgressorResponse>(
            `/diretor/${uuid}/info-agressor/`,
            body,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(
            err,
            "Erro ao atualizar informações adicionais",
        );
    }
};
