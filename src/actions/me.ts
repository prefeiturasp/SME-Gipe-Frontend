"use server";

import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { User } from "@/stores/useUserStore";

type MeResult =
    | { success: true; data: User }
    | { success: false; error: string };

export async function getMeAction(): Promise<MeResult> {
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

        const { data } = await axios.get<User>(`${API_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        return { success: true, data };
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const error = err as AxiosError<{ code?: string }>;
            if (
                error.response?.data?.code === "token_not_valid" ||
                error.response?.status === 401
            ) {
                cookies().delete("auth_token");
            }
        }

        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao buscar os dados do usuário";
        if (error.response?.status === 500) {
            message = "Erro interno no servidor";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }
        return { success: false, error: message };
    }
}
