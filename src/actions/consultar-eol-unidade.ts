"use server";

import api from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export type ConsultarEolUnidadeResponse = {
    etapa_modalidade: string;
    nome_unidade: string;
    codigo_dre?: string;
};

export const consultarEolUnidadeAction = async (
    codigoEol: string,
    etapaModalidade: string,
): Promise<
    | { success: true; data: ConsultarEolUnidadeResponse }
    | { success: false; error: string }
> => {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return { success: false, error: "Usuário não autenticado" };
    }

    try {
        const response = await api.get<ConsultarEolUnidadeResponse>(
            `/unidades/gestao-unidades/consultar-eol/?codigo_eol=${codigoEol}&etapa_modalidade=${etapaModalidade}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return { success: true, data: response.data };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao consultar código EOL";

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
