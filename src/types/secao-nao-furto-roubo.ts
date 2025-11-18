export type SecaoNaoFurtoRouboBody = {
    tipos_ocorrencia: string[];
    descricao_ocorrencia: string;
    envolvido: string;
    tem_info_agressor_ou_vitima: "sim" | "nao";
};
