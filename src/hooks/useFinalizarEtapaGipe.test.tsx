import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as finalizarEtapaModule from "@/actions/finalizar-etapa-gipe";
import { useFinalizarEtapaGipe } from "./useFinalizarEtapaGipe";

vi.mock("@/actions/finalizar-etapa-gipe", () => ({
    finalizarEtapaGipe: vi.fn(),
}));

describe("useFinalizarEtapaGipe", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        vi.clearAllMocks();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    const mockParams = {
        ocorrenciaUuid: "uuid-999",
        body: {
            unidade_codigo_eol: "777",
            dre_codigo_eol: "DR-02",
        },
    };

    it("deve chamar finalizarEtapaGipe com os parâmetros corretos", async () => {
        const mockResponse = {
            success: true,
            data: {
                protocolo_da_intercorrencia: "PROTO-ABC",
            },
        };

        vi.mocked(finalizarEtapaModule.finalizarEtapaGipe).mockResolvedValue(
            mockResponse as never,
        );

        const { result } = renderHook(() => useFinalizarEtapaGipe(), {
            wrapper,
        });

        result.current.mutate(mockParams);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(finalizarEtapaModule.finalizarEtapaGipe).toHaveBeenCalledWith(
            mockParams.ocorrenciaUuid,
            mockParams.body,
        );
        expect(result.current.data).toEqual(mockResponse);
    });

    it("deve retornar erro quando a mutation falhar", async () => {
        const mockError = new Error("Erro ao finalizar etapa GIPE");

        vi.mocked(finalizarEtapaModule.finalizarEtapaGipe).mockRejectedValue(
            mockError,
        );

        const { result } = renderHook(() => useFinalizarEtapaGipe(), {
            wrapper,
        });

        result.current.mutate(mockParams);

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toEqual(mockError);
    });

    it("deve ter isPending como true durante execução", async () => {
        const delayedPromise = new Promise((resolve) =>
            setTimeout(() => resolve({ success: true, data: {} }), 150),
        );

        vi.mocked(finalizarEtapaModule.finalizarEtapaGipe).mockReturnValue(
            delayedPromise as never,
        );

        const { result } = renderHook(() => useFinalizarEtapaGipe(), {
            wrapper,
        });

        result.current.mutate(mockParams);

        await waitFor(() => {
            expect(result.current.isPending).toBe(true);
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });
    });

    it("deve retornar response de erro quando success = false", async () => {
        const mockErrorResponse = {
            success: false,
            error: "Falha ao finalizar etapa GIPE",
        };

        vi.mocked(finalizarEtapaModule.finalizarEtapaGipe).mockResolvedValue(
            mockErrorResponse as never,
        );

        const { result } = renderHook(() => useFinalizarEtapaGipe(), {
            wrapper,
        });

        result.current.mutate(mockParams);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockErrorResponse);
    });
});
