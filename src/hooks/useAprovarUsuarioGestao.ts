import { useMutation } from "@tanstack/react-query";
import { aprovarUsuarioGestao } from "@/actions/aprovar-usuario-gestao";

export const useAprovarUsuarioGestao = () => {
    return useMutation({
        mutationFn: (uuid: string) => aprovarUsuarioGestao(uuid),
    });
};
