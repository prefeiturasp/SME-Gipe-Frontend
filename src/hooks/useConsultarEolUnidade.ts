import { consultarEolUnidadeAction } from "@/actions/consultar-eol-unidade";
import { useMutation } from "@tanstack/react-query";

export const useConsultarEolUnidade = () => {
    return useMutation({
        mutationFn: ({
            codigoEol,
            etapaModalidade,
        }: {
            codigoEol: string;
            etapaModalidade: string;
        }) => consultarEolUnidadeAction(codigoEol, etapaModalidade),
    });
};
