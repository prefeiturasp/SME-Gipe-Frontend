import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useLogin from "./useLogin";
import { vi, type Mock } from "vitest";

const setUserMock = vi.fn();
vi.mock("@/stores/useUserStore", () => ({
    useUserStore: (selector: (state: unknown) => unknown) =>
        selector({ setUser: setUserMock }),
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
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        global.fetch = vi.fn();
    });

    it("faz login com sucesso e atualiza store + cache", async () => {
        const fakeResponse = {
            name: "Fulano",
            email: "a@b.com",
            cpf: "12345678900",
            login: "fulano",
            visoes: [],
            cargo: { nome: "admin" },
            token: "fake-token",
        };
        (global.fetch as Mock).mockResolvedValue({
            ok: true,
            json: async () => fakeResponse,
        });

        const { result } = renderHook(() => useLogin(), { wrapper });

        act(() => {
            result.current.mutate({ username: "a@b.com", password: "1234" });
        });

        await waitFor(() => result.current.isSuccess);

        expect(setUserMock).toHaveBeenCalledWith({
            nome: fakeResponse.name,
            email: fakeResponse.email,
            cargo: fakeResponse.cargo.nome,
        });
    });

    it("trata erro quando fetch.ok é false", async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ detail: "Erro de autenticação" }),
        });

        const { result } = renderHook(() => useLogin(), { wrapper });

        act(() => {
            result.current.mutate({ username: "x@y.com", password: "abcd" });
        });

        await waitFor(() => result.current.isError);

        const error = result.current.error;
        let message = String(error);
        if (error && typeof error === "object") {
            if (
                "message" in error &&
                typeof (error as { message: unknown }).message === "string"
            ) {
                message = (error as { message: string }).message;
            } else if (
                "detail" in error &&
                typeof (error as { detail: unknown }).detail === "string"
            ) {
                message = (error as { detail: string }).detail;
            }
        }
        expect(message).toBe("Erro de autenticação");
        expect(setUserMock).not.toHaveBeenCalled();
    });

    it("lança erro com mensagem customizada se response.ok for false e houver detail", async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ detail: "Mensagem de erro do backend" }),
        });

        const { result } = renderHook(() => useLogin(), { wrapper });

        act(() => {
            result.current.mutate({ username: "teste", password: "1234" });
        });

        await waitFor(() => result.current.isError);

        const error = result.current.error;
        let message = String(error);
        if (
            error &&
            typeof error === "object" &&
            "message" in error &&
            typeof (error as { message: unknown }).message === "string"
        ) {
            message = (error as { message: string }).message;
        }
        expect(message).toBe("Mensagem de erro do backend");
    });

    it("lança Error com a mensagem de detail se response.ok for false", async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ detail: "Mensagem personalizada do backend" }),
        });

        const { result } = renderHook(() => useLogin(), { wrapper });

        act(() => {
            result.current.mutate({ username: "teste", password: "1234" });
        });

        await waitFor(() => result.current.isError);

        const error = result.current.error;
        expect(error).toBeInstanceOf(Error);
        expect((error as unknown as Error).message).toBe(
            "Mensagem personalizada do backend"
        );
    });

    it("lança Error com mensagem padrão se response.ok for false e não houver detail", async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: false,
            json: async () => ({}), // sem detail
        });

        const { result } = renderHook(() => useLogin(), { wrapper });

        act(() => {
            result.current.mutate({ username: "teste", password: "1234" });
        });

        await waitFor(() => result.current.isError);

        const error = result.current.error;
        expect(error).toBeInstanceOf(Error);
        expect((error as unknown as Error).message).toBe(
            "Erro na autenticação"
        );
    });
});
