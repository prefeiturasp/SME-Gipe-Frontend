import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/login";

const useLogin = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: loginAction,
        onSuccess: (response) => {
            if (!response.success) return;

            queryClient.invalidateQueries({ queryKey: ["me"] });
            router.push("/dashboard");
        },
    });
};

export default useLogin;
