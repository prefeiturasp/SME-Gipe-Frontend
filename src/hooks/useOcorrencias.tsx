import { useQuery } from "@tanstack/react-query";
import { useUserStore, type User } from "@/stores/useUserStore";
import { useUserPermissions } from "./useUserPermissions";
import { Ocorrencia } from "@/types/ocorrencia";
import { getOcorrenciasAction } from "@/actions/ocorrencias";

const fetchAndTransformOcorrencias = async (
    isPontoFocal: boolean,
    isAssistenteOuDiretor: boolean,
    user: User | null
): Promise<Ocorrencia[]> => {
    let params = {};
    if (isPontoFocal && user?.unidades?.[0]?.dre?.codigo_eol) {
        params = { dre: user.unidades[0].dre.codigo_eol };
    } else if (isAssistenteOuDiretor && user?.username) {
        params = { usuario: user.username };
    }

    const response = await getOcorrenciasAction(params);

    if (!response.success) {
        throw new Error(response.error);
    }

    const tipos = [
        "Ocorrência com objeto sem ameaça (arma de fogo, arma branca, etc)",
    ];

    function randomFrom<T>(arr: readonly T[]) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    return response.data.map((item, index) => {
        const date = new Date(item.data_ocorrencia);
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();
        const hour = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");

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
    const { isPontoFocal, isAssistenteOuDiretor } = useUserPermissions();

    return useQuery<Ocorrencia[]>({
        queryKey: ["ocorrencias", user?.username],
        queryFn: () =>
            fetchAndTransformOcorrencias(
                isPontoFocal,
                isAssistenteOuDiretor,
                user
            ),
        enabled: !!user,
    });
};
