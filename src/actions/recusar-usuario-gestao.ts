"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import api from "@/lib/axios";

export const recusarUsuarioGestao = async (
    uuid: string,
    justificativa: string,
): Promise<ActionResult> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        await api.post(
            `/users/gestao-usuarios/${uuid}/reprovar/`,
            { justificativa },
            { headers: createAuthHeaders(token) },
        );
        return { success: true };
    } catch (err) {
        return handleActionError(err, "Erro ao recusar usuário");
    }
};
