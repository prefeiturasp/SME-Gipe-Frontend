"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiIntercorrencias from "@/lib/axios-intercorrencias";

export type DeclaranteAPI = {
    uuid: string;
    declarante: string;
};

export const getDeclarantesAction = async (): Promise<
    ActionResult<DeclaranteAPI[]>
> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const { data } = await apiIntercorrencias.get<DeclaranteAPI[]>(
            "/declarante/",
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data };
    } catch (err) {
        return handleActionError(err, "Erro ao buscar declarantes");
    }
};
