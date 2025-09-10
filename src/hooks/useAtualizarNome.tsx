import { useMutation } from "@tanstack/react-query";
import { atualizarNomeAction } from "@/actions/atualizar-nome";

const useAtualizarNome = () => {
    return useMutation({
        mutationFn: atualizarNomeAction,
    });
};

export default useAtualizarNome;
