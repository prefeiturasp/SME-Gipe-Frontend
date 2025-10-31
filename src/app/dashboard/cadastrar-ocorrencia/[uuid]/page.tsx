"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetOcorrencia } from "@/hooks/useGetOcorrencia";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import CadastrarOcorrencia from "@/components/dashboard/CadastrarOcorrencia";
import { OcorrenciaDetalheAPI } from "@/actions/obter-ocorrencia";

const LoadingSpinner = () => <div>Carregando ocorrência...</div>;

const ErrorMessage = ({ error }: { error: unknown }) => {
    const message = error instanceof Error ? error.message : String(error);
    return <div>Erro ao buscar dados: {message}</div>;
};

const transformOcorrenciaToFormData = (ocorrencia: OcorrenciaDetalheAPI) => {
    let dataOcorrencia = "";
    let horaOcorrencia = "";

    if (ocorrencia.data_ocorrencia) {
        const dataHora = new Date(ocorrencia.data_ocorrencia);
        const year = dataHora.getFullYear();
        const month = String(dataHora.getMonth() + 1).padStart(2, "0");
        const day = String(dataHora.getDate()).padStart(2, "0");
        const hours = String(dataHora.getHours()).padStart(2, "0");
        const minutes = String(dataHora.getMinutes()).padStart(2, "0");

        dataOcorrencia = `${year}-${month}-${day}`;
        horaOcorrencia = `${hours}:${minutes}`;
    }

    const tipoOcorrencia = ocorrencia.sobre_furto_roubo_invasao_depredacao
        ? ("Sim" as const)
        : ("Não" as const);

    const validSmartSampaValues = [
        "sim_com_dano",
        "sim_sem_dano",
        "nao_faz_parte",
    ] as const;
    const rawSmartSampa = ocorrencia.smart_sampa_situacao;
    const smartSampa =
        rawSmartSampa && validSmartSampaValues.includes(rawSmartSampa)
            ? rawSmartSampa
            : undefined;

    const tiposOcorrencia = ocorrencia.tipos_ocorrencia?.map(
        (tipo) => tipo.uuid
    );

    return {
        dataOcorrencia,
        horaOcorrencia,
        dre: ocorrencia.dre_codigo_eol,
        unidadeEducacional: ocorrencia.unidade_codigo_eol,
        tipoOcorrencia,
        ...(tiposOcorrencia && { tiposOcorrencia }),
        ...(ocorrencia.descricao_ocorrencia && {
            descricao: ocorrencia.descricao_ocorrencia,
        }),
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

    const getInitialStep = () => {
        // função futura para implementar lógica baseada no status da ocorrência
        return 1;
    };

    return <CadastrarOcorrencia initialStep={getInitialStep()} />;
}
