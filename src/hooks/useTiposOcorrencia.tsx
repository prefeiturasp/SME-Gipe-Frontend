import { useQuery } from "@tanstack/react-query";
import {
    getTiposOcorrenciaAction,
    TipoOcorrenciaAPI,
} from "@/actions/tipos-ocorrencia";

export const useTiposOcorrencia = () => {
    return useQuery<TipoOcorrenciaAPI[]>({
        queryKey: ["tipos-ocorrencia"],
        queryFn: async () => {
            const response = await getTiposOcorrenciaAction();

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        },
        staleTime: 1000 * 60 * 60,
    });
};
