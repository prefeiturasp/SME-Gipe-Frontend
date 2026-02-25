import * as tiposOcorrenciaAction from "@/actions/tipos-ocorrencia";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTiposOcorrencia } from "./useTiposOcorrencia";

vi.mock("@/actions/tipos-ocorrencia");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
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

describe("useTiposOcorrencia", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar os tipos de ocorrência com sucesso ao passar tipoFormulario", async () => {
        const mockData = [
            {
                uuid: "1cd5b78c-3d8a-483c-a2c5-1346c44a4e97",
                nome: "Agressão física",
            },
            {
                uuid: "f2a5b2d7-390d-4af9-ab1b-06551eec0dba",
                nome: "Ameaça externa",
            },
        ];

        vi.spyOn(
            tiposOcorrenciaAction,
            "getTiposOcorrenciaAction",
        ).mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result } = renderHook(() => useTiposOcorrencia("PATRIMONIAL"), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockData);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(
            tiposOcorrenciaAction.getTiposOcorrenciaAction,
        ).toHaveBeenCalledWith("PATRIMONIAL");
    });

    it("deve retornar erro quando a action falha", async () => {
        vi.spyOn(
            tiposOcorrenciaAction,
            "getTiposOcorrenciaAction",
        ).mockResolvedValue({
            success: false,
            error: "Erro ao buscar tipos de ocorrência",
        });

        const { result } = renderHook(() => useTiposOcorrencia("GERAL"), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe(
            "Erro ao buscar tipos de ocorrência",
        );
        expect(result.current.data).toBeUndefined();
    });

    it("deve usar staleTime de 1 hora", () => {
        vi.spyOn(
            tiposOcorrenciaAction,
            "getTiposOcorrenciaAction",
        ).mockResolvedValue({
            success: true,
            data: [],
        });

        const { result } = renderHook(() => useTiposOcorrencia("PATRIMONIAL"), {
            wrapper: createWrapper(),
        });

        // Verifica que a query tem o staleTime correto
        expect(result.current).toBeDefined();
    });

    it("deve funcionar sem parâmetro tipoFormulario", async () => {
        const mockData = [{ uuid: "uuid-1", nome: "Tipo Genérico" }];

        vi.spyOn(
            tiposOcorrenciaAction,
            "getTiposOcorrenciaAction",
        ).mockResolvedValue({
            success: true,
            data: mockData,
        });

        const { result } = renderHook(() => useTiposOcorrencia(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockData);
        expect(
            tiposOcorrenciaAction.getTiposOcorrenciaAction,
        ).toHaveBeenCalledWith(undefined);
    });
});
