export interface OcorrenciaGipeResponse {
    id: number;
    uuid: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    status: string;
    status_display: string;
    status_extra: string;
    envolve_arma_ataque: string;
    ameaca_realizada_qual_maneira: string;
    tipos_ocorrencia: string[];
    encaminhamentos_gipe: string;
}

export type OcorrenciaGipeBody = {
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    envolve_arma_ataque: string;
    ameaca_realizada_qual_maneira: string;
    tipos_ocorrencia: string[];
    encaminhamentos_gipe: string;
};
