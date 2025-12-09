import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useExcluirAnexo } from "./useExcluirAnexo";
import * as excluirAction from "@/actions/excluir-anexo";

vi.mock("@/actions/excluir-anexo");

const createWrapper = (queryClient: QueryClient) => {
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    return Wrapper;
};

describe("useExcluirAnexo", () => {
    const mockUuid = "arquivo-123";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve chamar excluirAnexo e invalidar a query 'anexos'", async () => {
        // Mock da função action
        vi.spyOn(excluirAction, "excluirAnexo").mockResolvedValue({
            success: true,
        });

        const queryClient = new QueryClient();
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const wrapper = createWrapper(queryClient);

        const { result } = renderHook(() => useExcluirAnexo(), { wrapper });

        result.current.mutate(mockUuid);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(excluirAction.excluirAnexo).toHaveBeenCalledWith(mockUuid);
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["anexos"] });
    });
    it("deve retornar erro quando a exclusão falha", async () => {
        const errorMessage = "Erro ao excluir arquivo.";

        vi.spyOn(excluirAction, "excluirAnexo").mockResolvedValue({
            success: false,
            error: errorMessage,
        });

        const wrapper = createWrapper(new QueryClient());

        const { result } = renderHook(() => useExcluirAnexo(), {
            wrapper,
        });

        result.current.mutate(mockUuid);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual({
            success: false,
            error: errorMessage,
        });
    });

    it("deve lidar com erro de rede", async () => {
        vi.spyOn(excluirAction, "excluirAnexo").mockRejectedValue(
            new Error("Network Error")
        );

        const wrapper = createWrapper(new QueryClient());

        const { result } = renderHook(() => useExcluirAnexo(), {
            wrapper,
        });

        result.current.mutate(mockUuid);

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe("Network Error");
    });
});
