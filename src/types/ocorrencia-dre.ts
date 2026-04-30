export interface OcorrenciaDreResponse {
    id: number;
    uuid: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    status: string;
    status_display: string;
    status_extra: string;
    quais_orgaos_acionados_dre: string[];
    nr_processo_sei?: string;
}

export type OcorrenciaDreBody = {
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    quais_orgaos_acionados_dre: string[];
    nr_processo_sei?: string;
};
