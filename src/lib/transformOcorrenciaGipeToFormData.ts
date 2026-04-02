import { OcorrenciaGipeResponse } from "@/types/ocorrencia-gipe";

export function transformOcorrenciaGipeToFormData(
    ocorrenciaGipe: OcorrenciaGipeResponse,
) {
    return {
        envolveArmaOuAtaque: ocorrenciaGipe.envolve_arma_ataque || undefined,
        ameacaRealizada:
            ocorrenciaGipe.ameaca_realizada_qual_maneira || undefined,
        encaminhamentos: ocorrenciaGipe.encaminhamentos_gipe || "",
    };
}
