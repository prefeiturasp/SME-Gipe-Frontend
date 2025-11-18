import { useQuery } from "@tanstack/react-query";
import { getTiposDocumentoAction } from "@/actions/tipos-documentos";
import { TipoDocumento } from "@/types/documentos";
import { useUserStore } from "@/stores/useUserStore";

const fetchAndTransformTiposDocumento = async (
    perfil: string
): Promise<TipoDocumento[]> => {
    const response = await getTiposDocumentoAction(perfil);

    if (!response.success) {
        throw new Error(response.error);
    }

    return response.data.categorias.map((item) => ({
        value: item.value,
        label: item.label,
    }));
};

export const useTiposDocumentos = () => {
    const user = useUserStore((state) => state.user);
    const perfilUser = "diretor";

    return useQuery<TipoDocumento[]>({
        queryKey: ["tiposDocumento", perfilUser],
        queryFn: () => fetchAndTransformTiposDocumento(perfilUser),
        enabled: !!user,
    });
};
