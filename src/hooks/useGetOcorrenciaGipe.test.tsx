import { obterOcorrenciaGipe } from "@/actions/obter-ocorrencia-gipe";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { useGetOcorrenciaGipe } from "./useGetOcorrenciaGipe";

vi.mock("@/actions/obter-ocorrencia-gipe");

const obterOcorrenciaGipeMock = obterOcorrenciaGipe as Mock;

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    Wrapper.displayName = "QueryClientProvider";
    return Wrapper;
};

describe("useGetOcorrenciaGipe", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("não deve chamar a action se o UUID não estiver definido", () => {
        renderHook(() => useGetOcorrenciaGipe(""), {
            wrapper: createWrapper(),
        });

        expect(obterOcorrenciaGipeMock).not.toHaveBeenCalled();
    });

    it("deve chamar a action com o UUID correto e retornar os dados", async () => {
        const mockData = {
            id: 1,
            uuid: "gipe-123-ocorrencia-456",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "presencialmente",
            envolvido: "env-uuid-123",
            motivacao_ocorrencia: ["bullying", "racismo"],
            tipos_ocorrencia: ["tipo-uuid-1"],
            tipos_ocorrencia_detalhes: [
                {
                    uuid: "tipo-uuid-1",
                    nome: "Tipo A",
                },
            ],
            etapa_escolar: "alfabetizacao",
            info_sobre_interacoes_virtuais_pessoa_agressora:
                "Informações sobre interações virtuais",
            encaminhamentos_gipe: "Encaminhamentos realizados",
        };
        obterOcorrenciaGipeMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const uuid = "gipe-123-ocorrencia-456";
        const { result } = renderHook(() => useGetOcorrenciaGipe(uuid), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(obterOcorrenciaGipeMock).toHaveBeenCalledWith(uuid);
        expect(result.current.data).toEqual(mockData);
    });

    it("deve retornar erro quando a busca falha", async () => {
        const errorMessage = "Erro ao obter ocorrência GIPE";
        obterOcorrenciaGipeMock.mockResolvedValue({
            success: false,
            error: errorMessage,
        });

        const uuid = "gipe-123-ocorrencia-456";
        const { result } = renderHook(() => useGetOcorrenciaGipe(uuid), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe(errorMessage);
    });

    it("deve lidar com erro de rede", async () => {
        obterOcorrenciaGipeMock.mockRejectedValue(new Error("Network Error"));

        const uuid = "gipe-123-ocorrencia-456";
        const { result } = renderHook(() => useGetOcorrenciaGipe(uuid), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe("Network Error");
    });

    it("deve respeitar as opções personalizadas passadas", async () => {
        const mockData = {
            id: 1,
            uuid: "gipe-123-ocorrencia-456",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "presencialmente",
            envolvido: "env-uuid-123",
            motivacao_ocorrencia: ["bullying"],
            tipos_ocorrencia: ["tipo-uuid-1"],
            tipos_ocorrencia_detalhes: [
                {
                    uuid: "tipo-uuid-1",
                    nome: "Tipo A",
                },
            ],
            etapa_escolar: "alfabetizacao",
            info_sobre_interacoes_virtuais_pessoa_agressora: "",
            encaminhamentos_gipe: "Encaminhamentos",
        };
        obterOcorrenciaGipeMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const uuid = "gipe-123-ocorrencia-456";
        const { result } = renderHook(
            () =>
                useGetOcorrenciaGipe(uuid, {
                    enabled: false,
                }),
            {
                wrapper: createWrapper(),
            },
        );

        // Como enabled é false, a query não deve ser executada
        expect(result.current.isFetching).toBe(false);
        expect(obterOcorrenciaGipeMock).not.toHaveBeenCalled();
    });

    it("deve usar a queryKey correta", async () => {
        const mockData = {
            id: 1,
            uuid: "gipe-123-ocorrencia-456",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "presencialmente",
            envolvido: "env-uuid-123",
            motivacao_ocorrencia: ["bullying"],
            tipos_ocorrencia: ["tipo-uuid-1"],
            tipos_ocorrencia_detalhes: [
                {
                    uuid: "tipo-uuid-1",
                    nome: "Tipo A",
                },
            ],
            etapa_escolar: "alfabetizacao",
            info_sobre_interacoes_virtuais_pessoa_agressora: "",
            encaminhamentos_gipe: "Encaminhamentos",
        };
        obterOcorrenciaGipeMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const uuid = "gipe-123-ocorrencia-456";
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });

        const Wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );

        renderHook(() => useGetOcorrenciaGipe(uuid), {
            wrapper: Wrapper,
        });

        await waitFor(() => {
            const queryData = queryClient.getQueryData([
                "ocorrencia-gipe",
                uuid,
            ]);
            expect(queryData).toBeDefined();
        });
    });
});
