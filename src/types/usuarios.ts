export type Usuario = {
    id: number;
    uuid: string;
    perfil: string;
    nome: string;
    rf_ou_cpf: string;
    email: string;
    rede: string;
    diretoria_regional: string;
    unidade_educacional: string;
    data_solicitacao?: string;
};
