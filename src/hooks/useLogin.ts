import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginSuccessResponse {
    name: string;
    email: string;
    cpf: string;
    login: string;
    visoes: unknown[];
    cargo: string;
    token: string;
}

export interface LoginErrorResponse {
    detail: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const useLogin = () => {
    const setUser = useUserStore((state) => state.setUser);
    return useMutation<LoginSuccessResponse, LoginErrorResponse, LoginRequest>({
        mutationFn: async (credentials: LoginRequest) => {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Erro na autenticação");
            }

            setUser({
                nome: data.name,
                email: data.email,
                cargo: data.cargo.nome,
            });

            return data;
        },
    });
};

export default useLogin;
