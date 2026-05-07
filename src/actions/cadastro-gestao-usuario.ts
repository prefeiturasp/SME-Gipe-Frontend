"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
} from "@/lib/actionUtils";
import api from "@/lib/axios";

export type CadastroGestaoUsuarioRequest = {
    username: string;
    name: string;
    email: string;
    cpf?: string;
    cargo: number;
    rede: "DIRETA" | "INDIRETA";
    unidades: string[];
    is_app_admin: boolean;
};

export type CadastroGestaoUsuarioResult = {
    success: boolean;
    error?: string;
    field?: string;
};

export async function cadastroGestaoUsuarioAction(
    dadosCadastro: CadastroGestaoUsuarioRequest,
): Promise<CadastroGestaoUsuarioResult> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        await api.post("/users/gestao-usuarios/", dadosCadastro, {
            headers: createAuthHeaders(token),
        });

        return { success: true };
    } catch (err) {
        return handleActionError(err, "Erro ao cadastrar usuário");
    }
}
