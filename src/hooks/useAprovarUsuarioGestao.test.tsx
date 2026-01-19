import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAprovarUsuarioGestao } from "./useAprovarUsuarioGestao";
import { aprovarUsuarioGestao } from "@/actions/aprovar-usuario-gestao";

vi.mock("@/actions/aprovar-usuario-gestao");

describe("useAprovarUsuarioGestao hook", () => {
    const uuid = "user-uuid-123";
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

    it("deve aprovar usuário com sucesso", async () => {
        const mocked = vi.mocked(aprovarUsuarioGestao);
        mocked.mockResolvedValue({ success: true });
        const { result } = renderHook(() => useAprovarUsuarioGestao(), {
            wrapper: createWrapper(),
        });
        let data;
        await act(async () => {
            data = await result.current.mutateAsync(uuid);
        });
        expect(aprovarUsuarioGestao).toHaveBeenCalledWith(uuid);
        expect(data).toEqual({ success: true });
    });

    it("deve retornar erro ao aprovar usuário", async () => {
        const mocked = vi.mocked(aprovarUsuarioGestao);
        mocked.mockResolvedValue({ success: false, error: "Erro ao aprovar" });
        const { result } = renderHook(() => useAprovarUsuarioGestao(), {
            wrapper: createWrapper(),
        });
        let data;
        await act(async () => {
            data = await result.current.mutateAsync(uuid);
        });
        expect(aprovarUsuarioGestao).toHaveBeenCalledWith(uuid);
        expect(data).toEqual({ success: false, error: "Erro ao aprovar" });
    });
});
