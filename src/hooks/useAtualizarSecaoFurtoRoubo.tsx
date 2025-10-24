import { useMutation } from "@tanstack/react-query";
import { atualizarSecaoFurtoRoubo } from "@/actions/atualizar-secao-furto-roubo";
import { SecaoFurtoRouboBody } from "@/types/secao-furto-roubo";

type AtualizarSecaoFurtoRouboParams = {
    uuid: string;
    body: SecaoFurtoRouboBody;
};

export const useAtualizarSecaoFurtoRoubo = () => {
    return useMutation({
        mutationFn: ({ uuid, body }: AtualizarSecaoFurtoRouboParams) =>
            atualizarSecaoFurtoRoubo(uuid, body),
    });
};
