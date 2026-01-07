import { useQuery } from "@tanstack/react-query";
import { getDREs, getUEs, getTodasUEs } from "@/actions/unidades";

export function useFetchDREs(ativas?: boolean) {
    return useQuery({
        queryKey: ["get-dres"],
        queryFn: () => getDREs(ativas),
        refetchOnWindowFocus: false,
    });
}

export function useFetchUEs(dreUuid: string, rede?: string, ativas?: boolean) {
    return useQuery({
        queryKey: ["get-ues", dreUuid, rede, ativas],
        queryFn: () => getUEs(dreUuid, rede, ativas),
        enabled: !!dreUuid,
        refetchOnWindowFocus: false,
    });
}

export function useFetchTodasUEs() {
    return useQuery({
        queryKey: ["todas-ues"],
        queryFn: () => getTodasUEs(),
        refetchOnWindowFocus: false,
    });
}
