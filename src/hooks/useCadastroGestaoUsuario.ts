import { useMutation } from "@tanstack/react-query";
import {
    cadastroGestaoUsuarioAction,
    type CadastroGestaoUsuarioRequest,
} from "@/actions/cadastro-gestao-usuario";

export function useCadastroGestaoUsuario() {
    return useMutation({
        mutationFn: (data: CadastroGestaoUsuarioRequest) =>
            cadastroGestaoUsuarioAction(data),
        onSuccess: (response) => {
            return response;
        },
    });
}
