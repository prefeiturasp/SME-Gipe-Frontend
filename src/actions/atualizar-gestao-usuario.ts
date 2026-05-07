"use server";

import {
    createAuthHeaders,
    getAuthToken,
    validateAuthToken,
} from "@/lib/actionUtils";
import api from "@/lib/axios";
import { AxiosError } from "axios";

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

type AtualizarGestaoUsuarioErrorResponse = {
    detail?: string;
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
        const error = err as AxiosError<AtualizarGestaoUsuarioErrorResponse>;

        let message = "Erro ao atualizar usuário";
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
