import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { obterOcorrenciaDre } from "@/actions/obter-ocorrencia-dre";
import { OcorrenciaDreResponse } from "@/types/ocorrencia-dre";

type UseGetOcorrenciaDreOptions = Omit<
    UseQueryOptions<OcorrenciaDreResponse, Error>,
    "queryKey" | "queryFn"
>;

export function useGetOcorrenciaDre(
    uuid: string,
    options?: UseGetOcorrenciaDreOptions
) {
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
        ...options,
    });
}
