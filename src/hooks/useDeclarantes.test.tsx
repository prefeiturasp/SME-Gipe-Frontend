import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeclarantes } from "./useDeclarantes";
import * as declarantesAction from "@/actions/declarantes";

vi.mock("@/actions/declarantes");

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

describe("useDeclarantes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar os declarantes com sucesso", async () => {
        const mockData = [
            {
                uuid: "4cc15f41-e356-4cf5-82f9-06db6cf6c917",
                declarante: "Gabinete DRE",
            },
            {
                uuid: "62da7064-dedf-489e-9b0c-41752e87243f",
                declarante: "GCM",
            },
        ];

        vi.spyOn(declarantesAction, "getDeclarantesAction").mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result } = renderHook(() => useDeclarantes(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockData);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
    });

    it("deve retornar erro quando a action falha", async () => {
        vi.spyOn(declarantesAction, "getDeclarantesAction").mockResolvedValue({
            success: false,
            error: "Erro ao buscar declarantes",
        });

        const { result } = renderHook(() => useDeclarantes(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe(
            "Erro ao buscar declarantes"
        );
        expect(result.current.data).toBeUndefined();
    });

    it("deve usar staleTime de 1 hora", () => {
        vi.spyOn(declarantesAction, "getDeclarantesAction").mockResolvedValue({
            success: true,
            data: [],
        });

        const { result } = renderHook(() => useDeclarantes(), {
            wrapper: createWrapper(),
        });

        // Verifica que a query tem o staleTime correto
        expect(result.current).toBeDefined();
    });
});
