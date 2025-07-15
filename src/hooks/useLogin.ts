import { useMutation } from '@tanstack/react-query';
import { useUserStore } from "@/stores/useUserStore";
import { loginAction, LoginRequest } from '@/actions/login';
import { useRouter } from 'next/navigation';

export default function useLogin() {
        const setUser = useUserStore((state) => state.setUser);
        const router = useRouter();

    return useMutation<any, Error, LoginRequest>({
        mutationFn: async (credentials: LoginRequest) => {
            const response = await loginAction(credentials);
            return response;
        },
        onSuccess: (response) => {
            console.log(
                "-----------------------------------Resposta do login hook useLogin:",
                response
            );

            const { name, email, cargo } = response;

            if (!name || !email || !cargo?.nome) return;

            setUser({
                nome: name,
                email,
                cargo: cargo.nome,
            });

            router.push("/dashboard");
        },
        onError: (error) => {
            console.error('Erro na mutação de login:', error);
        },
    });
}
