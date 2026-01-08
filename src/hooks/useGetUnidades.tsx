import { useQuery } from "@tanstack/react-query";
import { getUnidades } from "@/actions/gestao-de-unidades";

export function useGetUnidades(ativa?: boolean, dre?: string, tipo_unidade?:string) {
    return useQuery({
        queryKey: ["get-unidades", ativa, dre, tipo_unidade],
        queryFn: () => getUnidades(ativa, dre, tipo_unidade),
        refetchOnWindowFocus: false,
    });
}
