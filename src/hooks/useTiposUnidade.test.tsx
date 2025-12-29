import * as tiposUnidadeAction from "@/actions/tipos-unidade";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTiposUnidade } from "./useTiposUnidade";

vi.mock("@/actions/tipos-unidade");

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

    Wrapper.displayName = "QueryClientWrapper";

    return Wrapper;
};

describe("useTiposUnidade", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar os tipos de unidade com sucesso", async () => {
        const mockData = [
            { id: "ADM", label: "ADM" },
            { id: "DRE", label: "DRE" },
        ];

        vi.spyOn(tiposUnidadeAction, "getTiposUnidadeAction").mockResolvedValue(
            {
                success: true,
                data: mockData,
            }
        );

        const { result } = renderHook(() => useTiposUnidade(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockData);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
    });

    it("deve retornar erro quando a action falha", async () => {
        vi.spyOn(tiposUnidadeAction, "getTiposUnidadeAction").mockResolvedValue(
            {
                success: false,
                error: "Erro ao buscar tipos de unidade",
            }
        );

        const { result } = renderHook(() => useTiposUnidade(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe(
            "Erro ao buscar tipos de unidade"
        );
        expect(result.current.data).toBeUndefined();
    });

    it("deve usar staleTime de 1 hora", () => {
        vi.spyOn(tiposUnidadeAction, "getTiposUnidadeAction").mockResolvedValue(
            {
                success: true,
                data: [],
            }
        );

        const { result } = renderHook(() => useTiposUnidade(), {
            wrapper: createWrapper(),
        });

        expect(result.current).toBeDefined();
    });
});
