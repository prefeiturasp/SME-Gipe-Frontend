import { reativarUnidadeGestaoAction } from "@/actions/reativar-unidade-gestao";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useReativarUnidadeGestao } from "./useReativarUnidadeGestao";

vi.mock("@/actions/reativar-unidade-gestao");

describe("useReativarUnidadeGestao hook", () => {
    const uuid = "unidade-uuid-123";
    let queryClient: QueryClient;
    const motivo_reativacao = "Motivo de reativação de teste";
    const createWrapper = () => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        const Wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
        Wrapper.displayName = "QueryClientTestWrapper";
        return Wrapper;
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve reativar unidade com sucesso", async () => {
        const mocked = vi.mocked(reativarUnidadeGestaoAction);
        mocked.mockResolvedValue({ success: true });
        const { result } = renderHook(() => useReativarUnidadeGestao(), {
            wrapper: createWrapper(),
        });
        let data;
        await act(async () => {
            data = await result.current.mutateAsync({
                uuid,
                motivo_reativacao,
            });
        });
        expect(reativarUnidadeGestaoAction).toHaveBeenCalledWith(
            uuid,
            motivo_reativacao,
        );
        expect(data).toEqual({ success: true });
    });

    it("deve retornar erro ao reativar unidade", async () => {
        const mocked = vi.mocked(reativarUnidadeGestaoAction);
        mocked.mockResolvedValue({ success: false, error: "Erro ao reativar" });
        const { result } = renderHook(() => useReativarUnidadeGestao(), {
            wrapper: createWrapper(),
        });
        let data;
        await act(async () => {
            data = await result.current.mutateAsync({
                uuid,
                motivo_reativacao,
            });
        });
        expect(reativarUnidadeGestaoAction).toHaveBeenCalledWith(
            uuid,
            motivo_reativacao,
        );
        expect(data).toEqual({ success: false, error: "Erro ao reativar" });
    });
});
