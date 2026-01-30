import { consultarEolUnidadeAction } from "@/actions/consultar-eol-unidade";
import { useMutation } from "@tanstack/react-query";

export const useConsultarEolUnidade = () => {
    return useMutation({
        mutationFn: (codigoEol: string) => consultarEolUnidadeAction(codigoEol),
    });
};
