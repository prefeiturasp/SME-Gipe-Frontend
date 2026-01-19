import { useMutation } from "@tanstack/react-query";
import { recusarUsuarioGestao } from "@/actions/recusar-usuario-gestao";

export const useRecusarUsuarioGestao = () => {
    return useMutation({
        mutationFn: ({
            uuid,
            justificativa,
        }: {
            uuid: string;
            justificativa: string;
        }) => recusarUsuarioGestao(uuid, justificativa),
    });
};
