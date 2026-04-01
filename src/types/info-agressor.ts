export type PessoaAgressora = {
    nome: string;
    idade: number;
    genero: string;
    grupo_etnico_racial: string;
    etapa_escolar: string;
    frequencia_escolar: string;
    interacao_ambiente_escolar: string;
    nacionalidade: string;
    pessoa_com_deficiencia: boolean;
};

export type InfoAgressorBody = {
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    pessoas_agressoras: PessoaAgressora[];
    motivacao_ocorrencia: string[];
    notificado_conselho_tutelar: boolean;
    ocorrencia_acompanhada_pelo: string;
};

export type InfoAgressorResponse = {
    uuid: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    pessoas_agressoras: PessoaAgressora[];
    motivacao_ocorrencia: string[];
    motivacao_ocorrencia_display: string;
    notificado_conselho_tutelar: boolean;
    ocorrencia_acompanhada_pelo: string;
};
