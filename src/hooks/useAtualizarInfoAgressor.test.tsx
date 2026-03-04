import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtualizarInfoAgressor } from "./useAtualizarInfoAgressor";
import * as atualizarInfoAgressorAction from "@/actions/atualizar-info-agressor";
import { InfoAgressorBody } from "@/types/info-agressor";

vi.mock("@/actions/atualizar-info-agressor");

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

describe("useAtualizarInfoAgressor", () => {
    const mockUuid = "test-uuid-123";
    const mockBody: InfoAgressorBody = {
        unidade_codigo_eol: "123456",
        dre_codigo_eol: "DRE-001",
        nome_pessoa_agressora: "Kleber Machado",
        idade_pessoa_agressora: 35,
        motivacao_ocorrencia: ["homofobia", "racismo"],
        genero_pessoa_agressora: "mulher_cis",
        grupo_etnico_racial: "indigena",
        etapa_escolar: "ensino_medio",
        frequencia_escolar: "transferido_estadual",
        interacao_ambiente_escolar:
            "Como é a interação da pessoa agressora no ambiente escolar?",
        redes_protecao_acompanhamento: "CRAS, NAAPA",
        notificado_conselho_tutelar: true,
        acompanhado_naapa: false
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve atualizar as informações adicionais com sucesso", async () => {
        const mockResponse = {
            uuid: mockUuid,
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-001",
            nome_pessoa_agressora: "Kleber Machado",
            idade_pessoa_agressora: 35,
            motivacao_ocorrencia: ["homofobia", "racismo"],
            motivacao_ocorrencia_display: "Homofobia, Racismo",
            genero_pessoa_agressora: "mulher_cis",
            grupo_etnico_racial: "indigena",
            etapa_escolar: "ensino_medio",
            frequencia_escolar: "transferido_estadual",
            interacao_ambiente_escolar:
                "Como é a interação da pessoa agressora no ambiente escolar?",
            redes_protecao_acompanhamento: "CRAS, NAAPA",
            notificado_conselho_tutelar: true,
            acompanhado_naapa: false
        };

        vi.spyOn(
            atualizarInfoAgressorAction,
            "atualizarInfoAgressor"
        ).mockResolvedValue({
            success: true,
            data: mockResponse,
        });

        const { result } = renderHook(() => useAtualizarInfoAgressor(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual({
            success: true,
            data: mockResponse,
        });
        expect(
            atualizarInfoAgressorAction.atualizarInfoAgressor
        ).toHaveBeenCalledWith(mockUuid, mockBody);
    });

    it("deve retornar erro quando a atualização falha", async () => {
        const errorMessage = "Erro ao atualizar informações adicionais";
        vi.spyOn(
            atualizarInfoAgressorAction,
            "atualizarInfoAgressor"
        ).mockResolvedValue({
            success: false,
            error: errorMessage,
        });

        const { result } = renderHook(() => useAtualizarInfoAgressor(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual({
            success: false,
            error: errorMessage,
        });
    });

    it("deve lidar com erro de rede", async () => {
        vi.spyOn(
            atualizarInfoAgressorAction,
            "atualizarInfoAgressor"
        ).mockRejectedValue(new Error("Network Error"));

        const { result } = renderHook(() => useAtualizarInfoAgressor(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe("Network Error");
    });

    it("deve chamar a mutation com os parâmetros corretos", async () => {
        const mockResponse = {
            uuid: mockUuid,
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-001",
            nome_pessoa_agressora: "Kleber Machado",
            idade_pessoa_agressora: 35,
            motivacao_ocorrencia: ["homofobia", "racismo"],
            motivacao_ocorrencia_display: "Homofobia, Racismo",
            genero_pessoa_agressora: "mulher_cis",
            grupo_etnico_racial: "indigena",
            etapa_escolar: "ensino_medio",
            frequencia_escolar: "transferido_estadual",
            interacao_ambiente_escolar:
                "Como é a interação da pessoa agressora no ambiente escolar?",
            redes_protecao_acompanhamento: "CRAS, NAAPA",
            notificado_conselho_tutelar: true,
            acompanhado_naapa: false
        };

        const spy = vi
            .spyOn(atualizarInfoAgressorAction, "atualizarInfoAgressor")
            .mockResolvedValue({
                success: true,
                data: mockResponse,
            });

        const { result } = renderHook(() => useAtualizarInfoAgressor(), {
            wrapper: createWrapper(),
        });

        const customBody: InfoAgressorBody = {
            ...mockBody,
            nome_pessoa_agressora: "João Silva",
            idade_pessoa_agressora: 25,
        };

        result.current.mutate({ uuid: "custom-uuid", body: customBody });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(spy).toHaveBeenCalledWith("custom-uuid", customBody);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
