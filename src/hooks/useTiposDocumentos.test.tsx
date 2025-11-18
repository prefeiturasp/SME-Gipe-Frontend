import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTiposDocumentos } from "./useTiposDocumentos";

import * as documentosAction from "@/actions/tipos-documentos";
import * as userStore from "@/stores/useUserStore";

// Mock da action
vi.mock("@/actions/documentos-anexo");

vi.spyOn(userStore, "useUserStore").mockImplementation((selector) =>
    selector({
        user: {
            username: "",
            name: "João",
            email: "",
            cpf: "",
            rede: "",
            is_core_sso: false,
            is_validado: true,
            perfil_acesso: { codigo: 1, nome: "DIRETOR DE ESCOLA" },
            unidades: [],
        },
        setUser: vi.fn(),
        clearUser: vi.fn(),
    })
);


const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    Wrapper.displayName = "QueryClientWrapper";
    return Wrapper;
};

describe("useTiposDocumentos", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve buscar e transformar os tipos de documento com sucesso", async () => {
        const mockApiResponse = {
            perfil: "diretor",
            categorias: [
                { value: "doc1", label: "Documento 1" },
                { value: "doc2", label: "Documento 2" },
            ],
        };

        vi.spyOn(documentosAction, "getTiposDocumentoAction")
        .mockResolvedValue({
            success: true,
            data: mockApiResponse
        } as const);

        vi.spyOn(userStore, "useUserStore").mockImplementation((selector) =>
            selector({
                user: {
                    username: "",
                    name: "João",
                    email: "",
                    cpf: "",
                    rede: "",
                    is_core_sso: false,
                    is_validado: true,
                    perfil_acesso: { codigo: 1, nome: "DIRETOR DE ESCOLA" },
                    unidades: [],
                },
                setUser: vi.fn(),
                clearUser: vi.fn(),
            })
        );

        const { result } = renderHook(() => useTiposDocumentos(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual([
            { value: "doc1", label: "Documento 1" },
            { value: "doc2", label: "Documento 2" },
        ]);
    });

    it("deve retornar erro quando a action falha", async () => {
        vi.spyOn(documentosAction, "getTiposDocumentoAction")
            .mockResolvedValue({
                success: false,
                error: "Erro ao buscar documentos",
            });

        vi.spyOn(userStore, "useUserStore").mockImplementation((selector) =>
            selector({
                user: {
                    username: "",
                    name: "João",
                    email: "",
                    cpf: "",
                    rede: "",
                    is_core_sso: false,
                    is_validado: true,
                    perfil_acesso: { codigo: 1, nome: "DIRETOR DE ESCOLA" },
                    unidades: [],
                },
                setUser: vi.fn(),
                clearUser: vi.fn(),
            })
        );


        const { result } = renderHook(() => useTiposDocumentos(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe(
            "Erro ao buscar documentos"
        );
    });

    it("não deve executar a query quando não há usuário", async () => {
        const spy = vi.spyOn(documentosAction, "getTiposDocumentoAction");

        vi.spyOn(userStore, "useUserStore").mockImplementation((selector) =>
            selector({
                user: null,
                setUser: vi.fn(),
                clearUser: vi.fn(),
            })
        );

        renderHook(() => useTiposDocumentos(), {
            wrapper: createWrapper(),
        });

        expect(spy).not.toHaveBeenCalled();
    });
});
