import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/login";

const useLogin = () => {
    const setUser = useUserStore((state) => state.setUser);
    const router = useRouter();

    return useMutation({
        mutationFn: loginAction,
        onSuccess: (response) => {
            if (!response.success) return;

            const { name, login, perfil_acesso, unidade_lotacao } =
                response.data;

            if (!name || !login || !perfil_acesso || !unidade_lotacao) return;

            setUser({
                nome: name,
                identificador: login,
                perfil_acesso: perfil_acesso.nome,
                unidade: unidade_lotacao.nomeUnidade,
            });

            router.push("/dashboard");
        },
    });
};

export default useLogin;
