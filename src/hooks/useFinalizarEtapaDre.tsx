import { useMutation } from "@tanstack/react-query";

import { finalizarEtapaDre } from "@/actions/finalizar-etapa-dre";
import { MotivoEncerramentoBody } from "@/types/finalizar-etapa";

type FinalizarEtapaParams = {
    ocorrenciaUuid: string;
    body: MotivoEncerramentoBody;
};

export const useFinalizarEtapaDre = () => {
    return useMutation({
        mutationFn: ({ ocorrenciaUuid, body }: FinalizarEtapaParams) =>
            finalizarEtapaDre(ocorrenciaUuid, body),
    });
};
