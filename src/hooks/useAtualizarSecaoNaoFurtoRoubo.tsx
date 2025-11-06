import { useMutation } from "@tanstack/react-query";
import { atualizarSecaoNaoFurtoRoubo } from "@/actions/atualizar-secao-nao-furto-roubo";
import { SecaoNaoFurtoRouboBody } from "@/types/secao-nao-furto-roubo";

type AtualizarSecaoNaoFurtoRouboParams = {
    uuid: string;
    body: SecaoNaoFurtoRouboBody;
};

export const useAtualizarSecaoNaoFurtoRoubo = () => {
    return useMutation({
        mutationFn: ({ uuid, body }: AtualizarSecaoNaoFurtoRouboParams) =>
            atualizarSecaoNaoFurtoRoubo(uuid, body),
    });
};
