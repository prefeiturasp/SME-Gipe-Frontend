import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTiposDocumentos } from "./useTiposDocumentos";

import * as documentosAction from "@/actions/documentos-anexo";
import * as userStore from "@/stores/useUserStore";

// Mock da action
vi.mock("@/actions/documentos-anexo");

vi.spyOn(userStore, "useUserStore").mockImplementation((selector: any) =>
    selector({ user: null })
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

        // mock da store com user presente
        vi.spyOn(userStore, "useUserStore").mockReturnValue({
            user: { nome: "João" },
        } as any);

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

        vi.spyOn(userStore, "useUserStore").mockReturnValue({
            user: { nome: "Maria" },
        } as any);

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

        vi.spyOn(userStore, "useUserStore").mockImplementation((selector: any) =>
            selector({ user: null })
        );

        renderHook(() => useTiposDocumentos(), {
            wrapper: createWrapper(),
        });

        expect(spy).not.toHaveBeenCalled();
    });
});
