import { obterUnidadeGestao } from "@/actions/obter-unidade-gestao";
import { useQuery } from "@tanstack/react-query";

type UseObterUnidadeGestaoParams = {
    uuid: string;
    enabled?: boolean;
};

export function useObterUnidadeGestao({
    uuid,
    enabled = true,
}: UseObterUnidadeGestaoParams) {
    return useQuery({
        queryKey: ["unidade-gestao", uuid],
        queryFn: async () => {
            const result = await obterUnidadeGestao(uuid);

            if (!result.success) {
                throw new Error(result.error);
            }

            return result.data;
        },
        enabled: !!uuid && enabled,
        staleTime: 1000 * 60 * 5,
    });
}
