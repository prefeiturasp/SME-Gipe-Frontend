import { useMutation } from "@tanstack/react-query";
import { atualizarOcorrenciaDre } from "@/actions/atualizar-ocorrencia-dre";
import { OcorrenciaDreBody } from "@/types/ocorrencia-dre";

type AtualizarOcorrenciaDreParams = {
    uuid: string;
    body: OcorrenciaDreBody;
};

export const useAtualizarOcorrenciaDre = () => {
    return useMutation({
        mutationFn: ({ uuid, body }: AtualizarOcorrenciaDreParams) =>
            atualizarOcorrenciaDre(uuid, body),
    });
};
