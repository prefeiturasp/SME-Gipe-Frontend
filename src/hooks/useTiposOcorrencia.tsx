import {
    getTiposOcorrenciaAction,
    TipoFormulario,
    TipoOcorrenciaAPI,
} from "@/actions/tipos-ocorrencia";
import { useQuery } from "@tanstack/react-query";

export const useTiposOcorrencia = (tipoFormulario?: TipoFormulario) => {
    return useQuery<TipoOcorrenciaAPI[]>({
        queryKey: ["tipos-ocorrencia", tipoFormulario],
        queryFn: async () => {
            const response = await getTiposOcorrenciaAction(tipoFormulario);

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        },
        staleTime: 1000 * 60 * 60,
    });
};
