"use server";

import { cookies } from "next/headers";
import { AxiosError } from "axios";
import apiIntercorrencias from "@/lib/axios-intercorrencias";

type AtualizarSecaoFinalParams = {
    uuid: string;
    body: {
        unidade_codigo_eol: string;
        dre_codigo_eol: string;
        declarante: string;
        comunicacao_seguranca_publica: string;
        protocolo_acionado: string;
    };
};

type DeclaranteDetalhes = {
    uuid: string;
    declarante: string;
};

type AtualizarSecaoFinalResponse = {
    uuid: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    declarante_detalhes: DeclaranteDetalhes;
    comunicacao_seguranca_publica: string;
    protocolo_acionado: string;
    status_display: string;
    status_extra: string;
};

export async function atualizarSecaoFinal({
    uuid,
    body,
}: AtualizarSecaoFinalParams): Promise<
    | { success: true; data: AtualizarSecaoFinalResponse }
    | { success: false; error: string }
> {
    try {
        const cookieStore = cookies();
        const authToken = cookieStore.get("auth_token")?.value;

        if (!authToken) {
            return {
                success: false,
                error: "Usuário não autenticado. Token não encontrado.",
            };
        }

        const response =
            await apiIntercorrencias.put<AtualizarSecaoFinalResponse>(
                `/diretor/${uuid}/secao-final/`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

        return { success: true, data: response.data };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao atualizar seção final";

        if (error.response?.status === 401) {
            message = "Não autorizado. Faça login novamente.";
        } else if (error.response?.data?.detail) {
            message = error.response.data.detail;
        }

        return { success: false, error: message };
    }
}
