"use server";

import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export type OcorrenciaDetalheAPI = {
    id: number;
    uuid: string;
    data_ocorrencia: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    nome_dre?: string;
    nome_unidade?: string;
    sobre_furto_roubo_invasao_depredacao: boolean;
    user_username: string;
    criado_em: string;
    atualizado_em: string;
    tipos_ocorrencia?: Array<{ uuid: string; nome: string }>;
    tipos_ocorrencia_outros?: string;
    descricao_ocorrencia?: string;
    status?: string;
    smart_sampa_situacao?: "sim" | "nao";
    smart_sampa_situacao_display?: string;
    declarante_detalhes?: {
        uuid: string;
        declarante: string;
    };
    comunicacao_seguranca_publica?:
        | "sim_gcm"
        | "sim_pm"
        | "sim_dc"
        | "sim_cbm"
        | "nao";
    protocolo_acionado?: "ameaca" | "alerta" | "registro";
    envolvido?: Array<{
        uuid: string;
        perfil_dos_envolvidos: string;
    }>;
    envolvido_outros?: string;
    tem_info_agressor_ou_vitima?: "sim" | "nao";
    pessoas_agressoras?: Array<{
        nome: string;
        idade: number;
        genero: string;
        grupo_etnico_racial: string;
        etapa_escolar: string;
        frequencia_escolar: string;
        interacao_ambiente_escolar: string;
    }>;
    motivacao_ocorrencia_display?: Array<{ value: string; label: string }>;
    motivacao_ocorrencia_outros?: string;
    redes_protecao_acompanhamento?: string;
    notificado_conselho_tutelar?: boolean;
    acompanhado_naapa?: boolean;
};

export async function obterOcorrencia(
    uuid: string,
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
            },
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
