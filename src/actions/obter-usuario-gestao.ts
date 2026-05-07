"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import api from "@/lib/axios";

export type ObterUsuarioGestaoResponse = {
    uuid: string;
    username: string;
    name: string;
    email: string;
    cpf: string;
    cargo: number;
    rede: "DIRETA" | "INDIRETA";
    unidades: string[];
    is_validado: boolean;
    is_app_admin: boolean;
    is_core_sso: boolean;
    is_active: boolean;
    codigo_eol_unidade: string;
    codigo_eol_dre_da_unidade: string;
    data_inativacao: string | null;
    data_inativacao_formatada: string | null;
    responsavel_inativacao: string | null;
    responsavel_inativacao_nome: string | null;
    motivo_inativacao: string | null;
    inativado_via_unidade: boolean | null;
};

export async function obterUsuarioGestao(
    uuid: string,
): Promise<ActionResult<ObterUsuarioGestaoResponse>> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await api.get<ObterUsuarioGestaoResponse>(
            `/users/gestao-usuarios/${uuid}`,
            { headers: createAuthHeaders(token) },
        );
        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao buscar usuário");
    }
}
