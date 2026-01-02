import { reativarGestaoUsuarioAction } from "@/actions/reativar-gestao-usuario";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useReativarGestaoUsuario } from "./useReativarGestaoUsuario";

vi.mock("@/actions/reativar-gestao-usuario");

describe("useReativarGestaoUsuario hook", () => {
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

    it("deve reativar usuário com sucesso", async () => {
        const mocked = vi.mocked(reativarGestaoUsuarioAction);
        mocked.mockResolvedValue({ success: true });
        const { result } = renderHook(() => useReativarGestaoUsuario(), {
            wrapper: createWrapper(),
        });
        let data;
        await act(async () => {
            data = await result.current.mutateAsync(uuid);
        });
        expect(reativarGestaoUsuarioAction).toHaveBeenCalledWith(uuid);
        expect(data).toEqual({ success: true });
    });

    it("deve retornar erro ao reativar usuário", async () => {
        const mocked = vi.mocked(reativarGestaoUsuarioAction);
        mocked.mockResolvedValue({ success: false, error: "Erro ao reativar" });
        const { result } = renderHook(() => useReativarGestaoUsuario(), {
            wrapper: createWrapper(),
        });
        let data;
        await act(async () => {
            data = await result.current.mutateAsync(uuid);
        });
        expect(reativarGestaoUsuarioAction).toHaveBeenCalledWith(uuid);
        expect(data).toEqual({ success: false, error: "Erro ao reativar" });
    });
});
