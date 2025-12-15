import { useMutation } from "@tanstack/react-query";
import { atualizarOcorrenciaGipe } from "@/actions/atualizar-ocorrencia-gipe";
import { OcorrenciaGipeBody } from "@/types/ocorrencia-gipe";

type AtualizarOcorrenciaGipeParams = {
    uuid: string;
    body: OcorrenciaGipeBody;
};

export const useAtualizarOcorrenciaGipe = () => {
    return useMutation({
        mutationFn: ({ uuid, body }: AtualizarOcorrenciaGipeParams) =>
            atualizarOcorrenciaGipe(uuid, body),
    });
};
