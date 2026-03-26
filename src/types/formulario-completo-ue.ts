export type FormularioCompletoUEBody = {
    data_ocorrencia: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    sobre_furto_roubo_invasao_depredacao: boolean;
    fora_horario_funcionamento_ue?: boolean;
    tipos_ocorrencia: string[];
    tipos_ocorrencia_outros?: string;
    descricao_ocorrencia: string;
    smart_sampa_situacao: string;
    envolvido?: string[];
    envolvido_outros?: string;
    tem_info_agressor_ou_vitima: string;
    declarante: string;
    comunicacao_seguranca_publica: string;
    protocolo_acionado?: string;
    pessoas_agressoras?: Array<{
        nome: string;
        idade: number;
        genero: string;
        grupo_etnico_racial: string;
        etapa_escolar: string;
        frequencia_escolar: string;
        interacao_ambiente_escolar: string;
    }>;
    motivacao_ocorrencia?: string[];
    motivacao_ocorrencia_outros?: string;
    redes_protecao_acompanhamento?: string;
    notificado_conselho_tutelar?: boolean;
    acompanhado_naapa?: boolean;
};

export type FormularioCompletoUEResponse = {
    uuid: string;
    data_ocorrencia: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    sobre_furto_roubo_invasao_depredacao: boolean;
    descricao_ocorrencia: string;
    smart_sampa_situacao: string;
    tem_info_agressor_ou_vitima: string;
    comunicacao_seguranca_publica: string;
    protocolo_acionado?: string;
    pessoas_agressoras?: Array<{
        nome: string;
        idade: number;
        genero: string;
        grupo_etnico_racial: string;
        etapa_escolar: string;
        frequencia_escolar: string;
        interacao_ambiente_escolar: string;
    }>;
    motivacao_ocorrencia?: string[];
    redes_protecao_acompanhamento?: string;
    notificado_conselho_tutelar?: boolean;
    acompanhado_naapa?: boolean;
};
