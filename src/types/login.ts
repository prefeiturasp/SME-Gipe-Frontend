export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginSuccessResponse {
    name: string;
    email: string;
    cpf: string;
    login: string;
    visoes: unknown[];
    cargo: {
        nome: string;
        id: string;
    };
    token: string;
}

export interface LoginErrorResponse {
    detail: string;
}
