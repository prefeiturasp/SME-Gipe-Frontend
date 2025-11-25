"use client";

import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import PageHeader from "../PageHeader/PageHeader";
import { DetalhamentoDre } from "./DetalhamentoDre";

export default function FormularioDrePage() {
    const reset = useOcorrenciaFormStore((state) => state.reset);
    const ocorrenciaUuid = useOcorrenciaFormStore(
        (state) => state.ocorrenciaUuid
    );
    const queryClient = useQueryClient();
    const router = useRouter();

    const handleClickBack = async () => {
        reset();

        await queryClient.invalidateQueries({
            queryKey: ["ocorrencia", ocorrenciaUuid],
        });

        router.back();
    };

    return (
        <div className="pt-4">
            <PageHeader
                title="Detalhes da Intercorrência - Diretoria Regional de Educação (DRE)"
                onClickBack={handleClickBack}
            />
            <DetalhamentoDre />
        </div>
    );
}
