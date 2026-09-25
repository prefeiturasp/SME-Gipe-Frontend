"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { OcorrenciaAPI } from "@/types/ocorrencia";

export const getOcorrenciasAction = async (): Promise<
    ActionResult<OcorrenciaAPI[]>
> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const { data } = await apiIntercorrencias.get<OcorrenciaAPI[]>(
            "/diretor/",
            {
                headers: createAuthHeaders(token),
            },
        );

        return { success: true, data };
    } catch (err) {
        return handleActionError(err, "Erro ao criar ocorrência");
    }
};
