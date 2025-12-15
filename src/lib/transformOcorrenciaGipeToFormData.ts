import { OcorrenciaGipeResponse } from "@/types/ocorrencia-gipe";

export function transformOcorrenciaGipeToFormData(
    ocorrenciaGipe: OcorrenciaGipeResponse
) {
    return {
        envolveArmaOuAtaque: ocorrenciaGipe.envolve_arma_ataque || undefined,
        ameacaRealizada:
            ocorrenciaGipe.ameaca_realizada_qual_maneira || undefined,
        envolvidosGipe: ocorrenciaGipe.envolvido
            ? [ocorrenciaGipe.envolvido]
            : [],
        motivacaoOcorrenciaGipe: ocorrenciaGipe.motivacao_ocorrencia || [],
        tipoOcorrenciaGipe:
            ocorrenciaGipe.tipos_ocorrencia_detalhes?.[0]?.uuid || "",
        cicloAprendizagem: ocorrenciaGipe.qual_ciclo_aprendizagem || "",
        informacoesInteracoesVirtuais:
            ocorrenciaGipe.info_sobre_interacoes_virtuais_pessoa_agressora ||
            "",
        encaminhamentos: ocorrenciaGipe.encaminhamentos_gipe || "",
    };
}
