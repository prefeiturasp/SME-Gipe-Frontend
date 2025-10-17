import { useQuery } from "@tanstack/react-query";
import { obterOcorrencia } from "@/actions/obter-ocorrencia";

export function useGetOcorrencia(uuid: string) {
    return useQuery({
        queryKey: ["ocorrencia", uuid],
        queryFn: () => obterOcorrencia(uuid),
        enabled: !!uuid,
        staleTime: 1000 * 60 * 5,
    });
}
