"use server";

import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

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
    dadosCadastro: CadastroGestaoUsuarioRequest
): Promise<CadastroGestaoUsuarioResult> {
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

        await axios.post(`${API_URL}/users/gestao-usuarios/`, dadosCadastro, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        return { success: true };
    } catch (err) {
        const error = err as AxiosError<CadastroGestaoUsuarioErrorResponse>;

        let message = "Erro ao cadastrar usuário";
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
