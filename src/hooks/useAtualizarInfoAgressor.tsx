import { useMutation } from "@tanstack/react-query";
import { atualizarInfoAgressor } from "@/actions/atualizar-info-agressor";
import { InfoAgressorBody } from "@/types/info-agressor";

type AtualizarInfoAgressorParams = {
    uuid: string;
    body: InfoAgressorBody;
};

export const useAtualizarInfoAgressor = () => {
    return useMutation({
        mutationFn: ({ uuid, body }: AtualizarInfoAgressorParams) =>
            atualizarInfoAgressor(uuid, body),
    });
};
