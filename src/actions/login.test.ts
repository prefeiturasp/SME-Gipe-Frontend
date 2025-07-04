import {
    describe,
    it,
    expect,
    beforeEach,
    afterAll,
    vi,
    type Mock,
} from "vitest";
import { Login } from "./login";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

vi.mock("@/lib/axios", () => ({
    __esModule: true,
    default: {
        post: vi.fn(),
    },
}));

const axiosPostMock = axios.post as unknown as Mock;

describe("Login action", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetAllMocks();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("lança erro se AUTENTICA_CORESSO_API_URL não está definida", async () => {
        delete process.env.AUTENTICA_CORESSO_API_URL;
        process.env.AUTENTICA_CORESSO_API_TOKEN = "token";
        await expect(Login({ login: "u", senha: "p" })).rejects.toThrow(
            "AUTENTICA_CORESSO_API_URL não está definida"
        );
    });

    it("lança erro se AUTENTICA_CORESSO_API_TOKEN não está definida", async () => {
        process.env.AUTENTICA_CORESSO_API_URL = "https://api";
        delete process.env.AUTENTICA_CORESSO_API_TOKEN;
        await expect(Login({ login: "u", senha: "p" })).rejects.toThrow(
            "AUTENTICA_CORESSO_API_TOKEN não está definida"
        );
    });

    it("retorna dados do usuário quando axios.post resolve com sucesso", async () => {
        process.env.AUTENTICA_CORESSO_API_URL = "https://api";
        process.env.AUTENTICA_CORESSO_API_TOKEN = "token123";

        const fakeResponse = {
            data: {
                nome: "Fulano",
                cpf: "00011122233",
                email: "f@d.com",
                login: "fulano",
                situacaoUsuario: 1,
                situacaoGrupo: 2,
                visoes: ["A", "B"],
                perfis_por_sistema: [{ sistema: 1, perfis: ["X"] }],
            },
        };
        axiosPostMock.mockResolvedValueOnce(fakeResponse);

        const result = await Login({ login: "fulano", senha: "senha" });

        expect(axiosPostMock).toHaveBeenCalledWith(
            "/autenticacao/",
            { login: "fulano", senha: "senha" },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token token123`,
                },
            }
        );
        expect(result).toEqual(fakeResponse.data);
    });

    it("retorna objeto de erro quando axios.post rejeita com AxiosError com response", async () => {
        process.env.AUTENTICA_CORESSO_API_URL = "https://api";
        process.env.AUTENTICA_CORESSO_API_TOKEN = "token123";

        const axiosError = new AxiosError(
            "fail",
            undefined,
            undefined,
            undefined,
            {
                status: 401,
                data: {
                    detail: "Credenciais inválidas",
                    operation_id: "op123",
                },
                headers: {},
                config: {},
                statusText: "",
            } as unknown as import("axios").AxiosResponse<
                { detail: string; operation_id: string },
                unknown
            >
        );
        axiosPostMock.mockRejectedValueOnce(axiosError);

        const result = await Login({ login: "u", senha: "p" });
        expect(result).toEqual({
            status: 401,
            detail: "Credenciais inválidas",
            operation_id: "op123",
        });
    });
});
