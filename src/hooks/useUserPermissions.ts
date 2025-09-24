import { useMemo } from "react";
import { useUserStore } from "@/stores/useUserStore";
import {
    PERFIL_GIPE,
    PERFIL_PONTO_FOCAL,
    PERFIL_ASSISTENTE_DIRETOR,
    PERFIL_DIRETOR,
} from "@/const";

export const useUserPermissions = () => {
    const user = useUserStore((state) => state.user);

    const permissions = useMemo(() => {
        const perfilCodigo = user?.perfil_acesso?.codigo;

        const isGipe = perfilCodigo === PERFIL_GIPE;
        const isPontoFocal = perfilCodigo === PERFIL_PONTO_FOCAL;
        const isAssistenteOuDiretor =
            perfilCodigo === PERFIL_ASSISTENTE_DIRETOR ||
            perfilCodigo === PERFIL_DIRETOR;

        return {
            isGipe,
            isPontoFocal,
            isAssistenteOuDiretor,
        };
    }, [user]);

    return permissions;
};
