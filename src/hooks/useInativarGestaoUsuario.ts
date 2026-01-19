import { inativarGestaoUsuarioAction } from "@/actions/inativar-gestao-usuario";
import { useMutation } from "@tanstack/react-query";

export function useInativarGestaoUsuario() {
    return useMutation({
        mutationFn: async ({ uuid, motivo_inativacao }: { uuid: string; motivo_inativacao: string }) => {
            return inativarGestaoUsuarioAction(uuid, motivo_inativacao);
        },
    });
}
