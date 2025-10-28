import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtualizarSecaoInicial } from "./useAtualizarSecaoInicial";
import * as atualizarSecaoInicialAction from "@/actions/atualizar-secao-inicial";
import { SecaoInicialBody } from "@/types/secao-inicial";

vi.mock("@/actions/atualizar-secao-inicial");

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

describe("useAtualizarSecaoInicial", () => {
    const mockUuid = "test-uuid-123";
    const mockBody: SecaoInicialBody = {
        data_ocorrencia: "2023-10-07",
        unidade_codigo_eol: "12345",
        dre_codigo_eol: "DRE-ABC",
        sobre_furto_roubo_invasao_depredacao: true,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve atualizar a seção inicial com sucesso", async () => {
        vi.spyOn(
            atualizarSecaoInicialAction,
            "atualizarSecaoInicial"
        ).mockResolvedValue({
            success: true,
            data: { uuid: mockUuid },
        });

        const { result } = renderHook(() => useAtualizarSecaoInicial(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual({
            success: true,
            data: { uuid: mockUuid },
        });
        expect(
            atualizarSecaoInicialAction.atualizarSecaoInicial
        ).toHaveBeenCalledWith(mockUuid, mockBody);
    });

    it("deve retornar erro quando a atualização falha", async () => {
        const errorMessage = "Erro ao atualizar ocorrência";
        vi.spyOn(
            atualizarSecaoInicialAction,
            "atualizarSecaoInicial"
        ).mockResolvedValue({
            success: false,
            error: errorMessage,
        });

        const { result } = renderHook(() => useAtualizarSecaoInicial(), {
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
            atualizarSecaoInicialAction,
            "atualizarSecaoInicial"
        ).mockRejectedValue(new Error("Network Error"));

        const { result } = renderHook(() => useAtualizarSecaoInicial(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe("Network Error");
    });
});
