"use server";

import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

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
    dadosAtualizacao: AtualizarGestaoUsuarioRequest
): Promise<AtualizarGestaoUsuarioResult> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return {
                success: false,
                error: "Token de autenticação não encontrado",
            };
        }

        await axios.put(
            `${API_URL}/users/gestao-usuarios/${uuid}/`,
            dadosAtualizacao,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        return { success: true };
    } catch (err) {
        const error = err as AxiosError<AtualizarGestaoUsuarioErrorResponse>;

        let message = "Erro ao atualizar usuário";
        let field: string | undefined;

        if (error.response?.status === 500) {
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
