"use server";

import {
    createAuthHeaders,
    getAuthToken,
    validateAuthToken,
} from "@/lib/actionUtils";
import api from "@/lib/axios";
import { AxiosError } from "axios";

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

type CadastroGestaoUsuarioErrorResponse = {
    detail?: string;
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
        const error = err as AxiosError<CadastroGestaoUsuarioErrorResponse>;

        let message = "Erro ao cadastrar usuário";
        let field: string | undefined;

        if (error.response?.status === 401) {
            message = "Não autorizado. Faça login novamente.";
        } else if (error.response?.status === 500) {
            message = "Erro interno no servidor";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }

        if (error.response?.data?.field) {
            field = error.response.data.field;
        }

        return { success: false, error: message, field };
    }
}
