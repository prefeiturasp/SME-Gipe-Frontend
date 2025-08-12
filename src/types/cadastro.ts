export type CadastroResult =
    | { success: true }
    | { success: false; error: string };

export interface CadastroRequest {
    username: string;
    password: string;
    name: string;
    cpf: string;
    email: string;
    unidades: string[];
}

export interface CadastroErrorResponse {
    mensagem: string;
}
