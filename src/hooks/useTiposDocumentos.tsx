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

    const perfilMap: Record<
        string,
        "diretor" | "assistente" | "dre" | "gipe"
    > = {
        "DIRETOR DE ESCOLA": "diretor",
        "ASSISTENTE DE DIRETOR DE ESCOLA": "assistente",
        "PONTO FOCAL DRE": "dre",
        GIPE: "gipe",
    };

    const perfilUser =
        (user?.perfil_acesso?.nome &&
            perfilMap[user.perfil_acesso.nome]) || "diretor";

    return useQuery<TipoDocumento[]>({
        queryKey: ["tiposDocumento", perfilUser],
        queryFn: () => fetchAndTransformTiposDocumento(perfilUser),
        enabled: !!user,
    });
};
