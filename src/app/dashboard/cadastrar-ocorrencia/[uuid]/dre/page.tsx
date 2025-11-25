"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetOcorrencia } from "@/hooks/useGetOcorrencia";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { transformOcorrenciaToFormData } from "@/lib/transformOcorrenciaToFormData";
import FormularioDre from "@/components/dashboard/FormularioDre";

const LoadingSpinner = () => <div>Carregando ocorrência...</div>;

const ErrorMessage = ({ error }: { error: unknown }) => {
    const message = error instanceof Error ? error.message : String(error);
    return <div>Erro ao buscar dados: {message}</div>;
};

export default function FormularioDrePage() {
    const params = useParams();
    const ocorrenciaId = String(params.uuid);
    const [isStoreReady, setIsStoreReady] = useState(false);

    const {
        data: ocorrencia,
        isLoading,
        isError,
        error,
    } = useGetOcorrencia(ocorrenciaId);

    const { setFormData, setSavedFormData, setOcorrenciaUuid, reset } =
        useOcorrenciaFormStore();

    useEffect(() => {
        reset();

        if (ocorrencia) {
            const formData = transformOcorrenciaToFormData(ocorrencia);

            setOcorrenciaUuid(ocorrencia.uuid);
            setFormData(formData);
            setSavedFormData(formData);
            setIsStoreReady(true);
        }

        return () => {
            reset();
            setIsStoreReady(false);
        };
    }, [ocorrencia, setFormData, setSavedFormData, setOcorrenciaUuid, reset]);

    if (isError) {
        return <ErrorMessage error={error} />;
    }

    if (isLoading || !isStoreReady || !ocorrencia) {
        return <LoadingSpinner />;
    }

    return <FormularioDre />;
}
