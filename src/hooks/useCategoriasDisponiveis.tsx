import {
    CategoriasDisponiveisAPI,
    getCategoriasDisponiveisAction,
} from "@/actions/categorias-disponiveis";
import { useQuery } from "@tanstack/react-query";

export const useCategoriasDisponiveis = () => {
    return useQuery<CategoriasDisponiveisAPI>({
        queryKey: ["categorias-disponiveis"],
        queryFn: async () => {
            const response = await getCategoriasDisponiveisAction();

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        },
        staleTime: 1000 * 60 * 60,
    });
};
