import { useQuery } from "@tanstack/react-query";
import { getUsuarios } from "@/actions/gestao-de-usuarios";

export function useGetUsuarios(
    ativo?: boolean,
    dre?: string ,
    unidade?: string,
    pendente_aprovacao?: boolean
) {
    return useQuery({
        queryKey: ["get-usuarios", ativo, dre, unidade, pendente_aprovacao],
        queryFn: () => getUsuarios(ativo, dre, unidade, pendente_aprovacao),
        refetchOnWindowFocus: false,
    });
}
