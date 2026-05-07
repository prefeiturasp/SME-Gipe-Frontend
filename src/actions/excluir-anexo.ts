"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiAnexos from "@/lib/axios-anexos";

export const excluirAnexo = async (uuid: string): Promise<ActionResult> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        await apiAnexos.delete(`/anexos/${uuid}/`, {
            headers: createAuthHeaders(token),
        });

        return { success: true };
    } catch (err) {
        return handleActionError(err, "Erro ao excluir arquivo.");
    }
};
