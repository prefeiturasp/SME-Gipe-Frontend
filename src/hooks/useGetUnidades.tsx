import { useQuery } from "@tanstack/react-query";
import { getUnidades } from "@/actions/gestao-de-unidades";

export function useGetUnidades(ativa?: boolean) {
    return useQuery({
        queryKey: ["get-unidades", ativa],
        queryFn: () => getUnidades(ativa),
        refetchOnWindowFocus: false,
    });
}
