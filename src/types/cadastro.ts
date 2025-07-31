export type CadastroResult =
    | { success: true }
    | { success: false; error: string };

export interface CadastroRequest {
    dre: string;
    ue: string;
    fullName: string;
    cpf: string;
    email: string;
}

export interface CadastroErrorResponse {
    detail: string;
}
