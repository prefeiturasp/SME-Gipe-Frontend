"use server";

import api from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export type TipoUnidadeAPI = {
    id: string;
    label: string;
};

export const getTiposUnidadeAction = async (): Promise<
    | { success: true; data: TipoUnidadeAPI[] }
    | { success: false; error: string }
> => {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return { success: false, error: "Usuário não autenticado" };
    }

    try {
        const { data } = await api.get<TipoUnidadeAPI[]>(
            "/unidades/gestao-unidades/tipos-unidade/",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { success: true, data };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao buscar tipos de unidade";

        if (error.response?.status === 401) {
            message = "Não autorizado. Faça login novamente.";
        } else if (error.response?.status === 404) {
            message = "Tipos de unidade não encontrados";
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
