import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { Ocorrencia } from "@/types/ocorrencia";
import { getOcorrenciasAction } from "@/actions/ocorrencias";


const fetchAndTransformOcorrencias = async (): Promise<Ocorrencia[]> => {
    const response = await getOcorrenciasAction();

    if (!response.success) {
        throw new Error(response.error);
    }

    return response.data.map((item, index) => {
        const date = new Date(item.data_ocorrencia);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hour = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return {
            id: item.id,
            uuid: item.uuid,
            protocolo: item?.protocolo ?? "",
            dataHora: `${day}/${month}/${year} - ${hour}:${minutes}`,
            codigoEol: item.unidade_codigo_eol,
            dre: item.nome_dre,
            nomeUe: item.nome_unidade,
            tipoOcorrencia: item.tipos_ocorrencia
                .map((t) => t.nome)
                .join(", "),
            status: item.status_extra
        };
    });
};

export const useOcorrencias = () => {
    const user = useUserStore((state) => state.user);

    return useQuery<Ocorrencia[]>({
        queryKey: ["ocorrencias", user?.username],
        queryFn: () => fetchAndTransformOcorrencias(),
        enabled: !!user,
    });
};
