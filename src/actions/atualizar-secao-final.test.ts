import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { atualizarSecaoFinal } from "./atualizar-secao-final";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-intercorrencias", () => ({
    default: {
        put: vi.fn(),
    },
}));

describe("atualizarSecaoFinal", () => {
    const mockToken = "mock-token-123";
    const mockUuid = "test-uuid-123";
    const mockBody = {
        unidade_codigo_eol: "123456",
        dre_codigo_eol: "DRE-01",
        declarante: "declarante-uuid",
        comunicacao_seguranca_publica: "sim",
    };

    const mockResponse = {
        uuid: mockUuid,
        unidade_codigo_eol: "123456",
        dre_codigo_eol: "DRE-01",
        declarante_detalhes: {
            uuid: "declarante-uuid",
            declarante: "Diretor",
        },
        comunicacao_seguranca_publica: "sim",
        protocolo_acionado: "alerta",
        status_display: "Em andamento",
        status_extra: "Pendente",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve atualizar a seção final com sucesso", async () => {
        vi.mocked(cookies).mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        } as never);

        vi.mocked(apiIntercorrencias.put).mockResolvedValue({
            data: mockResponse,
        } as never);

        const result = await atualizarSecaoFinal({
            uuid: mockUuid,
            body: mockBody,
        });

        expect(result).toEqual({
            success: true,
            data: mockResponse,
        });

        expect(apiIntercorrencias.put).toHaveBeenCalledWith(
            `/diretor/${mockUuid}/secao-final/`,
            mockBody,
            {
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
            },
        );
    });

    it("deve retornar erro quando o token não estiver disponível", async () => {
        vi.mocked(cookies).mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        } as never);

        const result = await atualizarSecaoFinal({
            uuid: mockUuid,
            body: mockBody,
        });

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });

        expect(apiIntercorrencias.put).not.toHaveBeenCalled();
    });

    it("deve retornar erro 401 quando não autorizado", async () => {
        vi.mocked(cookies).mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        } as never);

        const axiosError = {
            response: {
                status: 401,
            },
        } as AxiosError;

        vi.mocked(apiIntercorrencias.put).mockRejectedValue(axiosError);

        const result = await atualizarSecaoFinal({
            uuid: mockUuid,
            body: mockBody,
        });

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro customizado do backend quando disponível", async () => {
        vi.mocked(cookies).mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        } as never);

        const errorMessage = "Dados inválidos";
        const axiosError = {
            response: {
                status: 400,
                data: {
                    detail: errorMessage,
                },
            },
        } as AxiosError<{ detail: string }>;

        vi.mocked(apiIntercorrencias.put).mockRejectedValue(axiosError);

        const result = await atualizarSecaoFinal({
            uuid: mockUuid,
            body: mockBody,
        });

        expect(result).toEqual({
            success: false,
            error: errorMessage,
        });
    });

    it("deve retornar erro genérico quando não houver mensagem específica", async () => {
        vi.mocked(cookies).mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        } as never);

        const axiosError = {
            response: {
                status: 500,
            },
        } as AxiosError;

        vi.mocked(apiIntercorrencias.put).mockRejectedValue(axiosError);

        const result = await atualizarSecaoFinal({
            uuid: mockUuid,
            body: mockBody,
        });

        expect(result).toEqual({
            success: false,
            error: "Erro ao atualizar seção final",
        });
    });
});
