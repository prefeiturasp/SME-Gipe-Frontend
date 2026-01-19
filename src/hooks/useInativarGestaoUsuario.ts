import { inativarGestaoUsuarioAction } from "@/actions/inativar-gestao-usuario";
import { useMutation } from "@tanstack/react-query";

export function useInativarGestaoUsuario() {
    return useMutation({
        mutationFn: async (uuid: string) => {
            return inativarGestaoUsuarioAction(uuid);
        },
    });
}
