import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtualizarSecaoFurtoRoubo } from "./useAtualizarSecaoFurtoRoubo";
import * as atualizarSecaoFurtoRouboAction from "@/actions/atualizar-secao-furto-roubo";
import { SecaoFurtoRouboBody } from "@/types/secao-furto-roubo";

vi.mock("@/actions/atualizar-secao-furto-roubo");

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

describe("useAtualizarSecaoFurtoRoubo", () => {
    const mockUuid = "test-uuid-123";
    const mockBody: SecaoFurtoRouboBody = {
        tipos_ocorrencia: ["tipo-uuid-1", "tipo-uuid-2"],
        descricao_ocorrencia: "Descrição da ocorrência",
        smart_sampa_situacao: "sim_com_dano",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve atualizar a seção de furto e roubo com sucesso", async () => {
        const mockResponse = {
            uuid: mockUuid,
            tipos_ocorrencia_detalhes: [
                { uuid: "tipo-uuid-1", nome: "Furto" },
                { uuid: "tipo-uuid-2", nome: "Roubo" },
            ],
            descricao_ocorrencia: "Descrição da ocorrência",
            smart_sampa_situacao: "sim_com_dano" as const,
            status_display: "Em andamento",
            status_extra: "Aguardando análise",
        };

        vi.spyOn(
            atualizarSecaoFurtoRouboAction,
            "atualizarSecaoFurtoRoubo"
        ).mockResolvedValue({
            success: true,
            data: mockResponse,
        });

        const { result } = renderHook(() => useAtualizarSecaoFurtoRoubo(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual({
            success: true,
            data: mockResponse,
        });
        expect(
            atualizarSecaoFurtoRouboAction.atualizarSecaoFurtoRoubo
        ).toHaveBeenCalledWith(mockUuid, mockBody);
    });

    it("deve retornar erro quando a atualização falha", async () => {
        const errorMessage = "Erro ao atualizar seção de furto e roubo";
        vi.spyOn(
            atualizarSecaoFurtoRouboAction,
            "atualizarSecaoFurtoRoubo"
        ).mockResolvedValue({
            success: false,
            error: errorMessage,
        });

        const { result } = renderHook(() => useAtualizarSecaoFurtoRoubo(), {
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
            atualizarSecaoFurtoRouboAction,
            "atualizarSecaoFurtoRoubo"
        ).mockRejectedValue(new Error("Network Error"));

        const { result } = renderHook(() => useAtualizarSecaoFurtoRoubo(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe("Network Error");
    });
});
