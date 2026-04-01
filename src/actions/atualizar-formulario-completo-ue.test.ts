import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { FormularioCompletoUEBody } from "@/types/formulario-completo-ue";
import { AxiosError, AxiosRequestHeaders } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { atualizarFormularioCompletoUE } from "./atualizar-formulario-completo-ue";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-intercorrencias", () => ({
    default: {
        put: vi.fn(),
    },
}));

const cookiesMock = cookies as Mock;

describe("atualizarFormularioCompletoUE action", () => {
    const mockUuid = "test-uuid-123";
    const mockBody: FormularioCompletoUEBody = {
        data_ocorrencia: "2024-01-01T10:00:00.000Z",
        unidade_codigo_eol: "123456",
        dre_codigo_eol: "DRE-001",
        sobre_furto_roubo_invasao_depredacao: true,
        tipos_ocorrencia: ["Furto"],
        descricao_ocorrencia: "Descrição do furto",
        smart_sampa_situacao: "monitorada",
        envolvido: [],
        tem_info_agressor_ou_vitima: "nao",
        declarante: "Diretor",
        comunicacao_seguranca_publica: "sim",
        protocolo_acionado: "ameaca",
    };
    const mockAuthToken = "test-token";

    beforeEach(() => {
        vi.clearAllMocks();
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
    });

    it("deve atualizar o formulário completo da UE com sucesso", async () => {
        const mockResponse = {
            data: {
                uuid: mockUuid,
                data_ocorrencia: "2024-01-01T10:00:00.000Z",
                unidade_codigo_eol: "123456",
                dre_codigo_eol: "DRE-001",
                sobre_furto_roubo_invasao_depredacao: true,
                descricao_ocorrencia: "Descrição do furto",
                smart_sampa_situacao: "monitorada",
                tem_info_agressor_ou_vitima: "nao",
                comunicacao_seguranca_publica: "sim",
                protocolo_acionado: "ameaca",
            },
        };

        (apiIntercorrencias.put as Mock).mockResolvedValueOnce(mockResponse);

        const result = await atualizarFormularioCompletoUE(mockUuid, mockBody);

        expect(apiIntercorrencias.put).toHaveBeenCalledWith(
            `/diretor/${mockUuid}/`,
            mockBody,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            },
        );

        expect(result).toEqual({ success: true, data: mockResponse.data });
    });

    it("deve retornar erro quando o usuário não estiver autenticado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await atualizarFormularioCompletoUE(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
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

        const result = await atualizarFormularioCompletoUE(mockUuid, mockBody);

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

        const result = await atualizarFormularioCompletoUE(mockUuid, mockBody);

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

        const result = await atualizarFormularioCompletoUE(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar erro com mensagem detalhada quando disponível", async () => {
        const errorDetail = "Detalhe específico do erro";
        const error = new AxiosError("Bad Request");
        error.response = {
            status: 400,
            data: { detail: errorDetail },
            statusText: "Bad Request",
            headers: {},
            config: { headers: {} as AxiosRequestHeaders },
        };
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarFormularioCompletoUE(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: errorDetail,
        });
    });

    it("deve retornar uma mensagem de erro genérica", async () => {
        const errorMessage = "Network Error";
        const error = new AxiosError(errorMessage);
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarFormularioCompletoUE(mockUuid, mockBody);

        expect(result).toEqual({ success: false, error: errorMessage });
    });

    it("deve retornar a mensagem de erro padrão se nenhuma outra se aplicar", async () => {
        const error = new AxiosError();
        vi.mocked(apiIntercorrencias.put).mockRejectedValue(error);

        const result = await atualizarFormularioCompletoUE(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro ao atualizar formulário completo da UE",
        });
    });

    it("deve enviar todos os campos corretamente na requisição", async () => {
        const mockResponse = {
            data: {
                uuid: mockUuid,
                ...mockBody,
            },
        };

        const putMock = vi
            .mocked(apiIntercorrencias.put)
            .mockResolvedValueOnce(mockResponse);

        await atualizarFormularioCompletoUE(mockUuid, mockBody);

        expect(putMock).toHaveBeenCalledWith(
            `/diretor/${mockUuid}/`,
            mockBody,
            expect.any(Object),
        );
    });

    it("deve atualizar formulário com campos opcionais de informações adicionais", async () => {
        const bodyComInfoAdicionais: FormularioCompletoUEBody = {
            ...mockBody,
            sobre_furto_roubo_invasao_depredacao: false,
            tem_info_agressor_ou_vitima: "sim",
            pessoas_agressoras: [
                {
                    nome: "João Silva",
                    idade: 15,
                    genero: "Masculino",
                    grupo_etnico_racial: "Branco",
                    etapa_escolar: "Fundamental II",
                    frequencia_escolar: "Regular",
                    interacao_ambiente_escolar: "Boa",
                    nacionalidade: "Brasileira",
                    pessoa_com_deficiencia: false,
                },
            ],
            motivacao_ocorrencia: ["Bullying"],
            notificado_conselho_tutelar: true,
            ocorrencia_acompanhada_pelo: "naapa",
        };

        const mockResponse = {
            data: {
                uuid: mockUuid,
                ...bodyComInfoAdicionais,
            },
        };

        (apiIntercorrencias.put as Mock).mockResolvedValueOnce(mockResponse);

        const result = await atualizarFormularioCompletoUE(
            mockUuid,
            bodyComInfoAdicionais,
        );

        expect(apiIntercorrencias.put).toHaveBeenCalledWith(
            `/diretor/${mockUuid}/`,
            bodyComInfoAdicionais,
            {
                headers: {
                    Authorization: `Bearer ${mockAuthToken}`,
                },
            },
        );

        expect(result).toEqual({ success: true, data: mockResponse.data });
    });

    it("deve usar o endpoint correto /diretor/:uuid/", async () => {
        const mockResponse = {
            data: {
                uuid: mockUuid,
                ...mockBody,
            },
        };

        const putMock = vi
            .mocked(apiIntercorrencias.put)
            .mockResolvedValueOnce(mockResponse);

        await atualizarFormularioCompletoUE(mockUuid, mockBody);

        expect(putMock).toHaveBeenCalledWith(
            `/diretor/${mockUuid}/`,
            expect.any(Object),
            expect.any(Object),
        );
    });
});
