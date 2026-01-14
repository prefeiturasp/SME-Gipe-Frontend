import { inativarGestaoUsuarioAction } from "@/actions/inativar-gestao-usuario";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useInativarGestaoUsuario } from "./useInativarGestaoUsuario";

vi.mock("@/actions/inativar-gestao-usuario");

describe("useInativarGestaoUsuario hook", () => {
    const uuid = "user-uuid-123";
    const motivo_inativacao = "Motivo de inativação de teste";
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

    it("deve inativar usuário com sucesso", async () => {
        const mocked = vi.mocked(inativarGestaoUsuarioAction);
        mocked.mockResolvedValue({ success: true });
        const { result } = renderHook(() => useInativarGestaoUsuario(), {
            wrapper: createWrapper(),
        });
        let data;
        await act(async () => {
            data = await result.current.mutateAsync({ uuid, motivo_inativacao });
        });
        expect(inativarGestaoUsuarioAction).toHaveBeenCalledWith(uuid, motivo_inativacao);
        expect(data).toEqual({ success: true });
    });

    it("deve retornar erro ao inativar usuário", async () => {
        const mocked = vi.mocked(inativarGestaoUsuarioAction);
        mocked.mockResolvedValue({ success: false, error: "Erro ao inativar" });
        const { result } = renderHook(() => useInativarGestaoUsuario(), {
            wrapper: createWrapper(),
        });
        let data;
        await act(async () => {
            data = await result.current.mutateAsync({ uuid, motivo_inativacao });
        });
        expect(inativarGestaoUsuarioAction).toHaveBeenCalledWith(uuid, motivo_inativacao);
        expect(data).toEqual({ success: false, error: "Erro ao inativar" });
    });
});
