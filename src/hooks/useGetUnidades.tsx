import { useQuery } from "@tanstack/react-query";
import { getUnidades } from "@/actions/gestao-de-unidades";

export function useGetUnidades(ativa?: boolean, dre?: string, tipo_unidade?:string, rede?:string) {
    return useQuery({
        queryKey: ["get-unidades", ativa, dre, tipo_unidade, rede],
        queryFn: () => getUnidades(ativa, dre, tipo_unidade, rede),
        refetchOnWindowFocus: false,
    });
}
