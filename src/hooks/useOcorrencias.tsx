import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { Ocorrencia } from "@/types/ocorrencia";
import { getOcorrenciasAction } from "@/actions/ocorrencias";

function randomFrom<T>(arr: readonly T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const fetchAndTransformOcorrencias = async (): Promise<Ocorrencia[]> => {
    const response = await getOcorrenciasAction();

    if (!response.success) {
        throw new Error(response.error);
    }

    const tipos = [
        "Ocorrência com objeto sem ameaça (arma de fogo, arma branca, etc)",
    ];

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
            protocolo: `PRT-${String(item.id)}`,
            dataHora: `${day}/${month}/${year} - ${hour}:${minutes}`,
            codigoEol: item.unidade_codigo_eol,
            dre: item.dre_codigo_eol,
            nomeUe: `ESCOLA MUNICIPAL ${index + 1}`,
            tipoViolencia: randomFrom(tipos),
            status: "Incompleta" as Ocorrencia["status"],
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
