import { useQuery } from "@tanstack/react-query";
import { obterAnexos } from "@/actions/obter-anexos";

type UseObterAnexosParams = {
    intercorrenciaUuid: string | null;
};

export function useObterAnexos({ intercorrenciaUuid }: UseObterAnexosParams) {
    return useQuery({
        queryKey: ["anexos", intercorrenciaUuid],
        queryFn: async () => {
            if (!intercorrenciaUuid) {
                throw new Error("UUID da intercorrência não fornecido");
            }

            const result = await obterAnexos({ intercorrenciaUuid });

            if (!result.success) {
                throw new Error(result.error);
            }

            return result.data;
        },
        enabled: !!intercorrenciaUuid,
        staleTime: 1000 * 60 * 5,
    });
}
