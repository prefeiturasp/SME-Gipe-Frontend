import { reativarUnidadeGestaoAction } from "@/actions/reativar-unidade-gestao";
import { useMutation } from "@tanstack/react-query";

export function useReativarUnidadeGestao() {
    return useMutation({
        mutationFn: async ({
            uuid,
            motivo_reativacao,
        }: {
            uuid: string;
            motivo_reativacao: string;
        }) => {
            return reativarUnidadeGestaoAction(uuid, motivo_reativacao);
        },
    });
}
