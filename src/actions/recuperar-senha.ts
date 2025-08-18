"use server";

import axios, { AxiosError } from "axios";
import {
    RecuperarSenhaRequest,
    RecuperarSenhaErrorResponse,
    RecuperarSenhaSuccessResponse,
} from "@/types/recuperar-senha";

export type RecuperarSenhaResult =
    | {
          success: true;
          message: string;
      }
    | {
          success: false;
          error: string;
      };

export async function recuperarSenhaAction(
    username: RecuperarSenhaRequest
): Promise<RecuperarSenhaResult> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;
    try {
        const { data } = await axios.post<RecuperarSenhaSuccessResponse>(
            `${API_URL}/users/esqueci-senha`,
            username
        );
        return { success: true, message: data.detail };
    } catch (err) {
        const error = err as AxiosError<RecuperarSenhaErrorResponse>;
        let message = "Erro ao recuperar senha";
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
