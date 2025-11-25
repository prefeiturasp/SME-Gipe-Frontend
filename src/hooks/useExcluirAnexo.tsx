import { useMutation, useQueryClient } from "@tanstack/react-query";
import { excluirAnexo } from "@/actions/excluir-anexo";

export const useExcluirAnexo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (uuid: string) => excluirAnexo(uuid),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["anexos"] });
        },
    });
};
