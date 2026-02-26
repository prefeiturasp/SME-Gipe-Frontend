import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { InfoAgressorBody } from "@/types/info-agressor";
import { AxiosError, AxiosRequestHeaders } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { atualizarInfoAgressor } from "./atualizar-info-agressor";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-intercorrencias", () => ({
    default: {
        put: vi.fn(),
    },
}));

const cookiesMock = cookies as Mock;

describe("atualizarInfoAgressor action", () => {
    const mockUuid = "test-uuid-123";
    const mockBody: InfoAgressorBody = {
        unidade_codigo_eol: "123456",
        dre_codigo_eol: "DRE-001",
        pessoas_agressoras: [{ nome: "Kleber Machado", idade: 35 }],
        motivacao_ocorrencia: ["homofobia", "racismo"],
        genero_pessoa_agressora: "mulher_cis",
        grupo_etnico_racial: "indigena",
        etapa_escolar: "ensino_medio",
        frequencia_escolar: "transferido_estadual",
        interacao_ambiente_escolar:
            "Como é a interação da pessoa agressora no ambiente escolar?",
        redes_protecao_acompanhamento: "CRAS, NAAPA",
        notificado_conselho_tutelar: true,
        acompanhado_naapa: false,
    };
    const mockAuthToken = "test-token";

    beforeEach(() => {
        vi.clearAllMocks();
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve atualizar as informações adicionais com sucesso", async () => {
        const mockResponse = {
            data: {
                uuid: mockUuid,
                unidade_codigo_eol: "123456",
                dre_codigo_eol: "DRE-001",
                pessoas_agressoras: [{ nome: "Kleber Machado", idade: 35 }],
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
                acompanhado_naapa: false,
            },
        };
        vi.mocked(apiIntercorrencias.put).mockResolvedValue(mockResponse);

        const result = await atualizarInfoAgressor(mockUuid, mockBody);

        expect(result).toEqual({ success: true, data: mockResponse.data });
        expect(cookies().get).toHaveBeenCalledWith("auth_token");
        expect(apiIntercorrencias.put).toHaveBeenCalledWith(
            `/diretor/${mockUuid}/info-agressor/`,
            mockBody,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            },
        );
    });

    it("deve retornar erro se o token de autenticação não for encontrado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await atualizarInfoAgressor(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
        expect(apiIntercorrencias.put).not.toHaveBeenCalled();
    });

    it("deve retornar erro 401 quando não autorizado", async () => {
        const error = new AxiosError("Unauthorized");
        error.response = {
            status: 401,
            data: {},
            statusText: "Unauthorized",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarInfoAgressor(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro 404 quando não encontrado", async () => {
        const error = new AxiosError("Not Found");
        error.response = {
            status: 404,
            data: {},
            statusText: "Not Found",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarInfoAgressor(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Ocorrência não encontrada",
        });
    });

    it("deve retornar erro 500 do servidor", async () => {
        const error = new AxiosError("Internal Server Error");
        error.response = {
            status: 500,
            data: {},
            statusText: "Internal Server Error",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarInfoAgressor(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar a mensagem de erro 'detail' da API", async () => {
        const detailMessage = "Um erro específico ocorreu.";
        const error = new AxiosError("Request failed");
        error.response = {
            status: 400,
            data: { detail: detailMessage },
            statusText: "Bad Request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarInfoAgressor(mockUuid, mockBody);

        expect(result).toEqual({ success: false, error: detailMessage });
    });

    it("deve retornar uma mensagem de erro genérica", async () => {
        const errorMessage = "Network Error";
        const error = new AxiosError(errorMessage);
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarInfoAgressor(mockUuid, mockBody);

        expect(result).toEqual({ success: false, error: errorMessage });
    });

    it("deve retornar a mensagem de erro padrão se nenhuma outra se aplicar", async () => {
        const error = new AxiosError();
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarInfoAgressor(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro ao atualizar informações adicionais",
        });
    });

    it("deve enviar todos os campos do body corretamente", async () => {
        const mockResponse = {
            data: {
                uuid: mockUuid,
                ...mockBody,
                motivacao_ocorrencia_display: "Homofobia, Racismo",
            },
        };
        vi.mocked(apiIntercorrencias.put).mockResolvedValue(mockResponse);

        await atualizarInfoAgressor(mockUuid, mockBody);

        expect(apiIntercorrencias.put).toHaveBeenCalledWith(
            `/diretor/${mockUuid}/info-agressor/`,
            expect.objectContaining({
                unidade_codigo_eol: "123456",
                dre_codigo_eol: "DRE-001",
                pessoas_agressoras: [{ nome: "Kleber Machado", idade: 35 }],
                motivacao_ocorrencia: ["homofobia", "racismo"],
                genero_pessoa_agressora: "mulher_cis",
                grupo_etnico_racial: "indigena",
                etapa_escolar: "ensino_medio",
                frequencia_escolar: "transferido_estadual",
                interacao_ambiente_escolar:
                    "Como é a interação da pessoa agressora no ambiente escolar?",
                redes_protecao_acompanhamento: "CRAS, NAAPA",
                notificado_conselho_tutelar: true,
                acompanhado_naapa: false,
            }),
            expect.any(Object),
        );
    });
});
