"use server";

import {
    createAuthHeaders,
    getAuthToken,
    handleActionError,
    validateAuthToken,
    type ActionResult,
} from "@/lib/actionUtils";
import api from "@/lib/axios";

type ConsultarRfUsuarioResponse = {
    cpf: string;
    nome: string;
    codigoRf: string;
    email: string;
    dreCodigo: string | null;
    emailValido: boolean;
};

export async function consultarRfUsuarioAction(
    rf: string,
): Promise<ActionResult<ConsultarRfUsuarioResponse>> {
    const authError = validateAuthToken();
    if (authError) return authError as { success: false; error: string };

    const token = getAuthToken()!;

    try {
        const response = await api.get<ConsultarRfUsuarioResponse>(
            `/users/gestao-usuarios/consultar-core-sso/`,
            {
                params: { rf },
                headers: createAuthHeaders(token),
            },
        );

        return { success: true, data: response.data };
    } catch (err) {
        return handleActionError(err, "Erro ao buscar RF.");
    }
}
