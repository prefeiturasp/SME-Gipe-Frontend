"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiIntercorrencias from "@/lib/axios-intercorrencias";

export type CategoriaItem = {
    value: string;
    label: string;
};

export type CategoriasDisponiveisAPI = {
    motivo_ocorrencia: CategoriaItem[];
    grupo_etnico_racial: CategoriaItem[];
    genero: CategoriaItem[];
    frequencia_escolar: CategoriaItem[];
    etapa_escolar: CategoriaItem[];
};

export const getCategoriasDisponiveisAction = async (): Promise<
    ActionResult<CategoriasDisponiveisAPI>
> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const { data } = await apiIntercorrencias.get<CategoriasDisponiveisAPI>(
            "diretor/categorias-disponiveis/",
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data };
    } catch (err) {
        return handleActionError(err, "Erro ao buscar as categorias");
    }
};
