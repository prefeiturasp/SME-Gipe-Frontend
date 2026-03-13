export type SecaoFurtoRouboBody = {
    tipos_ocorrencia: string[];
    tipos_ocorrencia_outros?: string;
    descricao_ocorrencia: string;
    smart_sampa_situacao: "sim" | "nao";
};

export type TipoOcorrenciaDetalhe = {
    uuid: string;
    nome: string;
};

export type SecaoFurtoRouboResponse = {
    uuid: string;
    tipos_ocorrencia_detalhes: TipoOcorrenciaDetalhe[];
    descricao_ocorrencia: string;
    smart_sampa_situacao: "sim" | "nao";
    status_display: string;
    status_extra: string;
};
