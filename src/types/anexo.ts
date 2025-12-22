export type CategoriaAnexo =
    | "boletim_ocorrencia"
    | "registro_ocorrencia_interno"
    | "protocolo_conselho_tutelar"
    | "instrucao_normativa_20_2020"
    | "relatorio_naapa"
    | "relatorio_cefai"
    | "relatorio_sts"
    | "relatorio_cpca"
    | "oficio_gcm"
    | "registro_intercorrencia"
    | "relatorio_supervisao_escolar";

export type PerfilAnexo = "diretor" | "assistente" | "dre" | "gipe";

export type AnexoAPI = {
    uuid: string;
    nome_original: string;
    categoria: CategoriaAnexo;
    categoria_display: string;
    perfil: PerfilAnexo;
    perfil_display: string;
    tamanho_formatado: string;
    extensao: string;
    arquivo_url: string;
    criado_em: string;
    usuario_username: string;
    usuario_nome: string;
};

export type ObterAnexosResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: AnexoAPI[];
};
