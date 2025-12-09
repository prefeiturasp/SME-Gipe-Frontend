import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useEnderecoPorCep } from "./useEnderecoViaCep";
import * as enderecoAction from "@/actions/get-endereco-via-cep";

vi.mock("@/actions/get-endereco-via-cep");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    Wrapper.displayName = "QueryClientWrapper";

    return Wrapper;
};

describe("useEnderecoPorCep", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar o endereço com sucesso", async () => {
        const mockData = {
            logradouro: "Rua A",
            bairro: "Bairro B",
            cidade: "Cidade C",
            estado: "ST",
        };

        vi.spyOn(enderecoAction, "getEnderecoPorCepAction").mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result } = renderHook(() => useEnderecoPorCep(), {
            wrapper: createWrapper(),
        });

        result.current.mutate("12345678");

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockData);
        expect(result.current.isError).toBe(false);
    });

    it("deve retornar erro quando a action falha", async () => {
        vi.spyOn(enderecoAction, "getEnderecoPorCepAction").mockResolvedValue({
            success: false,
            error: "CEP inválido",
        });

        const { result } = renderHook(() => useEnderecoPorCep(), {
            wrapper: createWrapper(),
        });

        result.current.mutate("00000000");

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe("CEP inválido");
        expect(result.current.data).toBeUndefined();
    });

    it("deve funcionar corretamente com CEPs limpos e mascarados", async () => {
        const mockData = {
            logradouro: "Rua Teste",
            bairro: "Bairro Teste",
            cidade: "Cidade Teste",
            estado: "ST",
        };

        vi.spyOn(enderecoAction, "getEnderecoPorCepAction").mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result } = renderHook(() => useEnderecoPorCep(), {
            wrapper: createWrapper(),
        });

        result.current.mutate("12.345-678");

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockData);
        expect(result.current.isError).toBe(false);
    });
});