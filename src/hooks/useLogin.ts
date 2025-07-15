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

            const { name, email, cargo } = response.data;

            if (!name || !email || !cargo?.nome) return;

            setUser({
                nome: name,
                email,
                cargo: cargo.nome,
            });

            router.push("/dashboard");
        },
    });
};

export default useLogin;
