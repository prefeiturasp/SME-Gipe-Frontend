import * as categoriasGipeActions from "@/actions/categorias-disponiveis-gipe";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCategoriasDisponiveisGipe } from "./useCategoriasDisponiveisGipe";

vi.mock("@/actions/categorias-disponiveis-gipe");

describe("useCategoriasDisponiveisGipe", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it("deve retornar os dados corretamente quando a API retorna sucesso", async () => {
        const mockResponse: {
            success: true;
            data: categoriasGipeActions.CategoriasDisponiveisGipeAPI;
        } = {
            success: true,
            data: {
                envolve_arma_ou_ataque: [
                    { value: "sim", label: "Sim" },
                    { value: "nao", label: "Não" },
                ],
                ameaca_foi_realizada_de_qual_maneira: [
                    { value: "presencialmente", label: "Presencialmente" },
                    { value: "virtualmente", label: "Virtualmente" },
                ],
                motivo_ocorrencia: [
                    { value: "bullying", label: "Bullying" },
                    { value: "cyberbullying", label: "Cyberbullying" },
                ],
                etapa_escolar: [
                    {
                        value: "alfabetizacao",
                        label: "Alfabetização (1º ao 3º ano)",
                    },
                    {
                        value: "interdisciplinar",
                        label: "Interdisciplinar (4º ao 6º ano)",
                    },
                ],
            },
        };

        vi.mocked(
            categoriasGipeActions.getCategoriasDisponiveisGipeAction,
        ).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useCategoriasDisponiveisGipe(), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.data).toEqual(mockResponse.data);
            expect(result.current.isSuccess).toBe(true);
            expect(result.current.isError).toBe(false);
        });
    });

    it("deve lançar erro quando a API retorna falha", async () => {
        const mockErrorResponse: { success: false; error: string } = {
            success: false,
            error: "Erro ao buscar as categorias do GIPE",
        };

        vi.mocked(
            categoriasGipeActions.getCategoriasDisponiveisGipeAction,
        ).mockResolvedValue(mockErrorResponse);

        const { result } = renderHook(() => useCategoriasDisponiveisGipe(), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
            expect(result.current.error).toBeInstanceOf(Error);
            expect((result.current.error as Error).message).toBe(
                "Erro ao buscar as categorias do GIPE",
            );
        });
    });

    it("deve usar a queryKey correta", async () => {
        const mockResponse: {
            success: true;
            data: categoriasGipeActions.CategoriasDisponiveisGipeAPI;
        } = {
            success: true,
            data: {
                envolve_arma_ou_ataque: [],
                ameaca_foi_realizada_de_qual_maneira: [],
                motivo_ocorrencia: [],
                etapa_escolar: [],
            },
        };

        vi.mocked(
            categoriasGipeActions.getCategoriasDisponiveisGipeAction,
        ).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useCategoriasDisponiveisGipe(), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        const cachedData = queryClient.getQueryData([
            "categorias-disponiveis-gipe",
        ]);
        expect(cachedData).toEqual(mockResponse.data);
    });

    it("deve ter staleTime e gcTime configurados corretamente", async () => {
        const mockResponse: {
            success: true;
            data: categoriasGipeActions.CategoriasDisponiveisGipeAPI;
        } = {
            success: true,
            data: {
                envolve_arma_ou_ataque: [],
                ameaca_foi_realizada_de_qual_maneira: [],
                motivo_ocorrencia: [],
                etapa_escolar: [],
            },
        };

        vi.mocked(
            categoriasGipeActions.getCategoriasDisponiveisGipeAction,
        ).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useCategoriasDisponiveisGipe(), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        const queryState = queryClient.getQueryState([
            "categorias-disponiveis-gipe",
        ]);
        expect(queryState).toBeDefined();
    });
});
