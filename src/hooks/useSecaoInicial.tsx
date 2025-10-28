import { useMutation } from "@tanstack/react-query";

import { SecaoInicial } from "@/actions/secao-inicial";

export const useSecaoInicial = () => {
    return useMutation({
        mutationFn: SecaoInicial,
    });
};
