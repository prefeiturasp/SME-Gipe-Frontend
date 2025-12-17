"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoriasDisponiveisGipeAction } from "@/actions/categorias-disponiveis-gipe";

export const useCategoriasDisponiveisGipe = () => {
    return useQuery({
        queryKey: ["categorias-disponiveis-gipe"],
        queryFn: async () => {
            const response = await getCategoriasDisponiveisGipeAction();

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};
