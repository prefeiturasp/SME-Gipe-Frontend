import { inativarUnidadeGestaoAction } from "@/actions/inativar-unidade-gestao";
import { useMutation } from "@tanstack/react-query";

export function useInativarUnidadeGestao() {
    return useMutation({
        mutationFn: async ({ uuid, motivo_inativacao }: { uuid: string; motivo_inativacao: string }) => {
            return inativarUnidadeGestaoAction(uuid, motivo_inativacao);
        },
    });
}
