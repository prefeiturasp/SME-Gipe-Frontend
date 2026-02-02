import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useConsultarEolUnidade } from "./useConsultarEolUnidade";
import * as consultarEolUnidadeModule from "@/actions/consultar-eol-unidade";
import type { ConsultarEolUnidadeResponse } from "@/actions/consultar-eol-unidade";

vi.mock("@/actions/consultar-eol-unidade", () => ({
    consultarEolUnidadeAction: vi.fn(),
}));

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

describe("useConsultarEolUnidade", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve consultar código EOL com sucesso", async () => {
        const mockResponse: ConsultarEolUnidadeResponse = {
            etapa_modalidade: "EMEI",
            nome_unidade: "MARCIANO VASQUES PEREIRA, PROF.",
        };

        vi.spyOn(
            consultarEolUnidadeModule,
            "consultarEolUnidadeAction",
        ).mockResolvedValue({
            success: true,
            data: mockResponse,
        });

        const { result } = renderHook(() => useConsultarEolUnidade(), {
            wrapper: createWrapper(),
        });

        const codigoEol = "123456";
        result.current.mutate(codigoEol);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual({
            success: true,
            data: mockResponse,
        });
        expect(
            consultarEolUnidadeModule.consultarEolUnidadeAction,
        ).toHaveBeenCalledWith(codigoEol);
    });

    it("deve retornar erro ao consultar código EOL", async () => {
        const errorMessage = "Código EOL não encontrado";

        vi.spyOn(
            consultarEolUnidadeModule,
            "consultarEolUnidadeAction",
        ).mockResolvedValue({
            success: false,
            error: errorMessage,
        });

        const { result } = renderHook(() => useConsultarEolUnidade(), {
            wrapper: createWrapper(),
        });

        const codigoEol = "999999";
        result.current.mutate(codigoEol);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual({
            success: false,
            error: errorMessage,
        });
    });

    it("deve usar mutateAsync para consultar código EOL", async () => {
        const mockResponse: ConsultarEolUnidadeResponse = {
            etapa_modalidade: "EMEF",
            nome_unidade: "JOÃO DA SILVA, DR.",
        };

        vi.spyOn(
            consultarEolUnidadeModule,
            "consultarEolUnidadeAction",
        ).mockResolvedValue({
            success: true,
            data: mockResponse,
        });

        const { result } = renderHook(() => useConsultarEolUnidade(), {
            wrapper: createWrapper(),
        });

        const codigoEol = "654321";
        const response = await result.current.mutateAsync(codigoEol);

        expect(response).toEqual({
            success: true,
            data: mockResponse,
        });
        expect(
            consultarEolUnidadeModule.consultarEolUnidadeAction,
        ).toHaveBeenCalledWith(codigoEol);
    });

    it("deve indicar isPending durante a consulta", async () => {
        vi.spyOn(
            consultarEolUnidadeModule,
            "consultarEolUnidadeAction",
        ).mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                success: true,
                                data: {
                                    etapa_modalidade: "EMEI",
                                    nome_unidade: "Teste",
                                },
                            }),
                        100,
                    ),
                ),
        );

        const { result } = renderHook(() => useConsultarEolUnidade(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isPending).toBe(false);

        result.current.mutate("123456");

        await waitFor(() => {
            expect(result.current.isPending).toBe(true);
        });

        await waitFor(() => {
            expect(result.current.isPending).toBe(false);
        });
    });

    it("deve resetar estado ao fazer nova consulta", async () => {
        const mockResponse1: ConsultarEolUnidadeResponse = {
            etapa_modalidade: "EMEI",
            nome_unidade: "Escola 1",
        };

        const mockResponse2: ConsultarEolUnidadeResponse = {
            etapa_modalidade: "EMEF",
            nome_unidade: "Escola 2",
        };

        const consultarSpy = vi.spyOn(
            consultarEolUnidadeModule,
            "consultarEolUnidadeAction",
        );

        consultarSpy.mockResolvedValueOnce({
            success: true,
            data: mockResponse1,
        });

        const { result } = renderHook(() => useConsultarEolUnidade(), {
            wrapper: createWrapper(),
        });

        result.current.mutate("111111");

        await waitFor(() => {
            expect(result.current.data?.success).toBe(true);
        });

        expect(result.current.data).toEqual({
            success: true,
            data: mockResponse1,
        });

        consultarSpy.mockResolvedValueOnce({
            success: true,
            data: mockResponse2,
        });

        result.current.mutate("222222");

        await waitFor(() => {
            expect(result.current.data).toEqual({
                success: true,
                data: mockResponse2,
            });
        });

        expect(consultarSpy).toHaveBeenCalledTimes(2);
    });
});
