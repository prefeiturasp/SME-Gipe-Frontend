"use server";

import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

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
};

export type ObterUsuarioGestaoResult =
    | { success: true; data: ObterUsuarioGestaoResponse }
    | { success: false; error: string };

export async function obterUsuarioGestao(
    uuid: string
): Promise<ObterUsuarioGestaoResult> {
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

        const response = await axios.get<ObterUsuarioGestaoResponse>(
            `${API_URL}/users/gestao-usuarios/${uuid}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        return { success: true, data: response.data };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao buscar usuário";

        if (error.response?.status === 401) {
            message = "Não autorizado";
        } else if (error.response?.status === 404) {
            message = "Usuário não encontrado";
        } else if (error.response?.status === 500) {
            message = "Erro interno no servidor";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }

        return { success: false, error: message };
    }
}
