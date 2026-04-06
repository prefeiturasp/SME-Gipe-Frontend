export interface OcorrenciaDreResponse {
    id: number;
    uuid: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    status: string;
    status_display: string;
    status_extra: string;
    acionamento_seguranca_publica: boolean;
    interlocucao_supervisao_escolar: boolean;
    nr_processo_sei?: string;
}

export type OcorrenciaDreBody = {
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    acionamento_seguranca_publica: boolean;
    interlocucao_supervisao_escolar: boolean;
    nr_processo_sei?: string;
};
