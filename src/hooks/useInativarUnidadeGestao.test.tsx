import { inativarUnidadeGestaoAction } from "@/actions/inativar-unidade-gestao";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useInativarUnidadeGestao } from "./useInativarUnidadeGestao";

vi.mock("@/actions/inativar-unidade-gestao");

describe("useInativarUnidadeGestao hook", () => {
    const uuid = "unidade-uuid-123";
    let queryClient: QueryClient;
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

    it("deve inativar unidade com sucesso", async () => {
        const mocked = vi.mocked(inativarUnidadeGestaoAction);
        mocked.mockResolvedValue({ success: true });
        const { result } = renderHook(() => useInativarUnidadeGestao(), {
            wrapper: createWrapper(),
        });
        let data;
        await act(async () => {
            data = await result.current.mutateAsync(uuid);
        });
        expect(inativarUnidadeGestaoAction).toHaveBeenCalledWith(uuid);
        expect(data).toEqual({ success: true });
    });

    it("deve retornar erro ao inativar unidade", async () => {
        const mocked = vi.mocked(inativarUnidadeGestaoAction);
        mocked.mockResolvedValue({ success: false, error: "Erro ao inativar" });
        const { result } = renderHook(() => useInativarUnidadeGestao(), {
            wrapper: createWrapper(),
        });
        let data;
        await act(async () => {
            data = await result.current.mutateAsync(uuid);
        });
        expect(inativarUnidadeGestaoAction).toHaveBeenCalledWith(uuid);
        expect(data).toEqual({ success: false, error: "Erro ao inativar" });
    });
});
