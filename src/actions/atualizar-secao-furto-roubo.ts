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
    SecaoFurtoRouboBody,
    SecaoFurtoRouboResponse,
} from "@/types/secao-furto-roubo";

export const atualizarSecaoFurtoRoubo = async (
    uuid: string,
    body: SecaoFurtoRouboBody,
): Promise<ActionResult<SecaoFurtoRouboResponse>> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await apiIntercorrencias.put<SecaoFurtoRouboResponse>(
            `/diretor/${uuid}/furto-roubo/`,
            body,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(
            err,
            "Erro ao atualizar seção de furto e roubo",
        );
    }
};
