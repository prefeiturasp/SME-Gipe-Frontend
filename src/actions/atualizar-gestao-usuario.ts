"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
} from "@/lib/actionUtils";
import api from "@/lib/axios";

export type AtualizarGestaoUsuarioRequest = {
    username: string;
    name: string;
    email: string;
    cpf?: string;
    cargo: number;
    rede: "DIRETA" | "INDIRETA";
    unidades: string[];
    is_app_admin: boolean;
};

export type AtualizarGestaoUsuarioResult = {
    success: boolean;
    error?: string;
    field?: string;
};

export async function atualizarGestaoUsuarioAction(
    uuid: string,
    dadosAtualizacao: AtualizarGestaoUsuarioRequest,
): Promise<AtualizarGestaoUsuarioResult> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        await api.put(`/users/gestao-usuarios/${uuid}/`, dadosAtualizacao, {
            headers: createAuthHeaders(token),
        });

        return { success: true };
    } catch (err) {
        return handleActionError(err, "Erro ao atualizar usuário");
    }
}
