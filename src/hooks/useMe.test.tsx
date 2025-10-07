import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";

import useMe from "./useMe";
import { getMeAction } from "@/actions/me";
import type { User } from "@/stores/useUserStore";

vi.mock("@/actions/me", () => ({
    getMeAction: vi.fn(),
}));

const setUserMock = vi.fn();
vi.mock("@/stores/useUserStore", async (importOriginal) => {
    const actual = await importOriginal<
        typeof import("@/stores/useUserStore")
    >();
    return {
        ...actual,
        useUserStore: (selector: (state: unknown) => unknown) => {
            const state = {
                setUser: setUserMock,
                user: null,
            };
            return selector(state);
        },
    };
});

const getMeActionMock = getMeAction as Mock;

describe("useMe", () => {
    let queryClient: QueryClient;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
    });

    it("deve buscar os dados do usuário e chamar setUser em caso de sucesso", async () => {
        const fakeUser: User = {
            username: "fulano.teste",
            name: "Fulano Teste",
            email: "fulano@teste.com",
            cpf: "111.222.333-44",
            rede: "SME",
            is_core_sso: true,
            is_validado: true,
            perfil_acesso: { codigo: 1, nome: "Admin" },
            unidades: [],
        };

        getMeActionMock.mockResolvedValue({ success: true, data: fakeUser });

        const { result } = renderHook(() => useMe(), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(fakeUser);
        expect(setUserMock).toHaveBeenCalledWith(fakeUser);
    });

    it("deve retornar null e não chamar setUser quando a action falhar silenciosamente", async () => {
        getMeActionMock.mockResolvedValue({ success: false });

        const { result } = renderHook(() => useMe(), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBeNull();
        expect(setUserMock).not.toHaveBeenCalled();
    });

    it("deve tratar o erro quando getMeAction lança uma exceção", async () => {
        const error = new Error("Erro de rede");
        getMeActionMock.mockRejectedValue(error);

        const { result } = renderHook(() => useMe(), { wrapper });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBe(error);
        expect(setUserMock).not.toHaveBeenCalled();
    });
});
