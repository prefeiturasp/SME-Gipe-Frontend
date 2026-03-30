"use client";

import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import { Stepper } from "@/components/stepper/Stepper";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import StepRenderer from "./StepRenderer";

type CadastrarOcorrenciaProps = {
    initialStep?: number;
};

export default function CadastrarOcorrencia({
    initialStep = 1,
}: Readonly<CadastrarOcorrenciaProps>) {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const formData = useOcorrenciaFormStore((state) => state.formData);
    const ocorrenciaUuid = useOcorrenciaFormStore(
        (state) => state.ocorrenciaUuid,
    );
    const queryClient = useQueryClient();
    const reset = useOcorrenciaFormStore((state) => state.reset);

    const setFormData = useOcorrenciaFormStore((state) => state.setFormData);

    const [currentTipoOcorrencia, setCurrentTipoOcorrencia] = useState<
        string | undefined
    >(formData.tipoOcorrencia);
    const [currentPossuiInfoAgressor, setCurrentPossuiInfoAgressor] = useState<
        string | undefined
    >(formData.possuiInfoAgressorVitima);

    const isFurtoRoubo = currentTipoOcorrencia === "Sim";
    const hasAgressorVitimaInfo = currentPossuiInfoAgressor === "Sim";

    const handleSecaoInicialChange = (data: { tipoOcorrencia?: string }) => {
        if (data.tipoOcorrencia !== undefined) {
            if (data.tipoOcorrencia !== currentTipoOcorrencia) {
                setFormData({
                    tiposOcorrencia: [],
                    descricao: "",
                    smartSampa: undefined,
                    envolvidos: [],
                    possuiInfoAgressorVitima: undefined,
                });
            }
            setCurrentTipoOcorrencia(data.tipoOcorrencia);
        }
    };

    const handleSecaoNaoFurtoChange = (data: {
        possuiInfoAgressorVitima?: string;
    }) => {
        if (data.possuiInfoAgressorVitima !== undefined) {
            setCurrentPossuiInfoAgressor(data.possuiInfoAgressorVitima);
        }
    };

    useEffect(() => {
        setCurrentTipoOcorrencia(formData.tipoOcorrencia);
        setCurrentPossuiInfoAgressor(formData.possuiInfoAgressorVitima);
    }, [formData.tipoOcorrencia, formData.possuiInfoAgressorVitima]);

    const handleClick = async () => {
        reset();

        await queryClient.invalidateQueries({
            queryKey: ["ocorrencia", ocorrenciaUuid],
        });
    };

    const handleNextStep = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const getStep2Label = () => {
        if (!formData.tipoOcorrencia) return "Fase 02";
        return isFurtoRoubo ? "Formulário patrimonial" : "Formulário geral";
    };

    const getStep3Label = () => {
        if (!formData.possuiInfoAgressorVitima && currentStep < 3) {
            return "Fase 03";
        }

        return hasAgressorVitimaInfo && !isFurtoRoubo
            ? "Informações adicionais"
            : "Seção final";
    };

    const steps = [
        { label: "Cadastro de ocorrência", description: "" },
        { label: getStep2Label(), description: "" },

        ...(hasAgressorVitimaInfo && !isFurtoRoubo
            ? [
                  { label: getStep3Label(), description: "" },
                  { label: "Seção final", description: "" },
              ]
            : [{ label: getStep3Label(), description: "" }]),

        { label: "Anexos", description: "" },
    ];

    return (
        <div className="pt-4">
            <PageHeader
                title="Intercorrências Institucionais"
                onClickBack={handleClick}
            />
            <QuadroBranco>
                <div className="flex flex-col">
                    <h1 className="text-[#42474a] text-[24px] font-bold m-0">
                        Nova ocorrência
                    </h1>
                    <span className="text-[14px] text-[#42474a] my-4">
                        Preencha as informações abaixo para registrar uma nova
                        ocorrência. Lembre-se de colocar a maior quantidade de
                        detalhes possíveis para nos ajudar a planejar ações de
                        prevenção e solução de problemas de segurança.
                    </span>
                    <p className="text-[14px] text-[#42474a]">
                        *Respostas obrigatórias
                    </p>
                </div>
            </QuadroBranco>

            <QuadroBranco>
                <div className="mt-4">
                    <Stepper steps={steps} currentStep={currentStep} />
                </div>

                <StepRenderer
                    currentStep={currentStep}
                    isFurtoRoubo={isFurtoRoubo}
                    hasAgressorVitimaInfo={hasAgressorVitimaInfo}
                    onNext={handleNextStep}
                    onPrevious={handlePreviousStep}
                    onSecaoInicialChange={handleSecaoInicialChange}
                    onSecaoNaoFurtoChange={handleSecaoNaoFurtoChange}
                />
            </QuadroBranco>
        </div>
    );
}
