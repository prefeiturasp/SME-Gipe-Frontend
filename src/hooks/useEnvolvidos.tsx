import { EnvolvidoAPI, getEnvolvidoAction } from "@/actions/envolvidos";
import { useQuery } from "@tanstack/react-query";

export const useEnvolvidos = () => {
    return useQuery<EnvolvidoAPI[]>({
        queryKey: ["envolvidos"],
        queryFn: async () => {
            const response = await getEnvolvidoAction();

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        },
        staleTime: 1000 * 60 * 60,
    });
};
