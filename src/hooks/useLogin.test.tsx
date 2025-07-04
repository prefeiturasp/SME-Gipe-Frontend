import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLogin } from "./useLogin";
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
        const fakeUser = { id: 1, name: "Fulano" };
        (global.fetch as Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ user: fakeUser }),
        });

        const { result } = renderHook(() => useLogin(), { wrapper });

        act(() => {
            result.current.mutate({ email: "a@b.com", password: "1234" });
        });

        await waitFor(() => result.current.isSuccess);

        expect(setUserMock).toHaveBeenCalledWith(fakeUser);
        expect(queryClient.getQueryData(["user"])).toEqual(fakeUser);
    });

    it("trata erro quando fetch.ok é false", async () => {
        (global.fetch as Mock).mockResolvedValue({ ok: false });

        const { result } = renderHook(() => useLogin(), { wrapper });

        act(() => {
            result.current.mutate({ email: "x@y.com", password: "abcd" });
        });

        await waitFor(() => result.current.isError);

        expect((result.current.error as Error).message).toBe("Erro no login");
        expect(setUserMock).not.toHaveBeenCalled();
    });
});
