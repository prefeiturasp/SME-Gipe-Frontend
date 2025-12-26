"use server";

import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";

export const recusarUsuarioGestao = async (
    uuid: string,
    justificativa: string
): Promise<{ success: true } | { success: false; error: string }> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;
    try {
        const cookieStore = cookies();
        const authToken = cookieStore.get("auth_token")?.value;
        if (!authToken) {
            return {
                success: false,
                error: "Usuário não autenticado. Token não encontrado.",
            };
        }
        await axios.post(
            `${API_URL}/users/gestao-usuarios/${uuid}/reprovar/`,
            { justificativa },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return { success: true };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;

        let message = "Erro ao recusar usuário";
        if (error.response?.status === 500) {
            message = "Erro interno no servidor";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }
        return { success: false, error: message };
    }
};
