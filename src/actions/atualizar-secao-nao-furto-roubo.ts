"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { SecaoNaoFurtoRouboBody } from "@/types/secao-nao-furto-roubo";

export const atualizarSecaoNaoFurtoRoubo = async (
    uuid: string,
    body: SecaoNaoFurtoRouboBody,
): Promise<ActionResult<{ uuid: string }>> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await apiIntercorrencias.put(
            `/diretor/${uuid}/nao-furto-roubo/`,
            body,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(
            err,
            "Erro ao atualizar seção não furto e roubo",
        );
    }
};
