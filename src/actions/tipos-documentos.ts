"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiAnexos from "@/lib/axios-anexos";
import { TipoDocumentoAPI } from "@/types/documentos";

export const getTiposDocumentoAction = async (
    perfil: string,
): Promise<ActionResult<TipoDocumentoAPI>> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const { data } = await apiAnexos.get<TipoDocumentoAPI>(
            `/anexos/categorias-disponiveis/?perfil=${perfil}`,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data };
    } catch (err) {
        return handleActionError(err, "Erro ao obter categorias de documentos");
    }
};
