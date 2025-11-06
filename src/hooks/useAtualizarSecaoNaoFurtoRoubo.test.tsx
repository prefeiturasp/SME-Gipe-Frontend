import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useAtualizarSecaoNaoFurtoRoubo } from "./useAtualizarSecaoNaoFurtoRoubo";
import { atualizarSecaoNaoFurtoRoubo } from "@/actions/atualizar-secao-nao-furto-roubo";
import { SecaoNaoFurtoRouboBody } from "@/types/secao-nao-furto-roubo";

vi.mock("@/actions/atualizar-secao-nao-furto-roubo", () => ({
    atualizarSecaoNaoFurtoRoubo: vi.fn(),
}));

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

describe("useAtualizarSecaoNaoFurtoRoubo", () => {
    const mockUuid = "test-uuid-123";
    const mockBody: SecaoNaoFurtoRouboBody = {
        tipos_ocorrencia: ["tipo-1", "tipo-2"],
        descricao_ocorrencia: "Descrição da ocorrência",
        envolvido: "aluno",
        tem_info_agressor_ou_vitima: "sim",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve chamar atualizarSecaoNaoFurtoRoubo com sucesso", async () => {
        const mockResponse = {
            success: true as const,
            data: { uuid: mockUuid },
        };
        vi.mocked(atualizarSecaoNaoFurtoRoubo).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useAtualizarSecaoNaoFurtoRoubo(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(atualizarSecaoNaoFurtoRoubo).toHaveBeenCalledWith(
            mockUuid,
            mockBody
        );
        expect(result.current.data).toEqual(mockResponse);
    });

    it("deve tratar erro ao atualizar seção não furto e roubo", async () => {
        const mockError = {
            success: false as const,
            error: "Erro ao atualizar seção não furto e roubo",
        };
        vi.mocked(atualizarSecaoNaoFurtoRoubo).mockResolvedValue(mockError);

        const { result } = renderHook(() => useAtualizarSecaoNaoFurtoRoubo(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockError);
    });

    it("deve iniciar com estado idle", () => {
        const { result } = renderHook(() => useAtualizarSecaoNaoFurtoRoubo(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isPending).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isError).toBe(false);
    });

    it("deve mudar para estado de loading durante a mutação", async () => {
        const asyncOperation = new Promise<{
            success: true;
            data: { uuid: string };
        }>((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: { uuid: mockUuid },
                });
            }, 100);
        });

        vi.mocked(atualizarSecaoNaoFurtoRoubo).mockImplementation(
            () => asyncOperation
        );

        const { result } = renderHook(() => useAtualizarSecaoNaoFurtoRoubo(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        expect(result.current.isPending).toBe(true);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
});
