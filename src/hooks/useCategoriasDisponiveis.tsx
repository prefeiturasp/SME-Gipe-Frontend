import { useQuery } from "@tanstack/react-query";
import {
    getCategoriasDisponiveisAction,
    CategoriasDisponiveisAPI,
} from "@/actions/categorias-disponiveis";

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
