"use server";

import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

export type OcorrenciaDetalheAPI = {
    id: number;
    uuid: string;
    data_ocorrencia: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    sobre_furto_roubo_invasao_depredacao: boolean;
    user_username: string;
    criado_em: string;
    atualizado_em: string;
    tipos_ocorrencia?: Array<{ uuid: string; nome: string }>;
    descricao_ocorrencia?: string;
    status?: string;
    smart_sampa_situacao?: "sim_com_dano" | "sim_sem_dano" | "nao_faz_parte";
    smart_sampa_situacao_display?: string;
};

export async function obterOcorrencia(
    uuid: string
): Promise<
    | { success: true; data: OcorrenciaDetalheAPI }
    | { success: false; error: string }
> {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return { success: false, error: "Usuário não autenticado" };
    }

    try {
        const { data } = await apiIntercorrencias.get<OcorrenciaDetalheAPI>(
            `/diretor/${uuid}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { success: true, data };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao buscar ocorrência";
        if (error.response?.status === 500) {
            message = "Erro interno no servidor";
        } else if (error.response?.status === 404) {
            message = "Ocorrência não encontrada";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }
        return { success: false, error: message };
    }
}
