export interface OcorrenciaDreResponse {
    id: number;
    uuid: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    status: string;
    status_display: string;
    status_extra: string;
    acionamento_seguranca_publica: boolean;
    interlocucao_sts: boolean;
    info_complementar_sts: string;
    interlocucao_cpca: boolean;
    info_complementar_cpca: string;
    interlocucao_supervisao_escolar: boolean;
    info_complementar_supervisao_escolar: string;
    interlocucao_naapa: boolean;
    info_complementar_naapa: string;
}

export type OcorrenciaDreBody = {
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    acionamento_seguranca_publica: boolean;
    interlocucao_sts: boolean;
    info_complementar_sts: string;
    interlocucao_cpca: boolean;
    info_complementar_cpca: string;
    interlocucao_supervisao_escolar: boolean;
    info_complementar_supervisao_escolar: string;
    interlocucao_naapa: boolean;
    info_complementar_naapa: string;
};
