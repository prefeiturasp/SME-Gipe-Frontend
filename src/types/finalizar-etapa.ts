export type MotivoEncerramentoBody = {
    unidade_codigo_eol?: string;
    dre_codigo_eol?: string;
    motivo_encerramento_ue?: string;
    motivo_encerramento_dre?: string;
    motivo_encerramento_gipe?: string;
};

export type FinalizarOcorrenciaResponse = {
    uuid: string;
    responsavel_nome: string;
    responsavel_cpf: string;
    responsavel_email: string;
    perfil_acesso: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    nome_unidade: string;
    nome_dre: string;
    finalizado_diretor_em: string;
    finalizado_diretor_por: string;
    motivo_encerramento_ue: string;
    protocolo_da_intercorrencia: string;
    status_display: string;
    status_extra: string;
};

export type FinalizarEtapaResponse = {
    success: boolean;
    error?: string;
    data?: FinalizarOcorrenciaResponse;
};