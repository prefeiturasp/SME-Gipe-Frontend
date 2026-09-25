"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiIntercorrencias from "@/lib/axios-intercorrencias";

export type EnvolvidoAPI = {
    uuid: string;
    perfil_dos_envolvidos: string;
};

export const getEnvolvidoAction = async (): Promise<
    ActionResult<EnvolvidoAPI[]>
> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const { data } = await apiIntercorrencias.get<EnvolvidoAPI[]>(
            "/envolvidos/",
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data };
    } catch (err) {
        return handleActionError(err, "Erro ao buscar envolvidos");
    }
};
