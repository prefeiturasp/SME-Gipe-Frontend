export type FormularioCompletoUEBody = {
    data_ocorrencia: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    sobre_furto_roubo_invasao_depredacao: boolean;
    fora_horario_funcionamento_ue?: boolean;
    tipos_ocorrencia: string[];
    descricao_ocorrencia: string;
    smart_sampa_situacao: string;
    envolvido?: string[];
    tem_info_agressor_ou_vitima: string;
    declarante: string;
    comunicacao_seguranca_publica: string;
    protocolo_acionado?: string;
    pessoas_agressoras?: Array<{
        nome: string;
        idade: number;
        idade_em_meses?: boolean;
        genero: string;
        grupo_etnico_racial: string;
        etapa_escolar: string;
        frequencia_escolar: string;
        interacao_ambiente_escolar: string;
        nacionalidade: string;
        pessoa_com_deficiencia: boolean;
    }>;
    motivacao_ocorrencia?: string[];
    notificado_conselho_tutelar?: boolean;
    ocorrencia_acompanhada_pelo?: (
        | "naapa"
        | "comissao_mediacao_conflitos"
        | "supervisao_escolar"
        | "cefai"
        | "vara_da_infancia"
    )[];
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
        idade_em_meses?: boolean;
        genero: string;
        grupo_etnico_racial: string;
        etapa_escolar: string;
        frequencia_escolar: string;
        interacao_ambiente_escolar: string;
        nacionalidade: string;
        pessoa_com_deficiencia: boolean;
    }>;
    motivacao_ocorrencia?: string[];
    notificado_conselho_tutelar?: boolean;
    ocorrencia_acompanhada_pelo?: string[];
};
