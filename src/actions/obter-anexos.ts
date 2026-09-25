"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiAnexos from "@/lib/axios-anexos";
import { ObterAnexosResponse } from "@/types/anexo";

type ObterAnexosParams = {
    intercorrenciaUuid: string;
    perfil?: string;
};

export async function obterAnexos({
    intercorrenciaUuid,
    perfil,
}: ObterAnexosParams): Promise<ActionResult<ObterAnexosResponse>> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const perfilParam = perfil ? `&perfil=${perfil}` : "";
        const response = await apiAnexos.get<ObterAnexosResponse>(
            `/anexos/?intercorrencia_uuid=${intercorrenciaUuid}${perfilParam}`,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao buscar anexos");
    }
}
