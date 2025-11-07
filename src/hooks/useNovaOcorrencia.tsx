import { useMutation } from "@tanstack/react-query";

import { novaOcorrencia } from "@/actions/nova-ocorrencia";

export const useNovaOcorrencia = () => {
    return useMutation({
        mutationFn: novaOcorrencia,
    });
};
