import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtualizarOcorrenciaDre } from "./useAtualizarOcorrenciaDre";
import * as atualizarOcorrenciaDreAction from "@/actions/atualizar-ocorrencia-dre";
import { OcorrenciaDreBody } from "@/types/ocorrencia-dre";


vi.mock("@/actions/atualizar-ocorrencia-dre");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
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

describe("useAtualizarOcorrenciaDre", () => {
    const mockUuid = "test-uuid-123";
    const mockBody: OcorrenciaDreBody = {
        unidade_codigo_eol: "123456",
        dre_codigo_eol: "DRE-001",
        acionamento_seguranca_publica: true,
        interlocucao_sts: false,
        info_complementar_sts: "Informações adicionais STS",
        interlocucao_cpca: true,
        info_complementar_cpca: "Informações adicionais CPCA",
        interlocucao_supervisao_escolar: false,
        info_complementar_supervisao_escolar:
            "Informações adicionais Supervisão Escolar",
        interlocucao_naapa: true,
        info_complementar_naapa: "Informações adicionais NAAPA",
    };

    const mockResponse = {
            id: 1,
            uuid: mockUuid,
            status: "PENDENTE",
            status_display: "Pendente",
            status_extra: "Em andamento",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-001",
            acionamento_seguranca_publica: true,
            interlocucao_sts: false,
            info_complementar_sts: "Informações adicionais STS",
            interlocucao_cpca: true,
            info_complementar_cpca: "Informações adicionais CPCA",
            interlocucao_supervisao_escolar: false,
            info_complementar_supervisao_escolar:
                "Informações adicionais Supervisão Escolar",
            interlocucao_naapa: true,
            info_complementar_naapa: "Informações adicionais NAAPA",
        };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve atualizar a ocorrência DRE com sucesso", async () => {


        vi.spyOn(
            atualizarOcorrenciaDreAction,
            "atualizarOcorrenciaDre"
        ).mockResolvedValue({
            success: true,
            data: mockResponse,
        });

        const { result } = renderHook(() => useAtualizarOcorrenciaDre(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(
            { uuid: mockUuid, body: mockBody },
            {
                onSuccess: (response) => {
                    expect(response).toEqual(mockResponse);
                },
            }
        );

        await waitFor(() => {
            expect(
                atualizarOcorrenciaDreAction.atualizarOcorrenciaDre
            ).toHaveBeenCalledWith(mockUuid, mockBody);
        });
    });

    it("deve retornar erro quando a atualização falha", async () => {
        const errorMessage = "Erro ao atualizar ocorrência DRE";
        vi.spyOn(
            atualizarOcorrenciaDreAction,
            "atualizarOcorrenciaDre"
        ).mockResolvedValue({
            success: false,
            error: errorMessage,
        });

        const { result } = renderHook(() => useAtualizarOcorrenciaDre(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual({
            success: false,
            error: errorMessage,
        });
    });

    it("deve lidar com erro de rede", async () => {
        vi.spyOn(
            atualizarOcorrenciaDreAction,
            "atualizarOcorrenciaDre"
        ).mockRejectedValue(new Error("Network Error"));

        const { result } = renderHook(() => useAtualizarOcorrenciaDre(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe("Network Error");
    });

    it("deve chamar a mutation com os parâmetros corretos", async () => {
        const spy = vi.spyOn(
            atualizarOcorrenciaDreAction,
            "atualizarOcorrenciaDre"
        ).mockResolvedValue({
            success: true,
            data: mockResponse,
        });

        const { result } = renderHook(() => useAtualizarOcorrenciaDre(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith(mockUuid, mockBody);
        });
    });
});
