import { useQuery } from "@tanstack/react-query";
import { obterOcorrencia } from "@/actions/obter-ocorrencia";

export function useGetOcorrencia(uuid: string) {
    return useQuery({
        queryKey: ["ocorrencia", uuid],
        queryFn: async () => {
            const response = await obterOcorrencia(uuid);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        enabled: !!uuid,
        staleTime: 1000 * 60 * 5,
    });
}
