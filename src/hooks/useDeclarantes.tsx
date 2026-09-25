import { DeclaranteAPI, getDeclarantesAction } from "@/actions/declarantes";
import { useQuery } from "@tanstack/react-query";

export const useDeclarantes = () => {
    return useQuery<DeclaranteAPI[]>({
        queryKey: ["declarantes"],
        queryFn: async () => {
            const response = await getDeclarantesAction();

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        },
        staleTime: 1000 * 60 * 60,
    });
};
