import { OcorrenciaDreResponse } from "@/types/ocorrencia-dre";

export function transformOcorrenciaDreToFormData(
    ocorrenciaDre: OcorrenciaDreResponse,
) {
    return {
        quaisOrgaosAcionadosDre: ocorrenciaDre.quais_orgaos_acionados_dre ?? [],
        numeroProcedimentoSEI: ocorrenciaDre.nr_processo_sei
            ? ("Sim" as const)
            : ("Não" as const),
        numeroProcedimentoSEITexto: ocorrenciaDre.nr_processo_sei ?? "",
    };
}
