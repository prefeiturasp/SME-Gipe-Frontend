import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";

interface FakeLoginInput {
    email: string;
    password: string;
}

interface FakeUser {
    name: string;
    email: string;
    role: string;
}

export const useMockLogin = () => {
    const queryClient = useQueryClient();
    const setUser = useUserStore((state) => state.setUser);

    return useMutation({
        mutationFn: async ({
            email,
            password,
        }: FakeLoginInput): Promise<FakeUser> => {
            // simula uma latência de rede
            await new Promise((resolve) => setTimeout(resolve, 500));

            // simula a resposta do backend
            if (email === "teste@teste.com" && password === "123456") {
                return {
                    name: "Usuário de Teste",
                    email,
                    role: "admin",
                };
            }

            throw new Error("Credenciais inválidas");
        },

        onSuccess: (user) => {
            setUser(user);
            queryClient.setQueryData(["user"], user);
        },
    });
};
