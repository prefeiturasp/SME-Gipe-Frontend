export interface TipoDocumentoAPI {
    perfil: string;
    categorias: {
        value: string;
        label: string;
    }[];
}

export interface TipoDocumento {
    value: string;
    label: string;
}
