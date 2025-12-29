import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCadastrarUnidade } from "./useCadastrarUnidade";
import * as cadastrarUnidadeModule from "@/actions/cadastrar-unidade";
import type { UnidadeCadastroPayload } from "@/actions/cadastrar-unidade";

vi.mock("@/actions/cadastrar-unidade");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    Wrapper.displayName = "QueryClientWrapper";
    return Wrapper;
};

describe("useCadastrarUnidade", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve cadastrar unidade com sucesso", async () => {
        const mockRequest: UnidadeCadastroPayload = {
            nome: "EMEF Teste",
            codigo_eol: "123456",
            tipo_unidade: "EMEF",
            rede: "DIRETA",
            ativa: true,
        };
        const mockResult = { success: true as const };
        vi.spyOn(
            cadastrarUnidadeModule,
            "cadastrarUnidadeAction"
        ).mockResolvedValue(mockResult);

        const { result } = renderHook(() => useCadastrarUnidade(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
        expect(
            cadastrarUnidadeModule.cadastrarUnidadeAction
        ).toHaveBeenCalledWith(mockRequest);
    });

    it("deve lidar com erro de autenticação", async () => {
        const mockRequest: UnidadeCadastroPayload = {
            nome: "EMEI Teste",
            codigo_eol: "654321",
            tipo_unidade: "EMEI",
            rede: "DIRETA",
            ativa: true,
        };
        const mockResult = {
            success: false as const,
            error: "Usuário não autenticado",
        };
        vi.spyOn(
            cadastrarUnidadeModule,
            "cadastrarUnidadeAction"
        ).mockResolvedValue(mockResult);

        const { result } = renderHook(() => useCadastrarUnidade(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
        expect(result.current.data?.success).toBe(false);
        if (result.current.data && !result.current.data.success) {
            expect(result.current.data.error).toBe("Usuário não autenticado");
        }
    });

    it("deve lidar com erro de dados inválidos", async () => {
        const mockRequest: UnidadeCadastroPayload = {
            nome: "",
            codigo_eol: "",
            tipo_unidade: "",
            rede: "",
            ativa: false,
        };
        const mockResult = {
            success: false as const,
            error: "Dados inválidos para cadastro",
        };
        vi.spyOn(
            cadastrarUnidadeModule,
            "cadastrarUnidadeAction"
        ).mockResolvedValue(mockResult);

        const { result } = renderHook(() => useCadastrarUnidade(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
        expect(result.current.data?.success).toBe(false);
        if (result.current.data && !result.current.data.success) {
            expect(result.current.data.error).toBe(
                "Dados inválidos para cadastro"
            );
        }
    });

    it("deve lidar com erro interno do servidor", async () => {
        const mockRequest: UnidadeCadastroPayload = {
            nome: "EMEI Teste",
            codigo_eol: "654321",
            tipo_unidade: "EMEI",
            rede: "DIRETA",
            ativa: true,
        };
        const mockResult = {
            success: false as const,
            error: "Erro interno no servidor",
        };
        vi.spyOn(
            cadastrarUnidadeModule,
            "cadastrarUnidadeAction"
        ).mockResolvedValue(mockResult);

        const { result } = renderHook(() => useCadastrarUnidade(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
        expect(result.current.data?.success).toBe(false);
        if (result.current.data && !result.current.data.success) {
            expect(result.current.data.error).toBe("Erro interno no servidor");
        }
    });

    it("deve retornar mutation em estado idle inicialmente", () => {
        const { result } = renderHook(() => useCadastrarUnidade(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isPending).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.data).toBeUndefined();
    });

    it("deve lidar com múltiplas mutações em sequência", async () => {
        const mockRequest1: UnidadeCadastroPayload = {
            nome: "EMEI Alfa",
            codigo_eol: "111111",
            tipo_unidade: "EMEI",
            rede: "DIRETA",
            ativa: true,
        };
        const mockRequest2: UnidadeCadastroPayload = {
            nome: "EMEI Beta",
            codigo_eol: "222222",
            tipo_unidade: "EMEI",
            rede: "DIRETA",
            ativa: true,
        };
        const mockResult1 = { success: true as const };
        const mockResult2 = { success: false as const, error: "Duplicidade" };

        const spy = vi.spyOn(cadastrarUnidadeModule, "cadastrarUnidadeAction");
        spy.mockResolvedValueOnce(mockResult1).mockResolvedValueOnce(
            mockResult2
        );

        const { result } = renderHook(() => useCadastrarUnidade(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest1);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(mockResult1);

        result.current.reset();
        await waitFor(() => expect(result.current.isPending).toBe(false));
        expect(result.current.data).toBeUndefined();

        result.current.mutate(mockRequest2);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(mockResult2);
        expect(result.current.data?.success).toBe(false);
        if (result.current.data && !result.current.data.success) {
            expect(result.current.data.error).toBe("Duplicidade");
        }
    });

    it("deve lidar com exceção lançada pela action", async () => {
        const mockRequest: UnidadeCadastroPayload = {
            nome: "EMEI Exceção",
            codigo_eol: "999999",
            tipo_unidade: "EMEI",
            rede: "DIRETA",
            ativa: true,
        };
        vi.spyOn(
            cadastrarUnidadeModule,
            "cadastrarUnidadeAction"
        ).mockRejectedValue(new Error("Falha inesperada"));

        const { result } = renderHook(() => useCadastrarUnidade(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest);

        await waitFor(() => result.current.isError === true);
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe("Falha inesperada");
    });

    it("deve manter dados anteriores após erro em nova mutação", async () => {
        const mockRequest1: UnidadeCadastroPayload = {
            nome: "EMEI Persistente",
            codigo_eol: "333333",
            tipo_unidade: "EMEI",
            rede: "DIRETA",
            ativa: true,
        };
        const mockRequest2: UnidadeCadastroPayload = {
            nome: "EMEI Falha",
            codigo_eol: "444444",
            tipo_unidade: "EMEI",
            rede: "DIRETA",
            ativa: true,
        };
        const mockResult1 = { success: true as const };
        vi.spyOn(cadastrarUnidadeModule, "cadastrarUnidadeAction")
            .mockResolvedValueOnce(mockResult1)
            .mockRejectedValueOnce(new Error("Erro ao cadastrar"));

        const { result } = renderHook(() => useCadastrarUnidade(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest1);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(mockResult1);

        result.current.mutate(mockRequest2);
        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe("Erro ao cadastrar");
    });
});
