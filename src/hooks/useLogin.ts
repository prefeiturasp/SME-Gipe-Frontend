import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/login";
import type {
    LoginRequest,
    LoginSuccessResponse,
} from "@/types/login";

const useLogin = () => {
    const setUser = useUserStore((state) => state.setUser);
    const router = useRouter();

    return useMutation<LoginSuccessResponse, Error, LoginRequest>({ // Alterado para Error
        mutationFn: loginAction,
        onSuccess: (data) => {
            setUser({
                nome: data.name,
                email: data.email,
                cargo: data.cargo.nome,
            });
            router.push("/dashboard");
        },
    });
};

export default useLogin;
