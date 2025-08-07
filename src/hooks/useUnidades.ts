import { useMutation } from "@tanstack/react-query";
import { getDREs, getUEs } from "@/actions/unidades";

export function useFetchDREs(
    setDreOptions: (dres: { uuid: string; nome: string }[]) => void
) {
    return useMutation({
        mutationFn: getDREs,
        onSuccess: (res: { uuid: string; nome: string }[]) => {
            setDreOptions(res.map(({ uuid, nome }) => ({ uuid, nome })));
        },
    });
}
export function useFetchUEs(
    dreUuid: string | undefined,
    setUeOptions: (ues: { uuid: string; nome: string }[]) => void
) {
    return useMutation({
        mutationFn: () => (dreUuid ? getUEs(dreUuid) : Promise.resolve([])),
        onSuccess: (res: { uuid: string; nome: string }[]) => {
            setUeOptions(res.map(({ uuid, nome }) => ({ uuid, nome })));
        },
    });
}
