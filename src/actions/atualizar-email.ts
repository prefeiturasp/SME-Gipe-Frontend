"use server";

import {
    createAuthHeaders,
    getAuthToken,
    validateAuthToken,
} from "@/lib/actionUtils";
import api from "@/lib/axios";
import type {
    AtualizarEmailErrorResponse,
    AtualizarEmailRequest,
    AtualizarEmailResult,
} from "@/types/atualizar-email";
import { AxiosError } from "axios";

export async function atualizarEmailAction(
    dados: AtualizarEmailRequest,
): Promise<AtualizarEmailResult> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        await api.post("/alteracao-email/solicitar/", dados, {
            headers: createAuthHeaders(token),
        });

        return { success: true };
    } catch (err) {
        const error = err as AxiosError<AtualizarEmailErrorResponse>;

        let message = "Ocorreu um erro ao tentar atualizar seu Email.";
        let field: string | undefined;

        if (error.response?.status === 401) {
            message = "Sua sessão expirou. Por favor, faça login novamente.";
        } else if (error.response?.status === 500) {
            message = "Erro interno no servidor. Tente novamente mais tarde.";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }

        if (error.response?.data?.field) {
            field = error.response.data.field;
        }

        return { success: false, error: message, field };
    }
}
