"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import api from "@/lib/axios";

export type TipoUnidadeAPI = {
    id: string;
    label: string;
};

export const getTiposUnidadeAction = async (): Promise<
    ActionResult<TipoUnidadeAPI[]>
> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const { data } = await api.get<TipoUnidadeAPI[]>(
            "/unidades/gestao-unidades/tipos-unidade/",
            { headers: createAuthHeaders(token) },
        );
        return { success: true, data };
    } catch (err) {
        return handleActionError(err, "Erro ao buscar tipos de unidade");
    }
};
