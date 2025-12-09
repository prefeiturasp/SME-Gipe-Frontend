import { useMutation } from "@tanstack/react-query";
import { atualizarFormularioCompletoUE } from "@/actions/atualizar-formulario-completo-ue";
import { FormularioCompletoUEBody } from "@/types/formulario-completo-ue";

type AtualizarFormularioCompletoUEParams = {
    uuid: string;
    body: FormularioCompletoUEBody;
};

export const useAtualizarFormularioCompletoUE = () => {
    return useMutation({
        mutationFn: ({ uuid, body }: AtualizarFormularioCompletoUEParams) =>
            atualizarFormularioCompletoUE(uuid, body),
    });
};
