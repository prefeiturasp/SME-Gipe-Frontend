import { useMutation } from "@tanstack/react-query";

import { finalizarEtapaGipe } from "@/actions/finalizar-etapa-gipe";
import { MotivoEncerramentoBody } from "@/types/finalizar-etapa";

type FinalizarEtapaParams = {
    ocorrenciaUuid: string;
    body: MotivoEncerramentoBody;
};

export const useFinalizarEtapaGipe = () => {
    return useMutation({
        mutationFn: ({ ocorrenciaUuid, body }: FinalizarEtapaParams) =>
            finalizarEtapaGipe(ocorrenciaUuid, body),
    });
};
