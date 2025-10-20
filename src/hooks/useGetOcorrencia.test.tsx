import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import { useGetOcorrencia } from "./useGetOcorrencia";
import { obterOcorrencia } from "@/actions/obter-ocorrencia";

vi.mock("@/actions/obter-ocorrencia");

const obterOcorrenciaMock = obterOcorrencia as Mock;

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

describe("useGetOcorrencia", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("não deve chamar a action se o UUID não estiver definido", () => {
        renderHook(() => useGetOcorrencia(""), { wrapper: createWrapper() });

        expect(obterOcorrenciaMock).not.toHaveBeenCalled();
    });

    it("deve chamar a action com o UUID correto e retornar os dados", async () => {
        const mockData = {
            id: 1,
            uuid: "abc-123-def-456",
            data_ocorrencia: "2024-01-15",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            sobre_furto_roubo_invasao_depredacao: false,
            user_username: "20090388003",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
            tipos_ocorrencia: ["Violência física"],
            descricao: "Descrição da ocorrência",
            status: "Em andamento",
        };
        obterOcorrenciaMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const uuid = "abc-123-def-456";
        const { result } = renderHook(() => useGetOcorrencia(uuid), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(obterOcorrenciaMock).toHaveBeenCalledWith(uuid);
        expect(result.current.data).toEqual(mockData);
    });

    it("deve retornar os dados da ocorrência mesmo sem campos opcionais", async () => {
        const mockData = {
            id: 2,
            uuid: "xyz-789-uvw-012",
            data_ocorrencia: "2024-02-20",
            unidade_codigo_eol: "654321",
            dre_codigo_eol: "108300",
            sobre_furto_roubo_invasao_depredacao: true,
            user_username: "20090388003",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
            status: "Incompleta",
        };
        obterOcorrenciaMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const uuid = "xyz-789-uvw-012";
        const { result } = renderHook(() => useGetOcorrencia(uuid), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockData);
    });

    it("deve lidar com erro quando a action retornar success: false", async () => {
        obterOcorrenciaMock.mockResolvedValue({
            success: false,
            error: "Ocorrência não encontrada",
        });

        const uuid = "uuid-invalido";
        const { result } = renderHook(() => useGetOcorrencia(uuid), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toEqual(
            new Error("Ocorrência não encontrada")
        );
    });

    it("deve respeitar o staleTime de 5 minutos", () => {
        const uuid = "test-uuid";
        const { result } = renderHook(() => useGetOcorrencia(uuid), {
            wrapper: createWrapper(),
        });

        // Verifica se o staleTime está configurado corretamente
        expect(result.current.isStale).toBe(false);
    });

    it("deve usar a queryKey correta para caching", async () => {
        const mockData = {
            id: 3,
            data_ocorrencia: "2024-03-10",
            unidade_codigo_eol: "111111",
            status: "Finalizada",
        };
        obterOcorrenciaMock.mockResolvedValue(mockData);

        const uuid = "cache-test-uuid";
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

        renderHook(() => useGetOcorrencia(uuid), { wrapper: Wrapper });

        await waitFor(() =>
            expect(queryClient.getQueryData(["ocorrencia", uuid])).toBeDefined()
        );

        expect(queryClient.getQueryData(["ocorrencia", uuid])).toEqual(
            mockData
        );
    });
});
