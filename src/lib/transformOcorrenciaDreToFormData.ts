import { OcorrenciaDreResponse } from "@/types/ocorrencia-dre";

export function transformOcorrenciaDreToFormData(
    ocorrenciaDre: OcorrenciaDreResponse
) {
    return {
        acionamentoSegurancaPublica: ocorrenciaDre.acionamento_seguranca_publica
            ? ("Sim" as const)
            : ("Não" as const),
        interlocucaoSTS: ocorrenciaDre.interlocucao_sts
            ? ("Sim" as const)
            : ("Não" as const),
        informacoesComplementaresSTS: ocorrenciaDre.info_complementar_sts || "",
        interlocucaoCPCA: ocorrenciaDre.interlocucao_cpca
            ? ("Sim" as const)
            : ("Não" as const),
        informacoesComplementaresCPCA:
            ocorrenciaDre.info_complementar_cpca || "",
        interlocucaoSupervisaoEscolar:
            ocorrenciaDre.interlocucao_supervisao_escolar
                ? ("Sim" as const)
                : ("Não" as const),
        informacoesComplementaresSupervisaoEscolar:
            ocorrenciaDre.info_complementar_supervisao_escolar || "",
        interlocucaoNAAPA: ocorrenciaDre.interlocucao_naapa
            ? ("Sim" as const)
            : ("Não" as const),
        informacoesComplementaresNAAPA:
            ocorrenciaDre.info_complementar_naapa || "",
    };
}
