"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import api from "@/lib/axios";

export const reativarGestaoUsuarioAction = async (
    uuid: string,
): Promise<ActionResult> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        await api.post(
            `/users/gestao-usuarios/${uuid}/reativar/`,
            {},
            { headers: createAuthHeaders(token) },
        );
        return { success: true };
    } catch (err) {
        return handleActionError(err, "Erro ao reativar usuário");
    }
};
