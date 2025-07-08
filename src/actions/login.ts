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

        return data;
    } catch (err) {
        const error = err as AxiosError<LoginErrorResponse>;
        const message = error.response?.data?.detail || "Erro na autenticação";

        throw new Error(message);
    }
}
