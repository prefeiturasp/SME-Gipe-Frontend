"use server";

import api from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

type ConsultarRfUsuarioResponse = {
    cpf: string;
    nome: string;
    codigoRf: string;
    email: string;
    dreCodigo: string | null;
    emailValido: boolean;
};

type ActionResult =
    | {
          success: true;
          data: ConsultarRfUsuarioResponse;
      }
    | {
          success: false;
          error: string;
          field?: string;
      };

export async function consultarRfUsuarioAction(
    rf: string,
): Promise<ActionResult> {
    const authToken = cookies().get("auth_token");

    if (!authToken?.value) {
        return {
            success: false,
            error: "Token de autenticação não encontrado",
        };
    }

    try {
        const response = await api.get<ConsultarRfUsuarioResponse>(
            `/users/gestao-usuarios/consultar-core-sso/`,
            {
                params: { rf },
                headers: {
                    Authorization: `Bearer ${authToken.value}`,
                },
            },
        );

        return {
            success: true,
            data: response.data,
        };
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        let message = "Erro ao buscar RF.";

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
}
