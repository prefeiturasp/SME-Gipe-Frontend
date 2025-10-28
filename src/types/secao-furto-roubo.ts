export type SecaoFurtoRouboBody = {
    tipos_ocorrencia: string[];
    descricao_ocorrencia: string;
    smart_sampa_situacao: "sim_com_dano" | "sim_sem_dano" | "nao_faz_parte";
};

export type TipoOcorrenciaDetalhe = {
    uuid: string;
    nome: string;
};

export type SecaoFurtoRouboResponse = {
    uuid: string;
    tipos_ocorrencia_detalhes: TipoOcorrenciaDetalhe[];
    descricao_ocorrencia: string;
    smart_sampa_situacao: "sim_com_dano" | "sim_sem_dano" | "nao_faz_parte";
    status_display: string;
    status_extra: string;
};
