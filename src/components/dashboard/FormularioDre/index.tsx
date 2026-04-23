"use client";

import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useQueryClient } from "@tanstack/react-query";
import PageHeader from "../PageHeader/PageHeader";
import { DetalhamentoDre } from "./DetalhamentoDre";

export default function FormularioDrePage({
    onPrevious,
    onNext,
    startingQuestionNumber,
}: Readonly<{
    onPrevious: () => void;
    onNext: () => void;
    startingQuestionNumber?: number;
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
                title="Detalhes da Intercorrência - Diretoria Regional de Educação (DRE)"
                onClickBack={handleClickBack}
            />
            <DetalhamentoDre
                onPrevious={onPrevious}
                onNext={onNext}
                startingQuestionNumber={startingQuestionNumber}
            />
        </div>
    );
}
