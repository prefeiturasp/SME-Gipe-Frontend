import { useMutation } from "@tanstack/react-query";
import { recuperarSenhaAction } from "@/actions/recuperar-senha";

const useRecuperarSenha = () => {
    return useMutation({
        mutationFn: recuperarSenhaAction,
    });
};

export default useRecuperarSenha;
