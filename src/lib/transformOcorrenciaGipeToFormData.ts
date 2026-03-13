import { OcorrenciaGipeResponse } from "@/types/ocorrencia-gipe";

export function transformOcorrenciaGipeToFormData(
    ocorrenciaGipe: OcorrenciaGipeResponse,
) {
    return {
        envolveArmaOuAtaque: ocorrenciaGipe.envolve_arma_ataque || undefined,
        ameacaRealizada:
            ocorrenciaGipe.ameaca_realizada_qual_maneira || undefined,
        cicloAprendizagem: ocorrenciaGipe.qual_ciclo_aprendizagem || "",
        informacoesInteracoesVirtuais:
            ocorrenciaGipe.info_sobre_interacoes_virtuais_pessoa_agressora ||
            "",
        encaminhamentos: ocorrenciaGipe.encaminhamentos_gipe || "",
        ...(ocorrenciaGipe.envolvido_outros && {
            descricaoEnvolvidos: ocorrenciaGipe.envolvido_outros,
        }),
        ...(ocorrenciaGipe.motivacao_ocorrencia_outros && {
            descricaoMotivoOcorrencia:
                ocorrenciaGipe.motivacao_ocorrencia_outros,
        }),
        ...(ocorrenciaGipe.tipos_ocorrencia_outros && {
            descricaoTipoOcorrencia: ocorrenciaGipe.tipos_ocorrencia_outros,
        }),
    };
}
