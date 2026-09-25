import { filterValidTiposOcorrencia } from "@/lib/formUtils";
import { useEffect } from "react";

type TipoOcorrencia = { uuid: string };

export function useSyncTiposOcorrencia(
    tiposOcorrencia: TipoOcorrencia[] | undefined,
    isLoadingTipos: boolean,
    getCurrentTipos: () => string[],
    setFilteredTipos: (values: string[]) => void,
) {
    useEffect(() => {
        if (!isLoadingTipos && tiposOcorrencia) {
            const current = getCurrentTipos();
            const filtered = filterValidTiposOcorrencia(
                current,
                tiposOcorrencia,
            );
            if (filtered.length !== current.length) {
                setFilteredTipos(filtered);
            }
        }
    }, [isLoadingTipos, tiposOcorrencia, getCurrentTipos, setFilteredTipos]);
}
