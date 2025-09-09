export type ConfirmarEmailRequest = {
    code: string;
};

export type ConfirmarEmailErrorResponse = {
    detail?: string;
    field?: string;
};

export type ConfirmarEmailResult =
    | { success: true }
    | { success: false; error: string; field?: string };
