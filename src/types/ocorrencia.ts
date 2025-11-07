export type Ocorrencia = {
    id: number;
    uuid: string;
    protocolo: string;
    dataHora: string;
    codigoEol: string;
    dre: string;
    nomeUe: string;
    tipoViolencia: string;
    status: "Incompleta" | "Finalizada" | "Em andamento";
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
}
