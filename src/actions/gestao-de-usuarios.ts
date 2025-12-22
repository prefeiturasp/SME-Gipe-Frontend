"use server";

import axios from "axios";
import { cookies } from "next/headers";

export async function getUsuarios(ativo?: boolean, dre?: string, unidade?: string, pendente_aprovacao?: boolean) {
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

        const { data } = await axios.get(`${API_URL}/users/gestao-usuarios`, {
            params: {ativo, dre, unidade, pendente_aprovacao},
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch {
        throw new Error("Não foi possível buscar os usuários");
    }
}
