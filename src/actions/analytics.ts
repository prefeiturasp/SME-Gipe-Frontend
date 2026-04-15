"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import apiIntercorrencias from "@/lib/axios-intercorrencias";

export interface AnalyticsRequestBody {
    ano: number[];
    mes: string[];
    periodo: number[];
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

export interface IntercorrenciasTipos {
    patrimonial: Record<string, number>;
    interpessoal: Record<string, number>;
}

export interface AnalyticsResponse {
    intercorrencias_dre: IntercorrenciaDre[];
    intercorrencias_status: IntercorrenciaStatus[];
    evolucao_mensal: EvolucaoMensal[];
    intercorrencias_tipos: IntercorrenciasTipos;
    total_por_motivo: Record<string, number>;
    cards: Record<string, number>[];
}

export async function getAnalytics(
    body: AnalyticsRequestBody,
): Promise<ActionResult<AnalyticsResponse>> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    try {
        const token = getAuthToken()!;
        const response = await apiIntercorrencias.post<AnalyticsResponse>(
            "/analytics/",
            body,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao buscar dados analíticos");
    }
}
