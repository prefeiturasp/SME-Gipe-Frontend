import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useObterUsuarioGestao } from "./useObterUsuarioGestao";

const obterUsuarioGestaoMock = vi.fn();

vi.mock("@/actions/obter-usuario-gestao", () => ({
    obterUsuarioGestao: (...args: unknown[]) => obterUsuarioGestaoMock(...args),
}));

describe("useObterUsuarioGestao", () => {
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
                    staleTime: Infinity,
                    refetchOnMount: false,
                    refetchOnWindowFocus: false,
                    refetchOnReconnect: false,
                },
            },
        });
    });

    it("deve buscar dados do usuário com sucesso quando uuid é fornecido", async () => {
        const mockData = {
            uuid: "user-uuid-123",
            username: "12345",
            name: "João Silva",
            email: "joao@exemplo.com",
            cpf: "12345678901",
            cargo: 1,
            rede: "DIRETA",
            codigo_eol_unidade: "123456",
            codigo_eol_dre_da_unidade: "654321",
            is_app_admin: false,
        };

        obterUsuarioGestaoMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result } = renderHook(
            () =>
                useObterUsuarioGestao({
                    uuid: "user-uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockData);
        expect(obterUsuarioGestaoMock).toHaveBeenCalledWith("user-uuid-123");
    });

    it("deve lidar com erro quando obterUsuarioGestao retorna success: false", async () => {
        obterUsuarioGestaoMock.mockResolvedValue({
            success: false,
            error: "Usuário não encontrado",
        });

        const { result } = renderHook(
            () =>
                useObterUsuarioGestao({
                    uuid: "user-uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe("Usuário não encontrado");
    });

    it("não deve fazer requisição quando uuid é vazio", async () => {
        const { result } = renderHook(
            () =>
                useObterUsuarioGestao({
                    uuid: "",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isFetching).toBe(false);
        });

        expect(result.current.data).toBeUndefined();
        expect(obterUsuarioGestaoMock).not.toHaveBeenCalled();
    });

    it("não deve fazer requisição quando enabled é false", async () => {
        const { result } = renderHook(
            () =>
                useObterUsuarioGestao({
                    uuid: "user-uuid-123",
                    enabled: false,
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isFetching).toBe(false);
        });

        expect(result.current.data).toBeUndefined();
        expect(obterUsuarioGestaoMock).not.toHaveBeenCalled();
    });

    it("deve usar cache e não fazer nova requisição se os dados estão frescos", async () => {
        const mockData = {
            uuid: "user-uuid-123",
            username: "12345",
            name: "João Silva",
            email: "joao@exemplo.com",
            cpf: "12345678901",
            cargo: 1,
            rede: "DIRETA",
            codigo_eol_unidade: "123456",
            codigo_eol_dre_da_unidade: "654321",
            is_app_admin: false,
        };

        obterUsuarioGestaoMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result: result1 } = renderHook(
            () =>
                useObterUsuarioGestao({
                    uuid: "user-uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result1.current.isSuccess).toBe(true);
        });

        expect(obterUsuarioGestaoMock).toHaveBeenCalledTimes(1);

        const { result: result2 } = renderHook(
            () =>
                useObterUsuarioGestao({
                    uuid: "user-uuid-123",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result2.current.isSuccess).toBe(true);
        });

        expect(obterUsuarioGestaoMock).toHaveBeenCalledTimes(1);
        expect(result2.current.data).toEqual(mockData);
    });

    it("deve usar queryKey correta com uuid", async () => {
        const mockData = {
            uuid: "user-uuid-diferente",
            username: "54321",
            name: "Maria Santos",
            email: "maria@exemplo.com",
            cpf: "98765432109",
            cargo: 2,
            rede: "INDIRETA",
            codigo_eol_unidade: "789012",
            codigo_eol_dre_da_unidade: "210987",
            is_app_admin: true,
        };

        obterUsuarioGestaoMock.mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result } = renderHook(
            () =>
                useObterUsuarioGestao({
                    uuid: "user-uuid-diferente",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(obterUsuarioGestaoMock).toHaveBeenCalledWith(
            "user-uuid-diferente"
        );
    });

    it("deve fazer nova requisição para uuid diferente", async () => {
        const mockData1 = {
            uuid: "user-uuid-1",
            username: "12345",
            name: "João Silva",
            email: "joao@exemplo.com",
            cpf: "12345678901",
            cargo: 1,
            rede: "DIRETA",
            codigo_eol_unidade: "123456",
            codigo_eol_dre_da_unidade: "654321",
            is_app_admin: false,
        };

        const mockData2 = {
            uuid: "user-uuid-2",
            username: "54321",
            name: "Maria Santos",
            email: "maria@exemplo.com",
            cpf: "98765432109",
            cargo: 2,
            rede: "INDIRETA",
            codigo_eol_unidade: "789012",
            codigo_eol_dre_da_unidade: "210987",
            is_app_admin: true,
        };

        obterUsuarioGestaoMock
            .mockResolvedValueOnce({
                success: true,
                data: mockData1,
            })
            .mockResolvedValueOnce({
                success: true,
                data: mockData2,
            });

        const { result: result1 } = renderHook(
            () =>
                useObterUsuarioGestao({
                    uuid: "user-uuid-1",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result1.current.isSuccess).toBe(true);
        });

        expect(result1.current.data).toEqual(mockData1);
        expect(obterUsuarioGestaoMock).toHaveBeenCalledWith("user-uuid-1");

        const { result: result2 } = renderHook(
            () =>
                useObterUsuarioGestao({
                    uuid: "user-uuid-2",
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result2.current.isSuccess).toBe(true);
        });

        expect(result2.current.data).toEqual(mockData2);
        expect(obterUsuarioGestaoMock).toHaveBeenCalledWith("user-uuid-2");
        expect(obterUsuarioGestaoMock).toHaveBeenCalledTimes(2);
    });
});
