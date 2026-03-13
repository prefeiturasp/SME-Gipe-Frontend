export type SecaoNaoFurtoRouboBody = {
    tipos_ocorrencia: string[];
    tipos_ocorrencia_outros?: string;
    descricao_ocorrencia: string;
    envolvido: string[];
    envolvido_outros?: string;
    tem_info_agressor_ou_vitima: "sim" | "nao";
};
