"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetOcorrencia } from "@/hooks/useGetOcorrencia";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import CadastrarOcorrencia from "@/components/dashboard/CadastrarOcorrencia";
import { OcorrenciaAPI } from "@/actions/obter-ocorrencia";

const LoadingSpinner = () => <div>Carregando ocorrência...</div>;

const ErrorMessage = ({ error }: { error: unknown }) => {
    const message = error instanceof Error ? error.message : String(error);
    return <div>Erro ao buscar dados: {message}</div>;
};

const transformOcorrenciaToFormData = (ocorrencia: OcorrenciaAPI) => {
    const dataOcorrencia = ocorrencia.data_ocorrencia
        ? new Date(ocorrencia.data_ocorrencia).toISOString().split("T")[0]
        : "";

    const tipoOcorrencia = ocorrencia.sobre_furto_roubo_invasao_depredacao
        ? ("Sim" as const)
        : ("Não" as const);

    const validSmartSampaValues = [
        "sim-houve-dano",
        "sim-sem-dano",
        "nao-faz-parte",
    ] as const;
    const smartSampa =
        ocorrencia.smart_sampa &&
        validSmartSampaValues.includes(
            ocorrencia.smart_sampa as (typeof validSmartSampaValues)[number]
        )
            ? (ocorrencia.smart_sampa as
                  | "sim-houve-dano"
                  | "sim-sem-dano"
                  | "nao-faz-parte")
            : undefined;

    return {
        dataOcorrencia,
        dre: ocorrencia.dre_codigo_eol,
        unidadeEducacional: ocorrencia.unidade_codigo_eol,
        tipoOcorrencia,

        ...(ocorrencia.tipos_ocorrencia && {
            tiposOcorrencia: ocorrencia.tipos_ocorrencia,
        }),
        ...(ocorrencia.descricao && { descricao: ocorrencia.descricao }),
        ...(smartSampa && { smartSampa }),
    };
};

export default function EditarOcorrenciaPage() {
    const params = useParams();
    const ocorrenciaId = String(params.uuid);
    const [isStoreReady, setIsStoreReady] = useState(false);

    const {
        data: ocorrencia,
        isLoading,
        isError,
        error,
    } = useGetOcorrencia(ocorrenciaId);

    const { setFormData, setOcorrenciaUuid, reset } = useOcorrenciaFormStore();

    useEffect(() => {
        reset();

        if (ocorrencia) {
            const formData = transformOcorrenciaToFormData(ocorrencia);

            setOcorrenciaUuid(ocorrencia.uuid);
            setFormData(formData);
            setIsStoreReady(true);
        }

        return () => {
            reset();
            setIsStoreReady(false);
        };
    }, [ocorrencia, setFormData, setOcorrenciaUuid, reset]);

    if (isLoading || !isStoreReady) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <ErrorMessage error={error} />;
    }

    const getInitialStep = () => {
        // função futura para implementar lógica baseada no status da ocorrência
        return 1;
    };

    return ocorrencia ? (
        <CadastrarOcorrencia initialStep={getInitialStep()} />
    ) : null;
}
