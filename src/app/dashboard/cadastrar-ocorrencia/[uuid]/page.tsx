"use client";

import CadastrarOcorrencia from "@/components/dashboard/CadastrarOcorrencia";
import VisualizarOcorrencia from "@/components/dashboard/VisualizarOcorrencia";
import { useGetOcorrencia } from "@/hooks/useGetOcorrencia";
import { useGetOcorrenciaDre } from "@/hooks/useGetOcorrenciaDre";
import { useGetOcorrenciaGipe } from "@/hooks/useGetOcorrenciaGipe";
import { transformOcorrenciaDreToFormData } from "@/lib/transformOcorrenciaDreToFormData";
import { transformOcorrenciaGipeToFormData } from "@/lib/transformOcorrenciaGipeToFormData";
import { transformOcorrenciaToFormData } from "@/lib/transformOcorrenciaToFormData";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const LoadingSpinner = () => <div>Carregando ocorrência...</div>;

const ErrorMessage = ({ error }: { error: unknown }) => {
    const message = error instanceof Error ? error.message : String(error);
    return <div>Erro ao buscar dados: {message}</div>;
};

export default function EditarOcorrenciaPage() {
    const params = useParams();
    const ocorrenciaId = String(params.uuid);
    const [isStoreReady, setIsStoreReady] = useState(false);
    const queryClient = useQueryClient();

    const {
        data: ocorrencia,
        isLoading,
        isError,
        error,
    } = useGetOcorrencia(ocorrenciaId);

    const isEmPreenchimento = ocorrencia?.status === "em_preenchimento_diretor";
    const isEnviadaGipe =
        ocorrencia?.status === "enviado_para_gipe" ||
        ocorrencia?.status === "finalizada";

    const { data: ocorrenciaDre } = useGetOcorrenciaDre(ocorrenciaId, {
        enabled: !isEmPreenchimento,
    });

    const { data: ocorrenciaGipe } = useGetOcorrenciaGipe(ocorrenciaId, {
        enabled: isEnviadaGipe,
    });

    const { setFormData, setSavedFormData, setOcorrenciaUuid, reset } =
        useOcorrenciaFormStore();

    useEffect(() => {
        return () => {
            reset();
            setIsStoreReady(false);
            queryClient.invalidateQueries({
                queryKey: ["ocorrencia", ocorrenciaId],
            });
            queryClient.invalidateQueries({
                queryKey: ["ocorrencia-dre", ocorrenciaId],
            });
            queryClient.invalidateQueries({
                queryKey: ["ocorrencia-gipe", ocorrenciaId],
            });
        };
    }, [reset, queryClient, ocorrenciaId]);

    useEffect(() => {
        if (!ocorrencia) return;

        const formDataUe = transformOcorrenciaToFormData(ocorrencia);
        let combinedFormData = formDataUe;

        if (!isEmPreenchimento && ocorrenciaDre) {
            const formDataDre = transformOcorrenciaDreToFormData(ocorrenciaDre);
            combinedFormData = { ...formDataUe, ...formDataDre };
        }

        if (isEnviadaGipe && ocorrenciaGipe) {
            const formDataGipe =
                transformOcorrenciaGipeToFormData(ocorrenciaGipe);
            combinedFormData = { ...combinedFormData, ...formDataGipe };
        }

        setOcorrenciaUuid(ocorrencia.uuid);
        setFormData(combinedFormData);
        setSavedFormData(combinedFormData);
        setIsStoreReady(true);
    }, [
        ocorrencia,
        ocorrenciaDre,
        ocorrenciaGipe,
        isEmPreenchimento,
        isEnviadaGipe,
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
        (!isEmPreenchimento && !ocorrenciaDre) ||
        (isEnviadaGipe && !ocorrenciaGipe)
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
