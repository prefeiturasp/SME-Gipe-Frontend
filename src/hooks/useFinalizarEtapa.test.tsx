import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as finalizarEtapaModule from "@/actions/finalizar-etapa";
import { useFinalizarEtapa } from "./useFinalizarEtapa";

vi.mock("@/actions/finalizar-etapa", () => ({
    finalizarEtapa: vi.fn(),
}));

describe("useFinalizarEtapa", () => {
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
        ocorrenciaUuid: "uuid-123",
        body: {
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-01",
        },
    };

    it("deve chamar finalizarEtapa com os parâmetros corretos", async () => {
        const mockResponse = {
            success: true,
            data: {
                uuid: "uuid-123",
                responsavel_nome: "Fulano",
                responsavel_cpf: "12345678900",
                responsavel_email: "fulano@test.com",
                perfil_acesso: "diretor",
                unidade_codigo_eol: "123456",
                dre_codigo_eol: "DRE-01",
                nome_unidade: "Escola XPTO",
                nome_dre: "Diretoria X",
                finalizado_diretor_em: "2023-10-07",
                finalizado_diretor_por: "Fulano",
                protocolo_da_intercorrencia: "Protocolo X",
                status_display: "Finalizado",
                status_extra: "Nenhum",
            },
        };

        vi.mocked(finalizarEtapaModule.finalizarEtapa).mockResolvedValue(
            mockResponse as never,
        );

        const { result } = renderHook(() => useFinalizarEtapa(), { wrapper });

        result.current.mutate(mockParams);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(finalizarEtapaModule.finalizarEtapa).toHaveBeenCalledWith(
            mockParams.ocorrenciaUuid,
            mockParams.body,
        );
        expect(result.current.data).toEqual(mockResponse);
    });

    it("deve retornar erro quando a mutation falhar", async () => {
        const mockError = new Error("Erro ao finalizar etapa");

        vi.mocked(finalizarEtapaModule.finalizarEtapa).mockRejectedValue(
            mockError,
        );

        const { result } = renderHook(() => useFinalizarEtapa(), { wrapper });

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

        vi.mocked(finalizarEtapaModule.finalizarEtapa).mockReturnValue(
            delayedPromise as never,
        );

        const { result } = renderHook(() => useFinalizarEtapa(), { wrapper });

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
            error: "Erro ao finalizar",
        };

        vi.mocked(finalizarEtapaModule.finalizarEtapa).mockResolvedValue(
            mockErrorResponse as never,
        );

        const { result } = renderHook(() => useFinalizarEtapa(), { wrapper });

        result.current.mutate(mockParams);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockErrorResponse);
    });
});
