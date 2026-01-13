import { inativarUnidadeGestaoAction } from "@/actions/inativar-unidade-gestao";
import { useMutation } from "@tanstack/react-query";

export function useInativarUnidadeGestao() {
    return useMutation({
        mutationFn: async (uuid: string) => {
            return inativarUnidadeGestaoAction(uuid);
        },
    });
}
