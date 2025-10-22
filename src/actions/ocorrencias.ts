"use server";

import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { OcorrenciaAPI } from "@/types/ocorrencia";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

type GetOcorrenciasParams = {
    dre?: string | null;
    usuario?: string;
};

export const getOcorrenciasAction = async ({
    dre,
    usuario,
}: GetOcorrenciasParams): Promise<
    { success: true; data: OcorrenciaAPI[] } | { success: false; error: string }
> => {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return { success: false, error: "Usuário não autenticado" };
    }

    let url = "/";
    const params = new URLSearchParams();

    if (dre) {
        params.append("dre", dre);
    } else if (usuario) {
        url = "diretor/";
    }

    try {
        const { data } = await apiIntercorrencias.get<OcorrenciaAPI[]>(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, data };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao criar ocorrência";
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
