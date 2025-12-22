import { useMutation } from "@tanstack/react-query";
import {
    atualizarGestaoUsuarioAction,
    type AtualizarGestaoUsuarioRequest,
} from "@/actions/atualizar-gestao-usuario";

export function useAtualizarGestaoUsuario(uuid: string) {
    return useMutation({
        mutationFn: (data: AtualizarGestaoUsuarioRequest) =>
            atualizarGestaoUsuarioAction(uuid, data),
        onSuccess: (response) => {
            return response;
        },
    });
}
