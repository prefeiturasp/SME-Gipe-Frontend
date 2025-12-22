import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { obterOcorrenciaGipe } from "@/actions/obter-ocorrencia-gipe";
import { OcorrenciaGipeResponse } from "@/types/ocorrencia-gipe";

type UseGetOcorrenciaGipeOptions = Omit<
    UseQueryOptions<OcorrenciaGipeResponse, Error>,
    "queryKey" | "queryFn"
>;

export function useGetOcorrenciaGipe(
    uuid: string,
    options?: UseGetOcorrenciaGipeOptions
) {
    return useQuery({
        queryKey: ["ocorrencia-gipe", uuid],
        queryFn: async () => {
            const response = await obterOcorrenciaGipe(uuid);
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
