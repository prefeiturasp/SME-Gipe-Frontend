"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiIntercorrencias from "@/lib/axios-intercorrencias";

export type TipoOcorrenciaAPI = {
    uuid: string;
    nome: string;
    descricao?: string;
};

export type TipoFormulario = "PATRIMONIAL" | "GERAL" | "TODOS";

export const getTiposOcorrenciaAction = async (
    tipoFormulario?: TipoFormulario,
): Promise<ActionResult<TipoOcorrenciaAPI[]>> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const url = tipoFormulario
            ? `/tipos-ocorrencia/?tipo_formulario=${tipoFormulario}`
            : "/tipos-ocorrencia/";

        const { data } = await apiIntercorrencias.get<TipoOcorrenciaAPI[]>(
            url,
            {
                headers: createAuthHeaders(token),
            },
        );

        return { success: true, data };
    } catch (err) {
        return handleActionError(err, "Erro ao buscar tipos de ocorrência");
    }
};
