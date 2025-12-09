import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEnviarAnexo } from "./useEnviarAnexo";
import * as enviarAnexoModule from "@/actions/enviar-anexo";

vi.mock("@/actions/enviar-anexo");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
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

describe("useEnviarAnexo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve enviar anexo com sucesso", async () => {
        const mockFile = new File(["conteúdo"], "teste.pdf", {
            type: "application/pdf",
        });

        const mockResult = {
            success: true,
            data: {
                id: "123",
                url: "https://example.com/anexo.pdf",
            },
        };

        vi.spyOn(enviarAnexoModule, "enviarAnexoAction").mockResolvedValue(
            mockResult
        );

        const { result } = renderHook(() => useEnviarAnexo(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({
            intercorrencia_uuid: "uuid-123",
            perfil: "diretor",
            categoria: "boletim_ocorrencia",
            arquivo: mockFile,
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
        expect(enviarAnexoModule.enviarAnexoAction).toHaveBeenCalledWith(
            expect.any(FormData)
        );
    });

    it("deve lidar com erro ao enviar anexo", async () => {
        const mockFile = new File(["conteúdo"], "teste.pdf", {
            type: "application/pdf",
        });

        const mockResult = {
            success: false,
            error: "Erro interno no servidor",
        };

        vi.spyOn(enviarAnexoModule, "enviarAnexoAction").mockResolvedValue(
            mockResult
        );

        const { result } = renderHook(() => useEnviarAnexo(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({
            intercorrencia_uuid: "uuid-123",
            perfil: "diretor",
            categoria: "boletim_ocorrencia",
            arquivo: mockFile,
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
    });
});
