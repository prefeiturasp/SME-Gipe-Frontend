import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtualizarSecaoFinal } from "./useAtualizarSecaoFinal";
import * as atualizarSecaoFinalModule from "@/actions/atualizar-secao-final";

vi.mock("@/actions/atualizar-secao-final", () => ({
    atualizarSecaoFinal: vi.fn(),
}));

describe("useAtualizarSecaoFinal", () => {
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

    it("deve chamar atualizarSecaoFinal com os parâmetros corretos", async () => {
        const mockParams = {
            uuid: "test-uuid-123",
            body: {
                unidade_codigo_eol: "123456",
                dre_codigo_eol: "DRE-01",
                declarante: "declarante-uuid",
                comunicacao_seguranca_publica: "sim_gcm",
                protocolo_acionado: "ameaca",
            },
        };

        const mockResponse = {
            success: true,
            data: {
                uuid: "test-uuid-123",
                unidade_codigo_eol: "123456",
                dre_codigo_eol: "DRE-01",
                declarante_detalhes: {
                    uuid: "declarante-uuid",
                    declarante: "Diretor",
                },
                comunicacao_seguranca_publica: "sim_gcm",
                protocolo_acionado: "ameaca",
                status_display: "Em andamento",
                status_extra: "Pendente",
            },
        };

        vi.mocked(
            atualizarSecaoFinalModule.atualizarSecaoFinal
        ).mockResolvedValue(mockResponse as never);

        const { result } = renderHook(() => useAtualizarSecaoFinal(), {
            wrapper,
        });

        result.current.mutate(mockParams);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(
            atualizarSecaoFinalModule.atualizarSecaoFinal
        ).toHaveBeenCalledWith(mockParams);
        expect(result.current.data).toEqual(mockResponse);
    });

    it("deve retornar erro quando a mutation falhar", async () => {
        const mockParams = {
            uuid: "test-uuid-123",
            body: {
                unidade_codigo_eol: "123456",
                dre_codigo_eol: "DRE-01",
                declarante: "declarante-uuid",
                comunicacao_seguranca_publica: "sim_gcm",
                protocolo_acionado: "ameaca",
            },
        };

        const mockError = new Error("Erro ao atualizar");

        vi.mocked(
            atualizarSecaoFinalModule.atualizarSecaoFinal
        ).mockRejectedValue(mockError);

        const { result } = renderHook(() => useAtualizarSecaoFinal(), {
            wrapper,
        });

        result.current.mutate(mockParams);

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toEqual(mockError);
    });

    it("deve ter isPending como true durante a execução", async () => {
        const mockParams = {
            uuid: "test-uuid-123",
            body: {
                unidade_codigo_eol: "123456",
                dre_codigo_eol: "DRE-01",
                declarante: "declarante-uuid",
                comunicacao_seguranca_publica: "sim_gcm",
                protocolo_acionado: "ameaca",
            },
        };

        const mockSuccessResponse = {
            success: true,
            data: {} as never,
        };

        const delayedPromise = new Promise((resolve) =>
            setTimeout(() => resolve(mockSuccessResponse), 100)
        );

        vi.mocked(
            atualizarSecaoFinalModule.atualizarSecaoFinal
        ).mockReturnValue(delayedPromise as never);

        const { result } = renderHook(() => useAtualizarSecaoFinal(), {
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

    it("deve retornar resposta de erro quando success é false", async () => {
        const mockParams = {
            uuid: "test-uuid-123",
            body: {
                unidade_codigo_eol: "123456",
                dre_codigo_eol: "DRE-01",
                declarante: "declarante-uuid",
                comunicacao_seguranca_publica: "sim_gcm",
                protocolo_acionado: "ameaca",
            },
        };

        const mockErrorResponse = {
            success: false,
            error: "Erro ao atualizar seção final",
        };

        vi.mocked(
            atualizarSecaoFinalModule.atualizarSecaoFinal
        ).mockResolvedValue(mockErrorResponse as never);

        const { result } = renderHook(() => useAtualizarSecaoFinal(), {
            wrapper,
        });

        result.current.mutate(mockParams);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockErrorResponse);
    });
});
