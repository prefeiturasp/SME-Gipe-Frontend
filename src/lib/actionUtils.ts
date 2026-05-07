import { AxiosError } from "axios";
import { cookies } from "next/headers";

export type ActionResult<T = void> =
    | (T extends void
          ? { success: true; data?: undefined }
          : { success: true; data: T })
    | { success: false; error: string; field?: string };

export function validateAuthToken(): ActionResult | null {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
        return {
            success: false,
            error: "Usuário não autenticado. Token não encontrado.",
        };
    }
    return null;
}

export function getAuthToken(): string | undefined {
    const cookieStore = cookies();
    return cookieStore.get("auth_token")?.value;
}

export function createAuthHeaders(token: string): Record<string, string> {
    return { Authorization: `Bearer ${token}` };
}

export function handleActionError(
    err: unknown,
    defaultMessage: string,
): { success: false; error: string } {
    const error = err as AxiosError<{ detail?: string }>;
    let message = defaultMessage;

    if (error.response?.status === 401) {
        message = "Não autorizado. Faça login novamente.";
    } else if (error.response?.status === 500) {
        message = "Erro interno no servidor";
    } else if (error.response?.data?.detail) {
        message = error.response.data.detail;
    } else if (error.message) {
        message = error.message;
    }

    return { success: false, error: message };
}
