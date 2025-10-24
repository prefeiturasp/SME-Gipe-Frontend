import { useMutation } from "@tanstack/react-query";
import { atualizarSecaoInicial } from "@/actions/atualizar-secao-inicial";
import { SecaoInicialBody } from "@/types/secao-inicial";

type AtualizarSecaoInicialParams = {
    uuid: string;
    body: SecaoInicialBody;
};

export const useAtualizarSecaoInicial = () => {
    return useMutation({
        mutationFn: ({ uuid, body }: AtualizarSecaoInicialParams) =>
            atualizarSecaoInicial(uuid, body),
    });
};
