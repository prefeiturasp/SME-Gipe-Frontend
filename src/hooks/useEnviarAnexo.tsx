import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { enviarAnexoAction, EnviarAnexoResult } from "@/actions/enviar-anexo";

type EnviarAnexoParams = {
    intercorrencia_uuid: string;
    perfil: "diretor" | "assistente" | "dre" | "gipe";
    categoria: string;
    arquivo: File;
};

export function useEnviarAnexo(): UseMutationResult<
    EnviarAnexoResult,
    Error,
    EnviarAnexoParams
> {
    return useMutation({
        mutationFn: async (params: EnviarAnexoParams) => {
            const formData = new FormData();
            formData.append("intercorrencia_uuid", params.intercorrencia_uuid);
            formData.append("perfil", params.perfil);
            formData.append("categoria", params.categoria);
            formData.append("arquivo", params.arquivo);

            return await enviarAnexoAction(formData);
        },
    });
}
