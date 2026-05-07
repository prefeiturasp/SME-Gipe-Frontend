"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import api from "@/lib/axios";

export const reativarUnidadeGestaoAction = async (
    uuid: string,
    motivo_reativacao: string,
): Promise<ActionResult> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        await api.post(
            `/unidades/gestao-unidades/${uuid}/reativar/`,
            { motivo_reativacao },
            { headers: createAuthHeaders(token) },
        );
        return { success: true };
    } catch (err) {
        return handleActionError(err, "Erro ao reativar unidade");
    }
};
