"use server";

import api from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export type UnidadeCadastroPayload = {
    nome: string;
    codigo_eol: string;
    tipo_unidade: string;
    rede: string;
    sigla?: string;
    dre?: string | null;
    ativa: boolean;
};

export const cadastrarUnidadeAction = async (
    payload: UnidadeCadastroPayload
): Promise<{ success: true } | { success: false; error: string }> => {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return { success: false, error: "Usuário não autenticado" };
    }

    try {
        await api.post("/unidades/gestao-unidades/", payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao cadastrar unidade";

        if (error.response?.status === 401) {
            message = "Não autorizado. Faça login novamente.";
        } else if (error.response?.status === 500) {
            message = "Erro interno no servidor";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }

        return { success: false, error: message };
    }
};
