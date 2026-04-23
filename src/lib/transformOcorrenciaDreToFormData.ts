import { OcorrenciaDreResponse } from "@/types/ocorrencia-dre";

export function transformOcorrenciaDreToFormData(
    ocorrenciaDre: OcorrenciaDreResponse,
) {
    return {
        acionamentoSegurancaPublica: ocorrenciaDre.acionamento_seguranca_publica
            ? ("Sim" as const)
            : ("Não" as const),
        interlocucaoSupervisaoEscolar:
            ocorrenciaDre.interlocucao_supervisao_escolar
                ? ("Sim" as const)
                : ("Não" as const),
        numeroProcedimentoSEI: ocorrenciaDre.nr_processo_sei
            ? ("Sim" as const)
            : ("Não" as const),
        numeroProcedimentoSEITexto: ocorrenciaDre.nr_processo_sei ?? "",
    };
}
