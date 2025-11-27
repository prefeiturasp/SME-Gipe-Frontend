"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetOcorrencia } from "@/hooks/useGetOcorrencia";
import { useGetOcorrenciaDre } from "@/hooks/useGetOcorrenciaDre";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import CadastrarOcorrencia from "@/components/dashboard/CadastrarOcorrencia";
import VisualizarOcorrencia from "@/components/dashboard/VisualizarOcorrencia";
import { transformOcorrenciaToFormData } from "@/lib/transformOcorrenciaToFormData";
import { transformOcorrenciaDreToFormData } from "@/lib/transformOcorrenciaDreToFormData";

const LoadingSpinner = () => <div>Carregando ocorrência...</div>;

const ErrorMessage = ({ error }: { error: unknown }) => {
    const message = error instanceof Error ? error.message : String(error);
    return <div>Erro ao buscar dados: {message}</div>;
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

    const isEmPreenchimento = ocorrencia?.status === "em_preenchimento_diretor";

    const { data: ocorrenciaDre } = useGetOcorrenciaDre(ocorrenciaId, {
        enabled: !isEmPreenchimento,
    });

    const { setFormData, setSavedFormData, setOcorrenciaUuid, reset } =
        useOcorrenciaFormStore();

    useEffect(() => {
        return () => {
            reset();
            setIsStoreReady(false);
        };
    }, [reset]);

    useEffect(() => {
        if (!ocorrencia) return;

        const formDataUe = transformOcorrenciaToFormData(ocorrencia);
        let combinedFormData = formDataUe;

        if (!isEmPreenchimento && ocorrenciaDre) {
            const formDataDre = transformOcorrenciaDreToFormData(ocorrenciaDre);
            combinedFormData = { ...formDataUe, ...formDataDre };
        }

        setOcorrenciaUuid(ocorrencia.uuid);
        setFormData(combinedFormData);
        setSavedFormData(combinedFormData);
        setIsStoreReady(true);
    }, [
        ocorrencia,
        ocorrenciaDre,
        isEmPreenchimento,
        setFormData,
        setSavedFormData,
        setOcorrenciaUuid,
    ]);

    if (isError) {
        return <ErrorMessage error={error} />;
    }

    if (
        isLoading ||
        !isStoreReady ||
        !ocorrencia ||
        (!isEmPreenchimento && !ocorrenciaDre)
    ) {
        return <LoadingSpinner />;
    }

    const getInitialStep = () => {
        return 1;
    };

    return isEmPreenchimento ? (
        <CadastrarOcorrencia initialStep={getInitialStep()} />
    ) : (
        <VisualizarOcorrencia />
    );
}
