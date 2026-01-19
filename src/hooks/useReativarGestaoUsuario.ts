import { reativarGestaoUsuarioAction } from "@/actions/reativar-gestao-usuario";
import { useMutation } from "@tanstack/react-query";

export function useReativarGestaoUsuario() {
    return useMutation({
        mutationFn: async (uuid: string) => {
            return reativarGestaoUsuarioAction(uuid);
        },
    });
}
