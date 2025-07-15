"use server";

import { cookies } from "next/headers";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    error?: string;
    data?: any;
}

export async function loginAction(credentials: LoginRequest): Promise<any> {
    try {
        const response = await fetch('https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Captura as mensagens de erro do backend Django
            const errorMessage = data.detail || 'Erro desconhecido no servidor';

            // Lança erro para que o React Query trate como falha
            throw new Error(errorMessage);
        }

        // Login bem-sucedido - retorna apenas os dados
        cookies().set("auth_token", data.token, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "lax",
        });

        return data;

    } catch (error) {
        console.error('Erro na server action de login:', error);

        // Se já é um Error conhecido, re-lança
        if (error instanceof Error) {
            throw error;
        }

        // Erro de conexão ou desconhecido
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    }
}
