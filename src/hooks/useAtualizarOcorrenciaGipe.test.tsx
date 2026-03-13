import * as atualizarOcorrenciaGipeAction from "@/actions/atualizar-ocorrencia-gipe";
import { OcorrenciaGipeBody } from "@/types/ocorrencia-gipe";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAtualizarOcorrenciaGipe } from "./useAtualizarOcorrenciaGipe";

vi.mock("@/actions/atualizar-ocorrencia-gipe");

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

describe("useAtualizarOcorrenciaGipe", () => {
    const mockUuid = "test-uuid-123";
    const mockBody: OcorrenciaGipeBody = {
        unidade_codigo_eol: "200237",
        dre_codigo_eol: "108500",
        envolve_arma_ataque: "sim",
        ameaca_realizada_qual_maneira: "virtualmente",
        envolvido: "214e18a2-1599-4396-877f-70ea526d36a0",
        motivacao_ocorrencia: ["bullying"],
        tipos_ocorrencia: ["001c9106-7cbd-4cb8-8658-ae9b7b0aaf34"],
        etapa_escolar: "alfabetizacao",
        info_sobre_interacoes_virtuais_pessoa_agressora: "",
        encaminhamentos_gipe: "teste encaminhamento",
    };

    const mockResponse = {
        id: 1,
        uuid: mockUuid,
        status: "PENDENTE",
        status_display: "Pendente",
        status_extra: "Em andamento",
        unidade_codigo_eol: "200237",
        dre_codigo_eol: "108500",
        envolve_arma_ataque: "sim",
        ameaca_realizada_qual_maneira: "virtualmente",
        envolvido: "214e18a2-1599-4396-877f-70ea526d36a0",
        motivacao_ocorrencia: ["bullying"],
        tipos_ocorrencia: ["001c9106-7cbd-4cb8-8658-ae9b7b0aaf34"],
        etapa_escolar: "alfabetizacao",
        info_sobre_interacoes_virtuais_pessoa_agressora: "",
        encaminhamentos_gipe: "teste encaminhamento",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve atualizar a ocorrência GIPE com sucesso", async () => {
        vi.spyOn(
            atualizarOcorrenciaGipeAction,
            "atualizarOcorrenciaGipe",
        ).mockResolvedValue({
            success: true,
            data: mockResponse,
        });

        const { result } = renderHook(() => useAtualizarOcorrenciaGipe(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(
            { uuid: mockUuid, body: mockBody },
            {
                onSuccess: (response) => {
                    expect(response).toEqual(mockResponse);
                },
            },
        );

        await waitFor(() => {
            expect(
                atualizarOcorrenciaGipeAction.atualizarOcorrenciaGipe,
            ).toHaveBeenCalledWith(mockUuid, mockBody);
        });
    });

    it("deve retornar erro quando a atualização falha", async () => {
        const errorMessage = "Erro ao atualizar ocorrência GIPE";
        vi.spyOn(
            atualizarOcorrenciaGipeAction,
            "atualizarOcorrenciaGipe",
        ).mockResolvedValue({
            success: false,
            error: errorMessage,
        });

        const { result } = renderHook(() => useAtualizarOcorrenciaGipe(), {
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
            atualizarOcorrenciaGipeAction,
            "atualizarOcorrenciaGipe",
        ).mockRejectedValue(new Error("Network Error"));

        const { result } = renderHook(() => useAtualizarOcorrenciaGipe(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe("Network Error");
    });

    it("deve chamar a mutation com os parâmetros corretos", async () => {
        const spy = vi
            .spyOn(atualizarOcorrenciaGipeAction, "atualizarOcorrenciaGipe")
            .mockResolvedValue({
                success: true,
                data: mockResponse,
            });

        const { result } = renderHook(() => useAtualizarOcorrenciaGipe(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith(mockUuid, mockBody);
        });
    });
});
