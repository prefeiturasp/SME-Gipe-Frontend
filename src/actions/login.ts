import axios from "@/lib/axios";
import { AxiosError } from "axios";

type LoginData = {
    login: string;
    senha: string;
};

type LoginResponse = {
    // Campos de erro (presentes quando há falha)
    status?: number;
    detail?: string;
    operation_id?: string;
    // Dados do usuário (presentes quando login é bem-sucedido)
    nome?: string;
    cpf?: string;
    email?: string;
    login?: string;
    situacaoUsuario?: number;
    situacaoGrupo?: number;
    visoes?: string[];
    perfis_por_sistema?: {
        sistema: number;
        perfis: string[];
    }[];
};
export async function Login(data: LoginData): Promise<LoginResponse> {
    try {
        if (!process.env.AUTENTICA_CORESSO_API_URL) {
            throw new Error("AUTENTICA_CORESSO_API_URL não está definida");
        }

        if (!process.env.AUTENTICA_CORESSO_API_TOKEN) {
            throw new Error("AUTENTICA_CORESSO_API_TOKEN não está definida");
        }

        const token = process.env.AUTENTICA_CORESSO_API_TOKEN;
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        };

        const response = await axios.post("/autenticacao/", data, {
            headers: headers,
        });
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError && e.response) {
            return {
                status: e.response.status,
                detail: e.response.data.detail,
                operation_id: e.response.data.operation_id,
            };
        }
        throw e;
    }
}
