import { getTiposUnidadeAction, TipoUnidadeAPI } from "@/actions/tipos-unidade";
import { useQuery } from "@tanstack/react-query";

export function useTiposUnidade() {
    return useQuery<TipoUnidadeAPI[]>({
        queryKey: ["tipos-unidade"],
        queryFn: async () => {
            const response = await getTiposUnidadeAction();
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        staleTime: 1000 * 60 * 60,
    });
}
