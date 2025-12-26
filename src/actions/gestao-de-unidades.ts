"use server"

import axios from "axios";
import { cookies } from "next/headers";

export async function getUnidades(ativa?: boolean, dre?: string) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;

    try {

        const cookieStore = cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return {
                success: false,
                error: "Token de autenticação não encontrado",
            };
        }

        const { data } = await axios.get(`${API_URL}/unidades/gestao-unidades/`, {
            params: { ativa, dre },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch {
        throw new Error("Não foi possível buscar as unidades");
    }
}
