import { useMutation } from "@tanstack/react-query";

import { CadastrarOcorrencia } from "@/actions/cadastrar-ocorrencia";

export const useCadastrarOcorrencia = () => {
    return useMutation({
        mutationFn: CadastrarOcorrencia,
    });
};
