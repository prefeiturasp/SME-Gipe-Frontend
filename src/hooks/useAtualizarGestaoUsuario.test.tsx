import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAtualizarGestaoUsuario } from "./useAtualizarGestaoUsuario";
import * as atualizarGestaoUsuarioModule from "@/actions/atualizar-gestao-usuario";
import type { AtualizarGestaoUsuarioRequest } from "@/actions/atualizar-gestao-usuario";

vi.mock("@/actions/atualizar-gestao-usuario", () => ({
    atualizarGestaoUsuarioAction: vi.fn(),
}));

describe("useAtualizarGestaoUsuario", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        vi.clearAllMocks();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it("deve atualizar usuário com sucesso", async () => {
        const mockResponse = {
            success: true,
        };

        vi.mocked(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).mockResolvedValue(mockResponse);

        const uuid = "123e4567-e89b-12d3-a456-426614174000";
        const { result } = renderHook(() => useAtualizarGestaoUsuario(uuid), {
            wrapper,
        });

        const payload: AtualizarGestaoUsuarioRequest = {
            username: "joao.silva",
            name: "João Silva",
            email: "joao@exemplo.com",
            cargo: 1,
            rede: "DIRETA",
            unidades: [],
            is_app_admin: false,
        };

        result.current.mutate(payload);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).toHaveBeenCalledWith(uuid, payload);
        expect(result.current.data).toEqual(mockResponse);
    });

    it("deve lidar com erro ao atualizar usuário", async () => {
        const mockError = {
            success: false,
            error: "Erro ao atualizar usuário",
        };

        vi.mocked(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).mockResolvedValue(mockError);

        const uuid = "123e4567-e89b-12d3-a456-426614174000";
        const { result } = renderHook(() => useAtualizarGestaoUsuario(uuid), {
            wrapper,
        });

        const payload: AtualizarGestaoUsuarioRequest = {
            username: "joao.silva",
            name: "João Silva",
            email: "joao@exemplo.com",
            cargo: 1,
            rede: "DIRETA",
            unidades: [],
            is_app_admin: false,
        };

        result.current.mutate(payload);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockError);
        expect(result.current.data?.success).toBe(false);
    });

    it("deve ter estado de loading durante a atualização", async () => {
        vi.mocked(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                success: true,
                            }),
                        100
                    )
                )
        );

        const uuid = "123e4567-e89b-12d3-a456-426614174000";
        const { result } = renderHook(() => useAtualizarGestaoUsuario(uuid), {
            wrapper,
        });

        expect(result.current.isPending).toBe(false);

        const payload: AtualizarGestaoUsuarioRequest = {
            username: "joao.silva",
            name: "João Silva",
            email: "joao@exemplo.com",
            cargo: 1,
            rede: "DIRETA",
            unidades: [],
            is_app_admin: false,
        };

        result.current.mutate(payload);

        await waitFor(() => expect(result.current.isPending).toBe(true));

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.isPending).toBe(false);
    });

    it("deve chamar mutationFn com uuid e dados corretos", async () => {
        const mockResponse = {
            success: true,
        };

        vi.mocked(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).mockResolvedValue(mockResponse);

        const uuid = "test-uuid-123";
        const { result } = renderHook(() => useAtualizarGestaoUsuario(uuid), {
            wrapper,
        });

        const payload: AtualizarGestaoUsuarioRequest = {
            username: "maria.santos",
            name: "Maria Santos",
            email: "maria@exemplo.com",
            cargo: 2,
            rede: "DIRETA",
            unidades: ["DRE-01"],
            is_app_admin: true,
        };

        result.current.mutate(payload);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).toHaveBeenCalledTimes(1);
        expect(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).toHaveBeenCalledWith(uuid, payload);
    });

    it("deve retornar a resposta no onSuccess", async () => {
        const mockResponse = {
            success: true,
        };

        vi.mocked(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).mockResolvedValue(mockResponse);

        const uuid = "123e4567-e89b-12d3-a456-426614174000";
        const { result } = renderHook(() => useAtualizarGestaoUsuario(uuid), {
            wrapper,
        });

        const payload: AtualizarGestaoUsuarioRequest = {
            username: "pedro.lima",
            name: "Pedro Lima",
            email: "pedro@exemplo.com",
            cargo: 3,
            rede: "DIRETA",
            unidades: ["123456"],
            is_app_admin: false,
        };

        result.current.mutate(payload);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResponse);
    });

    it("deve aceitar diferentes tipos de payload conforme o cargo", async () => {
        const mockResponse = {
            success: true,
        };

        vi.mocked(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).mockResolvedValue(mockResponse);

        const uuid = "123e4567-e89b-12d3-a456-426614174000";
        const { result } = renderHook(() => useAtualizarGestaoUsuario(uuid), {
            wrapper,
        });

        // Teste com cargo UE e rede INDIRETA
        const payloadRedeIndireta: AtualizarGestaoUsuarioRequest = {
            username: "ana.costa",
            name: "Ana Costa",
            email: "ana@exemplo.com",
            cargo: 3,
            rede: "INDIRETA",
            unidades: ["CEI Exemplo"],
            is_app_admin: false,
        };

        result.current.mutate(payloadRedeIndireta);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).toHaveBeenCalledWith(uuid, payloadRedeIndireta);
    });

    it("deve resetar o estado ao fazer uma nova mutação", async () => {
        const mockResponse = {
            success: true,
        };

        vi.mocked(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).mockResolvedValue(mockResponse);

        const uuid = "123e4567-e89b-12d3-a456-426614174000";
        const { result } = renderHook(() => useAtualizarGestaoUsuario(uuid), {
            wrapper,
        });

        const payload1: AtualizarGestaoUsuarioRequest = {
            username: "primeiro.nome",
            name: "Primeiro Nome",
            email: "primeiro@exemplo.com",
            cargo: 1,
            rede: "DIRETA",
            unidades: [],
            is_app_admin: false,
        };

        result.current.mutate(payload1);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResponse);

        // Segunda mutação
        const payload2: AtualizarGestaoUsuarioRequest = {
            username: "segundo.nome",
            name: "Segundo Nome",
            email: "segundo@exemplo.com",
            cargo: 2,
            rede: "DIRETA",
            unidades: ["DRE-03"],
            is_app_admin: false,
        };

        result.current.mutate(payload2);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).toHaveBeenCalledTimes(2);
        expect(
            atualizarGestaoUsuarioModule.atualizarGestaoUsuarioAction
        ).toHaveBeenLastCalledWith(uuid, payload2);
    });
});
