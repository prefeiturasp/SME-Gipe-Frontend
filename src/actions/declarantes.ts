"use server";

import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export type DeclaranteAPI = {
    uuid: string;
    declarante: string;
};

export const getDeclarantesAction = async (): Promise<
    { success: true; data: DeclaranteAPI[] } | { success: false; error: string }
> => {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return { success: false, error: "Usuário não autenticado" };
    }

    try {
        const { data } = await apiIntercorrencias.get<DeclaranteAPI[]>(
            "/declarante/",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return { success: true, data };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao buscar declarantes";

        if (error.response?.status === 401) {
            message = "Não autorizado. Faça login novamente.";
        } else if (error.response?.status === 404) {
            message = "Declarantes não encontrados";
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
