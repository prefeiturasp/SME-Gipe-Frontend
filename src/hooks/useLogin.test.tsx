import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useLogin from "./useLogin";
import { vi } from "vitest";
import { loginAction } from "@/actions/login";

const setUserMock = vi.fn();
const pushMock = vi.fn();

type UserStoreState = { setUser: typeof setUserMock };

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: (selector: (state: UserStoreState) => unknown) =>
        selector({ setUser: setUserMock }),
}));
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));
vi.mock("@/actions/login", () => ({
    loginAction: vi.fn(),
}));

describe("useLogin", () => {
    let queryClient: QueryClient;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    beforeEach(() => {
        setUserMock.mockClear();
        pushMock.mockClear();
        (loginAction as unknown as ReturnType<typeof vi.fn>).mockReset();
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
    });

    it("faz login com sucesso, atualiza store e redireciona", async () => {
        const fakeResponse = {
            name: "Fulano",
            email: "a@b.com",
            cpf: "12345678900",
            login: "fulano",
            visoes: [],
            cargo: { nome: "admin" },
            perfil_acesso: { nome: "Gestor" },
            unidade_lotacao: { nomeUnidade: "EMEF Teste" },
            token: "fake-token",
        };
        (
            loginAction as unknown as ReturnType<typeof vi.fn>
        ).mockResolvedValueOnce({ success: true, data: fakeResponse });

        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync({
                username: "a@b.com",
                password: "1234",
            });
        });

        expect(setUserMock).toHaveBeenCalledWith({
            nome: fakeResponse.name,
            identificador: fakeResponse.login,
            perfil_acesso: fakeResponse.perfil_acesso.nome,
            unidade: fakeResponse.unidade_lotacao.nomeUnidade,
            email: fakeResponse.email,
            cpf: fakeResponse.cpf,
        });
        expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });

    it("trata erro quando loginAction lança erro com detail", async () => {
        (
            loginAction as unknown as ReturnType<typeof vi.fn>
        ).mockRejectedValueOnce({
            detail: "Erro de autenticação",
        });

        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync({
                    username: "x@y.com",
                    password: "abcd",
                });
            } catch {}
        });
        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });
        expect(setUserMock).not.toHaveBeenCalled();
    });

    it("trata erro quando loginAction lança erro genérico", async () => {
        (
            loginAction as unknown as ReturnType<typeof vi.fn>
        ).mockRejectedValueOnce(new Error("Erro desconhecido"));

        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync({
                    username: "foo",
                    password: "bar",
                });
            } catch {}
        });
        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });
        expect(setUserMock).not.toHaveBeenCalled();
    });

    it("trata erro 500 corretamente", async () => {
        const error500 = new Error("Erro interno no servidor");

        (
            loginAction as unknown as ReturnType<typeof vi.fn>
        ).mockRejectedValueOnce(error500);

        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync({
                    username: "foo",
                    password: "bar",
                });
            } catch {}
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(setUserMock).not.toHaveBeenCalled();
        expect(pushMock).not.toHaveBeenCalled();
    });

    it("não atualiza store nem redireciona se dados do usuário estiverem incompletos", async () => {
        const fakeResponse = {
            name: undefined,
            email: "a@b.com",
            cargo: { nome: "admin" },
            token: "fake-token",
        };
        (
            loginAction as unknown as ReturnType<typeof vi.fn>
        ).mockResolvedValueOnce({ success: true, data: fakeResponse });

        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync({
                username: "a@b.com",
                password: "1234",
            });
        });

        expect(setUserMock).not.toHaveBeenCalled();
        expect(pushMock).not.toHaveBeenCalled();
        expect(result.current.isError).toBe(false);
    });

    it("não atualiza store nem redireciona se response.success for false", async () => {
        (
            loginAction as unknown as ReturnType<typeof vi.fn>
        ).mockResolvedValueOnce({ success: false, error: "Erro customizado" });

        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync({
                username: "erro@teste.com",
                password: "1234",
            });
        });

        expect(setUserMock).not.toHaveBeenCalled();
        expect(pushMock).not.toHaveBeenCalled();
        expect(result.current.isError).toBe(false);
    });
});
