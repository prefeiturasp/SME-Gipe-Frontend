import { useQuery } from "@tanstack/react-query";
import { obterUsuarioGestao } from "@/actions/obter-usuario-gestao";

type UseObterUsuarioGestaoParams = {
    uuid: string;
    enabled?: boolean;
};

export function useObterUsuarioGestao({
    uuid,
    enabled = true,
}: UseObterUsuarioGestaoParams) {
    return useQuery({
        queryKey: ["usuario-gestao", uuid],
        queryFn: async () => {
            const result = await obterUsuarioGestao(uuid);

            if (!result.success) {
                throw new Error(result.error);
            }

            return result.data;
        },
        enabled: !!uuid && enabled,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}
