import {
    atualizarUnidadeAction,
    type AtualizarUnidadeRequest,
} from "@/actions/atualizar-unidade";
import { useMutation } from "@tanstack/react-query";

export function useAtualizarUnidade(uuid: string) {
    return useMutation({
        mutationFn: (data: AtualizarUnidadeRequest) =>
            atualizarUnidadeAction(uuid, data),
        onSuccess: (response) => {
            return response;
        },
    });
}
