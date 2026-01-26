import type { AtualizarUnidadeRequest } from "@/actions/atualizar-unidade";
import * as atualizarUnidadeModule from "@/actions/atualizar-unidade";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAtualizarUnidade } from "./useAtualizarUnidade";

vi.mock("@/actions/atualizar-unidade", () => ({
    atualizarUnidadeAction: vi.fn(),
}));

describe("useAtualizarUnidade", () => {
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

    it("deve atualizar unidade com sucesso", async () => {
        const mockResponse = {
            success: true,
        };

        vi.mocked(
            atualizarUnidadeModule.atualizarUnidadeAction
        ).mockResolvedValue(mockResponse);

        const uuid = "123e4567-e89b-12d3-a456-426614174000";
        const { result } = renderHook(() => useAtualizarUnidade(uuid), {
            wrapper,
        });

        const payload: AtualizarUnidadeRequest = {
            tipo_unidade: "EMEF",
            nome: "EMEF Teste",
            rede: "DIRETA",
            codigo_eol: "093319",
            dre: "dre-uuid-123",
            sigla: "DRE-BT",
            ativa: true,
        };

        result.current.mutate(payload);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(
            atualizarUnidadeModule.atualizarUnidadeAction
        ).toHaveBeenCalledWith(uuid, payload);
        expect(result.current.data).toEqual(mockResponse);
    });

    it("deve lidar com erro ao atualizar unidade", async () => {
        const mockError = {
            success: false,
            error: "Erro ao atualizar unidade",
        };

        vi.mocked(
            atualizarUnidadeModule.atualizarUnidadeAction
        ).mockResolvedValue(mockError);

        const uuid = "123e4567-e89b-12d3-a456-426614174000";
        const { result } = renderHook(() => useAtualizarUnidade(uuid), {
            wrapper,
        });

        const payload: AtualizarUnidadeRequest = {
            tipo_unidade: "EMEF",
            nome: "EMEF Teste",
            rede: "DIRETA",
            codigo_eol: "093319",
            ativa: true,
        };

        result.current.mutate(payload);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockError);
        expect(result.current.data?.success).toBe(false);
    });

    it("deve ter estado de loading durante a atualização", async () => {
        vi.mocked(
            atualizarUnidadeModule.atualizarUnidadeAction
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
        const { result } = renderHook(() => useAtualizarUnidade(uuid), {
            wrapper,
        });

        expect(result.current.isPending).toBe(false);

        const payload: AtualizarUnidadeRequest = {
            tipo_unidade: "CEI",
            nome: "CEI Exemplo",
            rede: "INDIRETA",
            codigo_eol: "012345",
            dre: "dre-uuid-456",
            sigla: "DRE-CL",
            ativa: true,
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
            atualizarUnidadeModule.atualizarUnidadeAction
        ).mockResolvedValue(mockResponse);

        const uuid = "test-uuid-123";
        const { result } = renderHook(() => useAtualizarUnidade(uuid), {
            wrapper,
        });

        const payload: AtualizarUnidadeRequest = {
            tipo_unidade: "EMEI",
            nome: "EMEI São Paulo",
            rede: "DIRETA",
            codigo_eol: "789012",
            dre: "dre-uuid-789",
            sigla: "DRE-SP",
            ativa: true,
        };

        result.current.mutate(payload);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(
            atualizarUnidadeModule.atualizarUnidadeAction
        ).toHaveBeenCalledTimes(1);
        expect(
            atualizarUnidadeModule.atualizarUnidadeAction
        ).toHaveBeenCalledWith(uuid, payload);
    });

    it("deve retornar a resposta no onSuccess", async () => {
        const mockResponse = {
            success: true,
        };

        vi.mocked(
            atualizarUnidadeModule.atualizarUnidadeAction
        ).mockResolvedValue(mockResponse);

        const uuid = "123e4567-e89b-12d3-a456-426614174000";
        const { result } = renderHook(() => useAtualizarUnidade(uuid), {
            wrapper,
        });

        const payload: AtualizarUnidadeRequest = {
            tipo_unidade: "CEU",
            nome: "CEU Exemplo",
            rede: "DIRETA",
            codigo_eol: "345678",
            dre: "dre-uuid-345",
            sigla: "DRE-EX",
            ativa: true,
        };

        result.current.mutate(payload);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResponse);
    });

    it("deve aceitar diferentes tipos de unidade", async () => {
        const mockResponse = {
            success: true,
        };

        vi.mocked(
            atualizarUnidadeModule.atualizarUnidadeAction
        ).mockResolvedValue(mockResponse);

        const uuid = "123e4567-e89b-12d3-a456-426614174000";
        const { result } = renderHook(() => useAtualizarUnidade(uuid), {
            wrapper,
        });

        const payloadRedeIndireta: AtualizarUnidadeRequest = {
            tipo_unidade: "CEI",
            nome: "CEI Conveniada",
            rede: "INDIRETA",
            codigo_eol: "456789",
            dre: "dre-uuid-456",
            sigla: "DRE-IN",
            ativa: false,
        };

        result.current.mutate(payloadRedeIndireta);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(
            atualizarUnidadeModule.atualizarUnidadeAction
        ).toHaveBeenCalledWith(uuid, payloadRedeIndireta);
    });

    it("deve resetar o estado ao fazer uma nova mutação", async () => {
        const mockResponse = {
            success: true,
        };

        vi.mocked(
            atualizarUnidadeModule.atualizarUnidadeAction
        ).mockResolvedValue(mockResponse);

        const uuid = "123e4567-e89b-12d3-a456-426614174000";
        const { result } = renderHook(() => useAtualizarUnidade(uuid), {
            wrapper,
        });

        const payload1: AtualizarUnidadeRequest = {
            tipo_unidade: "EMEF",
            nome: "Primeira Unidade",
            rede: "DIRETA",
            codigo_eol: "111111",
            dre: "dre-uuid-111",
            sigla: "DRE-P1",
            ativa: true,
        };

        result.current.mutate(payload1);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResponse);

        const payload2: AtualizarUnidadeRequest = {
            tipo_unidade: "EMEI",
            nome: "Segunda Unidade",
            rede: "DIRETA",
            codigo_eol: "222222",
            dre: "dre-uuid-222",
            sigla: "DRE-P2",
            ativa: true,
        };

        result.current.mutate(payload2);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(
            atualizarUnidadeModule.atualizarUnidadeAction
        ).toHaveBeenLastCalledWith(uuid, payload2);
        expect(result.current.data).toEqual(mockResponse);
    });

    it("deve atualizar unidade do tipo DRE sem campo dre", async () => {
        const mockResponse = {
            success: true,
        };

        vi.mocked(
            atualizarUnidadeModule.atualizarUnidadeAction
        ).mockResolvedValue(mockResponse);

        const uuid = "dre-uuid-123";
        const { result } = renderHook(() => useAtualizarUnidade(uuid), {
            wrapper,
        });

        const payloadDRE: AtualizarUnidadeRequest = {
            tipo_unidade: "ADM",
            nome: "DRE Butantã",
            rede: "DIRETA",
            codigo_eol: "108600",
            sigla: "DRE-BT",
            ativa: true,
        };

        result.current.mutate(payloadDRE);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(
            atualizarUnidadeModule.atualizarUnidadeAction
        ).toHaveBeenCalledWith(uuid, payloadDRE);
    });
});
