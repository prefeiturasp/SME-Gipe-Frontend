import { useQuery } from "@tanstack/react-query";
import { getDREs, getUEs, getTodasUEs } from "@/actions/unidades";

export function useFetchDREs() {
    return useQuery({
        queryKey: ["get-dres"],
        queryFn: () => getDREs(),
        refetchOnWindowFocus: false,
    });
}

export function useFetchUEs(dreUuid: string, rede?: string) {
    return useQuery({
        queryKey: ["get-ues", dreUuid, rede],
        queryFn: () => getUEs(dreUuid, rede),
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
