import { useMutation } from "@tanstack/react-query";

import { finalizarEtapa } from "@/actions/finalizar-etapa";
import { MotivoEncerramentoBody } from "@/types/finalizar-etapa";

type FinalizarEtapaParams = {
    ocorrenciaUuid: string;
    body: MotivoEncerramentoBody;
};

export const useFinalizarEtapa = () => {
    return useMutation({
        mutationFn: ({ ocorrenciaUuid, body }: FinalizarEtapaParams) =>
            finalizarEtapa(ocorrenciaUuid, body),
    });
};
