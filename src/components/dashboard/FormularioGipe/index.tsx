"use client";

import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useQueryClient } from "@tanstack/react-query";
import PageHeader from "../PageHeader/PageHeader";
import { DetalhamentoGipe } from "./DetalhamentoGipe/index";

export default function FormularioGipePage({
    onPrevious,
}: Readonly<{
    onPrevious: () => void;
}>) {
    const reset = useOcorrenciaFormStore((state) => state.reset);
    const ocorrenciaUuid = useOcorrenciaFormStore(
        (state) => state.ocorrenciaUuid,
    );
    const queryClient = useQueryClient();

    const handleClickBack = async () => {
        reset();

        await queryClient.invalidateQueries({
            queryKey: ["ocorrencia", ocorrenciaUuid],
        });
    };

    return (
        <div>
            <PageHeader
                title="Detalhes da Intercorrência - Gestão de Intercorrências de Proteção Escolar (GIPE)"
                onClickBack={handleClickBack}
            />
            <DetalhamentoGipe onPrevious={onPrevious} />
        </div>
    );
}
