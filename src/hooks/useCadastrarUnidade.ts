import { useMutation } from "@tanstack/react-query";
import {
    cadastrarUnidadeAction,
    UnidadeCadastroPayload,
} from "@/actions/cadastrar-unidade";

export function useCadastrarUnidade() {
    return useMutation({
        mutationFn: async (payload: UnidadeCadastroPayload) => {
            return cadastrarUnidadeAction(payload);
        },
    });
}
