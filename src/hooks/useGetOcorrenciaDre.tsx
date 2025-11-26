import { useQuery } from "@tanstack/react-query";
import { obterOcorrenciaDre } from "@/actions/obter-ocorrencia-dre";

export function useGetOcorrenciaDre(uuid: string) {
    return useQuery({
        queryKey: ["ocorrencia-dre", uuid],
        queryFn: async () => {
            const response = await obterOcorrenciaDre(uuid);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        enabled: !!uuid,
        staleTime: 1000 * 60 * 5,
    });
}
