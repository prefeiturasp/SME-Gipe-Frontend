import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { Ocorrencia } from "@/types/ocorrencia";
import { getOcorrenciasAction } from "@/actions/ocorrencias";
import { useUserPermissions } from "@/hooks/useUserPermissions";

const fetchAndTransformOcorrencias = async (): Promise<Ocorrencia[]> => {
    const response = await getOcorrenciasAction();

    if (!response.success) {
        throw new Error(response.error);
    }

    return response.data.map((item) => {
        const date = new Date(item.data_ocorrencia);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hour = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return {
            id: item.id,
            uuid: item.uuid,
            protocolo: item?.protocolo_da_intercorrencia ?? "",
            dataHora: `${day}/${month}/${year} - ${hour}:${minutes}`,
            codigoEol: item.unidade_codigo_eol,
            dre: item.nome_dre,
            nomeUe: item.nome_unidade,
            tipoOcorrencia: item.tipos_ocorrencia.map((t) => t.nome).join(", "),
            status: item.status_extra,
            statusId: item.status,
        };
    });
};

export const useOcorrencias = () => {
    const user = useUserStore((state) => state.user);
    const { isPontoFocal, isGipe } = useUserPermissions();

    return useQuery<Ocorrencia[]>({
        queryKey: ["ocorrencias", user?.username],
        queryFn: async () => {
            const ocorrencias = await fetchAndTransformOcorrencias();

            if (isPontoFocal) {
                return ocorrencias.filter(
                    (ocorrencia) =>
                        ocorrencia.statusId !== "em_preenchimento_diretor"
                );
            }

            if (isGipe) {
                return ocorrencias.filter(
                    (ocorrencia) =>
                        ocorrencia.statusId === "enviado_para_gipe" ||
                        ocorrencia.statusId === "finalizada"
                );
            }

            return ocorrencias;
        },
        enabled: !!user,
    });
};
