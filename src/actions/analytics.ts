"use server";

import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export interface AnalyticsRequestBody {
    ano: number[];
    mes: string[];
    periodo: string[];
    dre: string[];
    unidade: string[];
    genero: string[];
    etapa_escolar: string[];
    idade: string;
    idade_em_meses: boolean;
}

export interface IntercorrenciaDre {
    codigo_eol: string;
    total: number;
    patrimonial: number;
    interpessoal: number;
}

export interface IntercorrenciaStatus {
    status: string;
    total: number;
    patrimonial: number;
    interpessoal: number;
}

export interface EvolucaoMensal {
    mes: number;
    total: number;
    patrimonial: number;
    interpessoal: number;
}

export interface AnalyticsResponse {
    intercorrencias_dre: IntercorrenciaDre[];
    intercorrencias_status: IntercorrenciaStatus[];
    evolucao_mensal: EvolucaoMensal[];
    cards: Record<string, number>[];
}

export async function getAnalytics(
    body: AnalyticsRequestBody,
): Promise<
    | { success: true; data: AnalyticsResponse }
    | { success: false; error: string }
> {
    try {
        const cookieStore = cookies();
        const authToken = cookieStore.get("auth_token")?.value;

        if (!authToken) {
            return {
                success: false,
                error: "Usuário não autenticado. Token não encontrado.",
            };
        }

        const response = await apiIntercorrencias.post<AnalyticsResponse>(
            "/analytics/",
            body,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            },
        );

        return { success: true, data: response.data };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao buscar dados analíticos";

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
}
