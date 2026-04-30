import { obterOcorrenciaDre } from "@/actions/obter-ocorrencia-dre";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { useGetOcorrenciaDre } from "./useGetOcorrenciaDre";

vi.mock("@/actions/obter-ocorrencia-dre");

const obterOcorrenciaDreMock = obterOcorrenciaDre as Mock;

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

describe("useGetOcorrenciaDre", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("não deve chamar a action se o UUID não estiver definido", () => {
        renderHook(() => useGetOcorrenciaDre(""), { wrapper: createWrapper() });

        expect(obterOcorrenciaDreMock).not.toHaveBeenCalled();
    });

    it("deve chamar a action com o UUID correto e retornar os dados", async () => {
        const mockData = {
            id: 1,
            uuid: "dre-123-ocorrencia-456",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            quais_orgaos_acionados_dre: [
                "comunicacao_gcm_ronda_escolar",
                "comunicacao_gipe",
            ],
        };
        obterOcorrenciaDreMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const uuid = "dre-123-ocorrencia-456";
        const { result } = renderHook(() => useGetOcorrenciaDre(uuid), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(obterOcorrenciaDreMock).toHaveBeenCalledWith(uuid);
        expect(result.current.data).toEqual(mockData);
    });

    it("deve retornar erro quando a busca falha", async () => {
        const errorMessage = "Erro ao obter ocorrência DRE";
        obterOcorrenciaDreMock.mockResolvedValue({
            success: false,
            error: errorMessage,
        });

        const uuid = "dre-123-ocorrencia-456";
        const { result } = renderHook(() => useGetOcorrenciaDre(uuid), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe(errorMessage);
    });

    it("deve lidar com erro de rede", async () => {
        obterOcorrenciaDreMock.mockRejectedValue(new Error("Network Error"));

        const uuid = "dre-123-ocorrencia-456";
        const { result } = renderHook(() => useGetOcorrenciaDre(uuid), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe("Network Error");
    });
});
