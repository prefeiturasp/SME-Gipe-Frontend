"use server";

import apiIntercorrencias from "@/lib/axios-intercorrencias";
import { cookies } from "next/headers";

export type OcorrenciaAPI = {
    id: number;
    uuid: string;
    data_ocorrencia: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    sobre_furto_roubo_invasao_depredacao: boolean;
    user_username: string;
    criado_em: string;
    atualizado_em: string;
    tipos_ocorrencia?: string[];
    descricao?: string;
    status?: string;
    smart_sampa?: string;
};

export async function obterOcorrencia(uuid: string): Promise<OcorrenciaAPI> {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        throw new Error("Usuário não autenticado");
    }

    const { data } = await apiIntercorrencias.get<OcorrenciaAPI>(
        `/intercorrencias/${uuid}/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return data;
}
