import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRecusarUsuarioGestao } from "./useRecusarUsuarioGestao";
import { recusarUsuarioGestao } from "@/actions/recusar-usuario-gestao";
import { vi, Mock } from "vitest";

vi.mock("@/actions/recusar-usuario-gestao");

const mockRecusarUsuarioGestao = recusarUsuarioGestao as unknown as Mock;

describe("useRecusarUsuarioGestao", () => {
    const uuid = "uuid-123";
    const justificativa = "Motivo de recusa";
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

    it("deve chamar a action recusarUsuarioGestao com os parâmetros corretos", async () => {
        mockRecusarUsuarioGestao.mockResolvedValueOnce({ success: true });
        const { result } = renderHook(() => useRecusarUsuarioGestao(), {
            wrapper: createWrapper(),
        });

        let response;
        await act(async () => {
            response = await result.current.mutateAsync({
                uuid,
                justificativa,
            });
        });

        expect(mockRecusarUsuarioGestao).toHaveBeenCalledWith(
            uuid,
            justificativa
        );
        expect(response).toEqual({ success: true });
    });

    it("deve retornar erro ao recusar usuário", async () => {
        mockRecusarUsuarioGestao.mockResolvedValueOnce({
            success: false,
            error: "Erro ao recusar",
        });
        const { result } = renderHook(() => useRecusarUsuarioGestao(), {
            wrapper: createWrapper(),
        });

        let response;
        await act(async () => {
            response = await result.current.mutateAsync({
                uuid,
                justificativa,
            });
        });

        expect(mockRecusarUsuarioGestao).toHaveBeenCalledWith(
            uuid,
            justificativa
        );
        expect(response).toEqual({ success: false, error: "Erro ao recusar" });
    });
});
