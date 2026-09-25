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
    FormularioCompletoUEBody,
    FormularioCompletoUEResponse,
} from "@/types/formulario-completo-ue";

export const atualizarFormularioCompletoUE = async (
    uuid: string,
    body: FormularioCompletoUEBody,
): Promise<ActionResult<FormularioCompletoUEResponse>> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response =
            await apiIntercorrencias.put<FormularioCompletoUEResponse>(
                `/diretor/${uuid}/`,
                body,
                { headers: createAuthHeaders(token) },
            );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(
            err,
            "Erro ao atualizar formulário completo da UE",
        );
    }
};
