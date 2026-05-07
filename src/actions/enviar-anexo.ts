"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiAnexos from "@/lib/axios-anexos";

export type EnviarAnexoResult = ActionResult<{ id: string; url: string }>;

export async function enviarAnexoAction(
    formData: FormData,
): Promise<EnviarAnexoResult> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await apiAnexos.post("/anexos/", formData, {
            headers: createAuthHeaders(token),
        });

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao enviar anexo");
    }
}
