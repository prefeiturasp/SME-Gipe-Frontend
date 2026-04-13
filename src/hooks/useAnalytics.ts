import {
    getAnalytics,
    type AnalyticsRequestBody,
    type AnalyticsResponse,
} from "@/actions/analytics";
import type { FilterState } from "@/components/dashboard/ExtracaoDados/FilterPanel";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

function buildRequestBody(filters: FilterState): AnalyticsRequestBody {
    return {
        ano: [Number(filters.ano)],
        mes: filters.meses,
        periodo: filters.bimestre,
        dre: filters.dres,
        unidade: filters.ues,
        genero: filters.genero ? [filters.genero] : [],
        etapa_escolar: filters.etapas,
        idade: filters.idade,
        idade_em_meses: filters.menosDeUmAno,
    };
}

export function useAnalytics(filters: FilterState) {
    return useQuery<AnalyticsResponse, Error>({
        queryKey: [
            "analytics",
            filters.ano,
            filters.meses,
            filters.bimestre,
            filters.dres,
            filters.ues,
            filters.genero,
            filters.etapas,
            filters.idade,
            filters.menosDeUmAno,
        ],
        queryFn: async () => {
            const body = buildRequestBody(filters);
            const result = await getAnalytics(body);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });
}
