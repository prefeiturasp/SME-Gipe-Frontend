"use server";

import {
    createAuthHeaders,
    getAuthToken,
    validateAuthToken,
} from "@/lib/actionUtils";
import api from "@/lib/axios";
import type {
    ConfirmarEmailErrorResponse,
    ConfirmarEmailRequest,
    ConfirmarEmailResult,
} from "@/types/confirmar-email";
import { AxiosError } from "axios";

export async function confirmarEmailAction(
    code: ConfirmarEmailRequest,
): Promise<ConfirmarEmailResult> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await api.put(
            `/alteracao-email/validar/${code.code}/`,
            null,
            { headers: createAuthHeaders(token) },
        );

        return { success: true, new_mail: response.data.email };
    } catch (err) {
        const error = err as AxiosError<ConfirmarEmailErrorResponse>;

        let message = "Ocorreu um erro ao tentar confirmar seu Email.";
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
