import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import {
    afterAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
    type Mock,
} from "vitest";
import {
    CategoriasDisponiveisAPI,
    getCategoriasDisponiveisAction,
} from "./categorias-disponiveis";

vi.mock("@/lib/axios-intercorrencias", () => ({ default: { get: vi.fn() } }));
vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

const axiosGetMock = apiIntercorrencias.get as Mock;
const cookiesMock = cookies as Mock;

describe("getCategoriasDisponiveisAction", () => {
    const originalEnv = process.env;
    const mockAuthToken = "mock-auth-token";

    beforeEach(() => {
        vi.resetAllMocks();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("deve retornar erro se não houver token", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        const result = await getCategoriasDisponiveisAction();

        expect(axiosGetMock).not.toHaveBeenCalled();
        expect(result).toEqual({
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        });
    });

    it("deve retornar dados corretamente quando a API retorna sucesso", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });

        const mockData: CategoriasDisponiveisAPI = {
            motivo_ocorrencia: [{ label: "Bullying", value: "bullying" }],
            genero: [{ label: "Masculino", value: "masculino" }],
            grupo_etnico_racial: [{ label: "Pardo", value: "pardo" }],
            etapa_escolar: [
                {
                    label: "Ensino Fundamental II",
                    value: "ensino_fundamental_2",
                },
            ],
            frequencia_escolar: [{ label: "Regular", value: "regular" }],
        };

        axiosGetMock.mockResolvedValueOnce({ data: mockData });

        const result = await getCategoriasDisponiveisAction();

        expect(axiosGetMock).toHaveBeenCalledWith(
            "diretor/categorias-disponiveis/",
            { headers: { Authorization: `Bearer ${mockAuthToken}` } },
        );

        expect(result).toEqual({ success: true, data: mockData });
    });

    it("deve retornar erro 401 para não autorizado", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        axiosGetMock.mockRejectedValueOnce({
            response: { status: 401 },
        } as AxiosError);

        const result = await getCategoriasDisponiveisAction();

        expect(result).toEqual({
            success: false,
            error: "Não autorizado. Faça login novamente.",
        });
    });

    it("deve retornar erro 400 quando categorias não encontradas", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        axiosGetMock.mockRejectedValueOnce({
            response: { status: 400 },
        } as AxiosError);

        const result = await getCategoriasDisponiveisAction();

        expect(result).toEqual({
            success: false,
            error: "Erro ao buscar as categorias",
        });
    });

    it("deve retornar erro 500 para erro interno do servidor", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        axiosGetMock.mockRejectedValueOnce({
            response: { status: 500 },
        } as AxiosError);

        const result = await getCategoriasDisponiveisAction();

        expect(result).toEqual({
            success: false,
            error: "Erro interno no servidor",
        });
    });

    it("deve retornar erro com detail da API", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        axiosGetMock.mockRejectedValueOnce({
            response: { data: { detail: "Erro específico" } },
        } as AxiosError);

        const result = await getCategoriasDisponiveisAction();

        expect(result).toEqual({ success: false, error: "Erro específico" });
    });

    it("deve retornar erro com message genérica", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: mockAuthToken }),
        });
        axiosGetMock.mockRejectedValueOnce({
            message: "Erro desconhecido",
        } as AxiosError);

        const result = await getCategoriasDisponiveisAction();

        expect(result).toEqual({ success: false, error: "Erro desconhecido" });
    });
});
