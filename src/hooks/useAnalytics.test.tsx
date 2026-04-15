import type { AnalyticsResponse } from "@/actions/analytics";
import * as analyticsAction from "@/actions/analytics";
import {
    filterStateInitial,
    type FilterState,
} from "@/components/dashboard/ExtracaoDados/FilterPanel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAnalytics } from "./useAnalytics";

vi.mock("@/actions/analytics");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    Wrapper.displayName = "QueryClientWrapper";
    return Wrapper;
};

const mockAnalyticsData: AnalyticsResponse = {
    intercorrencias_dre: [
        {
            codigo_eol: "108501",
            total: 5,
            patrimonial: 2,
            interpessoal: 3,
        },
    ],
    intercorrencias_status: [],
    evolucao_mensal: [],
    intercorrencias_tipos: {
        patrimonial: {},
        interpessoal: {},
    },
    total_por_motivo: {},
    cards: [
        { total_intercorrencia: 5 },
        { intercorrencias_patrimoniais: 2 },
        { intercorrencias_interpessoais: 3 },
        { media_mensal: 1 },
    ],
};

describe("useAnalytics", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar dados analíticos com sucesso", async () => {
        vi.spyOn(analyticsAction, "getAnalytics").mockResolvedValue({
            success: true,
            data: mockAnalyticsData,
        });

        const { result } = renderHook(() => useAnalytics(filterStateInitial), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockAnalyticsData);
        expect(analyticsAction.getAnalytics).toHaveBeenCalledWith({
            ano: [Number(filterStateInitial.ano)],
            mes: [],
            periodo: [],
            dre: [],
            unidade: [],
            genero: [],
            etapa_escolar: [],
            idade: "",
            idade_em_meses: false,
        });
    });

    it("deve lançar erro quando a action retorna falha", async () => {
        vi.spyOn(analyticsAction, "getAnalytics").mockResolvedValue({
            success: false,
            error: "Erro ao buscar dados",
        });

        const { result } = renderHook(() => useAnalytics(filterStateInitial), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error?.message).toBe("Erro ao buscar dados");
    });

    it("deve mapear filtros corretamente para o body da requisição", async () => {
        vi.spyOn(analyticsAction, "getAnalytics").mockResolvedValue({
            success: true,
            data: mockAnalyticsData,
        });

        const filters: FilterState = {
            ano: "2025",
            meses: ["01", "02"],
            bimestre: ["1"],
            dres: ["uuid-dre-1"],
            ues: ["uuid-ue-1"],
            genero: "masculino",
            etapas: ["ensino-fundamental"],
            idade: "11",
            menosDeUmAno: false,
        };

        const { result } = renderHook(() => useAnalytics(filters), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(analyticsAction.getAnalytics).toHaveBeenCalledWith({
            ano: [2025],
            mes: ["01", "02"],
            periodo: [1],
            dre: ["uuid-dre-1"],
            unidade: ["uuid-ue-1"],
            genero: ["masculino"],
            etapa_escolar: ["ensino-fundamental"],
            idade: "11",
            idade_em_meses: false,
        });
    });

    it("deve enviar genero como array vazio quando não selecionado", async () => {
        vi.spyOn(analyticsAction, "getAnalytics").mockResolvedValue({
            success: true,
            data: mockAnalyticsData,
        });

        const filters: FilterState = {
            ...filterStateInitial,
            genero: "",
        };

        const { result } = renderHook(() => useAnalytics(filters), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(analyticsAction.getAnalytics).toHaveBeenCalledWith(
            expect.objectContaining({ genero: [] }),
        );
    });
});
