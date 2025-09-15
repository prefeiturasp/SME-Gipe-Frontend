export type AtualizarNomeRequest = {
    name: string;
};

export type AtualizarNomeErrorResponse = {
    detail?: string;
    field?: string;
};

export type AtualizarNomeResult =
    | { success: true }
    | { success: false; error: string; field?: string };
