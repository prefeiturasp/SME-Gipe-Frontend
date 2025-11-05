import { useMutation } from "@tanstack/react-query";
import { atualizarSecaoFinal } from "@/actions/atualizar-secao-final";

type AtualizarSecaoFinalParams = {
    uuid: string;
    body: {
        unidade_codigo_eol: string;
        dre_codigo_eol: string;
        declarante: string;
        comunicacao_seguranca_publica: string;
        protocolo_acionado: string;
    };
};

export function useAtualizarSecaoFinal() {
    return useMutation({
        mutationFn: (params: AtualizarSecaoFinalParams) =>
            atualizarSecaoFinal(params),
    });
}
