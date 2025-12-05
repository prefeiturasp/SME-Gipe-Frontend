"use server";

import apiAnexos from "@/lib/axios-anexos";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { TipoDocumentoAPI } from "@/types/documentos";

export const getTiposDocumentoAction = async (
    perfil: string
): Promise<
    | { success: true; data: TipoDocumentoAPI }
    | { success: false; error: string }
> => {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return { success: false, error: "Usuário não autenticado" };
    }

    const url = `/anexos/categorias-disponiveis/?perfil=${perfil}`;

    try {
        const { data } = await apiAnexos.get<TipoDocumentoAPI>(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, data };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao obter categorias de documentos";

        if (error.response?.status === 500) {
            message = "Erro interno no servidor";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }

        return { success: false, error: message };
    }
};
