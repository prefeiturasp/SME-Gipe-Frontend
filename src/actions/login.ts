"use server";

import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import {
    LoginRequest,
    LoginSuccessResponse,
    LoginErrorResponse,
} from "@/types/login";

export async function loginAction(
    credentials: LoginRequest
): Promise<LoginSuccessResponse> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;

    try {
        const { data } = await axios.post<LoginSuccessResponse>(
            `${API_URL}/users/login`,
            credentials,
            { withCredentials: true }
        );

        cookies().set("auth_token", data.token, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "lax",
        });

        console.log(
            "-----------------------------------Resposta do login action:",
            data
        );

        return data;
    } catch (err) {
        const error = err as AxiosError<LoginErrorResponse>;

        console.log(
            "-----------------------------------Erro do login action:",
            error
        );

        const message =
            error.response?.status === 500
                ? "Erro interno no servidor"
                : error.response?.data?.detail ||
                  error.message ||
                  "Erro na autenticação";

        throw new Error(message);
    }
}
