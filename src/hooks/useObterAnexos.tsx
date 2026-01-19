import { useQuery } from "@tanstack/react-query";
import { obterAnexos } from "@/actions/obter-anexos";

type UseObterAnexosParams = {
    intercorrenciaUuid: string;
    perfil?: string;
};

export function useObterAnexos({
    intercorrenciaUuid,
    perfil,
}: UseObterAnexosParams) {
    return useQuery({
        queryKey: ["anexos", intercorrenciaUuid, perfil],
        queryFn: async () => {
            const result = await obterAnexos({ intercorrenciaUuid, perfil });

            if (!result.success) {
                throw new Error(result.error);
            }

            return result.data;
        },
        enabled: !!intercorrenciaUuid,
        staleTime: 1000 * 60 * 5,
    });
}
