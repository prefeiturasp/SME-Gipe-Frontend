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

export type CategoriasDisponiveisGipeAPI = {
    envolve_arma_ou_ataque: CategoriaItem[];
    ameaca_foi_realizada_de_qual_maneira: CategoriaItem[];
    motivo_ocorrencia: CategoriaItem[];
    etapa_escolar: CategoriaItem[];
};

export const getCategoriasDisponiveisGipeAction = async (): Promise<
    ActionResult<CategoriasDisponiveisGipeAPI>
> => {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const { data } =
            await apiIntercorrencias.get<CategoriasDisponiveisGipeAPI>(
                "gipe/categorias-disponiveis/",
                { headers: createAuthHeaders(token) },
            );

        return { success: true, data };
    } catch (err) {
        return handleActionError(err, "Erro ao buscar as categorias do GIPE");
    }
};
