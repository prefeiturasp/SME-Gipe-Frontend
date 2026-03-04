import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { SecaoNaoFurtoRouboBody } from "@/types/secao-nao-furto-roubo";
import type { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { atualizarSecaoNaoFurtoRoubo } from "./atualizar-secao-nao-furto-roubo";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/axios-intercorrencias", () => ({
    default: {
        put: vi.fn(),
    },
}));

describe("atualizarSecaoNaoFurtoRoubo", () => {
    const mockUuid = "test-uuid-123";
    const mockBody: SecaoNaoFurtoRouboBody = {
        tipos_ocorrencia: ["tipo-1", "tipo-2"],
        descricao_ocorrencia: "Descrição da ocorrência",
        envolvido: ["uuid-aluno"],
        tem_info_agressor_ou_vitima: "sim",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve atualizar a seção não furto e roubo com sucesso", async () => {
        const mockToken = "mock-auth-token";
        const mockResponse: AxiosResponse = {
            data: { uuid: mockUuid },
            status: 200,
            statusText: "OK",
            headers: {},
            config: {
                headers: {} as never,
            },
        };

        vi.mocked(cookies).mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        } as never);

        vi.mocked(apiIntercorrencias.put).mockResolvedValue(mockResponse);

        const result = await atualizarSecaoNaoFurtoRoubo(mockUuid, mockBody);

        expect(result).toEqual({ success: true, data: { uuid: mockUuid } });
        expect(apiIntercorrencias.put).toHaveBeenCalledWith(
            `/diretor/${mockUuid}/nao-furto-roubo/`,
            mockBody,
            {
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
            },
        );
    });

    it("deve retornar erro quando o token não está presente", async () => {
        vi.mocked(cookies).mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        } as never);

        const result = await atualizarSecaoNaoFurtoRoubo(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
        expect(apiIntercorrencias.put).not.toHaveBeenCalled();
    });

    it("deve retornar erro 401 quando não autorizado", async () => {
        const mockToken = "mock-auth-token";

        vi.mocked(cookies).mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        } as never);

        vi.mocked(apiIntercorrencias.put).mockRejectedValue({
            response: { status: 401 },
        });

        const result = await atualizarSecaoNaoFurtoRoubo(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro 404 quando ocorrência não encontrada", async () => {
        const mockToken = "mock-auth-token";

        vi.mocked(cookies).mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        } as never);

        vi.mocked(apiIntercorrencias.put).mockRejectedValue({
            response: { status: 404 },
        });

        const result = await atualizarSecaoNaoFurtoRoubo(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Ocorrência não encontrada",
        });
    });

    it("deve retornar erro 500 quando há erro no servidor", async () => {
        const mockToken = "mock-auth-token";

        vi.mocked(cookies).mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        } as never);

        vi.mocked(apiIntercorrencias.put).mockRejectedValue({
            response: { status: 500 },
        });

        const result = await atualizarSecaoNaoFurtoRoubo(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar mensagem de erro customizada do backend", async () => {
        const mockToken = "mock-auth-token";
        const customError = "Erro customizado do backend";

        vi.mocked(cookies).mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        } as never);

        vi.mocked(apiIntercorrencias.put).mockRejectedValue({
            response: {
                status: 400,
                data: { detail: customError },
            },
        });

        const result = await atualizarSecaoNaoFurtoRoubo(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: customError,
        });
    });

    it("deve retornar erro genérico quando não há resposta do servidor", async () => {
        const mockToken = "mock-auth-token";

        vi.mocked(cookies).mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockToken }),
        } as never);

        vi.mocked(apiIntercorrencias.put).mockRejectedValue({
            message: "Network Error",
        });

        const result = await atualizarSecaoNaoFurtoRoubo(mockUuid, mockBody);

        expect(result).toEqual({
            success: false,
            error: "Network Error",
        });
    });
});
