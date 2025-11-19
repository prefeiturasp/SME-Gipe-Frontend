export type Ocorrencia = {
    id: number;
    uuid: string;
    protocolo: string;
    dataHora: string;
    codigoEol: string;
    dre: string;
    nomeUe: string;
    tipoOcorrencia: string;
    status: string
};

export interface OcorrenciaAPI {
    id: number;
    uuid: string;
    data_ocorrencia: string;
    unidade_codigo_eol: string;
    dre_codigo_eol: string;
    sobre_furto_roubo_invasao_depredacao: boolean;
    user_username: string;
    criado_em: string;
    atualizado_em: string;
    nome_dre: string,
    nome_unidade: string,
    status_extra: string;
    tipos_ocorrencia: {
        uuid: string;
        nome: string;
    }[]; 
    protocolo_da_intercorrencia: string
}
