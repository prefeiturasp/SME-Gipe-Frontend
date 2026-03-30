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
    envolvido: string[];
    motivacao_ocorrencia: string[];
    tipos_ocorrencia: string[];
    tipos_ocorrencia_detalhes: Array<{
        uuid: string;
        nome: string;
    }>;
    etapa_escolar: string;
    info_sobre_interacoes_virtuais_pessoa_agressora: string;
    encaminhamentos_gipe: string;
}

export type OcorrenciaGipeBody = {
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    envolve_arma_ataque: string;
    ameaca_realizada_qual_maneira: string;
    envolvido: string[];
    motivacao_ocorrencia: string[];
    tipos_ocorrencia: string[];
    etapa_escolar: string;
    info_sobre_interacoes_virtuais_pessoa_agressora: string;
    encaminhamentos_gipe: string;
};
