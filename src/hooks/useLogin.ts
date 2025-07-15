import { useMutation } from '@tanstack/react-query';
import { loginAction} from '@/actions/login';
import {
    LoginRequest,
} from '@/types/login';

import { useRouter } from 'next/navigation';
import { useUserStore } from "@/stores/useUserStore";



export default function useLogin() {
        const setUser = useUserStore((state) => state.setUser);
    const router = useRouter();

    return useMutation<any, Error, LoginRequest>({
        mutationFn: async (credentials: LoginRequest) => {
            const response = await loginAction(credentials);
            return response;
        },
        onSuccess: (data) => {
            console.log('Login realizado com sucesso:', data);

            // Aqui você pode armazenar o token/dados do usuário se necessário
            // Por exemplo: localStorage.setItem('authToken', data.token);

            // Redirecionar para dashboard ou página principal
            setUser({
                nome: data.nome,
                email: data.email,
                cargo: data.cargo.nome,
            });

            router.push("/dashboard");
        },
        onError: (error) => {
            console.error('Erro na mutação de login:', error);
        },
    });
}
