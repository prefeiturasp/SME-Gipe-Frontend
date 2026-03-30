import { OcorrenciaGipeResponse } from "@/types/ocorrencia-gipe";

export function transformOcorrenciaGipeToFormData(
    ocorrenciaGipe: OcorrenciaGipeResponse,
) {
    return {
        envolveArmaOuAtaque: ocorrenciaGipe.envolve_arma_ataque || undefined,
        ameacaRealizada:
            ocorrenciaGipe.ameaca_realizada_qual_maneira || undefined,
        etapaEscolar: ocorrenciaGipe.etapa_escolar || "",
        informacoesInteracoesVirtuais:
            ocorrenciaGipe.info_sobre_interacoes_virtuais_pessoa_agressora ||
            "",
        encaminhamentos: ocorrenciaGipe.encaminhamentos_gipe || "",
    };
}
