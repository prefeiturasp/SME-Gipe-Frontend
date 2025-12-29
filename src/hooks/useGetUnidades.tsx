import { useQuery } from "@tanstack/react-query";
import { getUnidades } from "@/actions/gestao-de-unidades";

export function useGetUnidades(ativa?: boolean, dre?: string) {
    return useQuery({
        queryKey: ["get-unidades", ativa, dre],
        queryFn: () => getUnidades(ativa, dre),
        refetchOnWindowFocus: false,
    });
}
