"use client";

import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import PageHeader from "../PageHeader/PageHeader";
import { DetalhamentoGipe } from "./DetalhamentoGipe/index";

export default function FormularioGipePage({
    onPrevious,
}: Readonly<{
    onPrevious: () => void;
}>) {
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
        <div>
            <PageHeader
                title="Detalhes da Intercorrência - Gabinete Integrado de Proteção Escolar (GIPE)"
                onClickBack={handleClickBack}
            />
            <DetalhamentoGipe onPrevious={onPrevious} />
        </div>
    );
}
