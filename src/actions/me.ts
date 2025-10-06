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
        const error = err as AxiosError;
        console.error("Erro ao buscar dados do usuário:", error.message);
        return { success: false, error: "Erro ao buscar os dados do usuário" };
    }
}
