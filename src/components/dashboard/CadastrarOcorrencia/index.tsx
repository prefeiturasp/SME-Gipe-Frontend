"use client";

import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import PageHeader from "../PageHeader/PageHeader";
import { Stepper } from "@/components/stepper/Stepper";
import SecaoInicial from "./SecaoInicial";
import { useState } from "react";
import SecaoFurtoERoubo from "./SecaoFurtoERoubo";
import SecaoNaoFurtoERoubo from "./SecaoNaoFurtoERoubo";
import SecaoFinal from "./SecaoFinal";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useQueryClient } from "@tanstack/react-query";
import InformacoesAdicionais from "./InformacoesAdicionais";
import Anexos from "./Anexos";

type CadastrarOcorrenciaProps = {
    initialStep?: number;
};

export default function CadastrarOcorrencia({
    initialStep = 1,
}: Readonly<CadastrarOcorrenciaProps>) {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const { formData, ocorrenciaUuid } = useOcorrenciaFormStore();
    const queryClient = useQueryClient();
    const reset = useOcorrenciaFormStore((state) => state.reset);

    const isFurtoRoubo = formData.tipoOcorrencia === "Sim";
    const hasAgressorVitimaInfo = formData.possuiInfoAgressorVitima === "Sim";

    const getStep2Label = () => {
        if (!formData.tipoOcorrencia) return "Fase 02";
        return isFurtoRoubo ? "Formulário patrimonial" : "Formulário geral";
    };

    const getStep3Label = () => {
        if (!formData.possuiInfoAgressorVitima && currentStep < 3)
            return "Fase 03";
        return hasAgressorVitimaInfo ? "Informações adicionais" : "Seção final";
    };

    const steps = [
        {
            label: "Cadastro de ocorrência",
            description: "",
        },
        {
            label: getStep2Label(),
            description: "",
        },
        {
            label: getStep3Label(),
            description: "",
        },
        {
            label: "Anexos",
            description: "",
        },
    ];

    const handleClick = async () => {
        reset();

        await queryClient.invalidateQueries({
            queryKey: ["ocorrencia", ocorrenciaUuid],
        });
    };

    const handleNextStep = () => {
        setCurrentStep((prev) => {
            if (prev < steps.length) {
                return prev + 1;
            }
            return prev;
        });
    };

    const handlePreviousStep = () => {
        setCurrentStep((prev) => {
            if (prev > 1) {
                return prev - 1;
            }
            return prev;
        });
    };

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

                {currentStep === 1 && (
                    <SecaoInicial onSuccess={handleNextStep} />
                )}
                {currentStep === 2 && isFurtoRoubo && (
                    <SecaoFurtoERoubo
                        onNext={handleNextStep}
                        onPrevious={handlePreviousStep}
                    />
                )}
                {currentStep === 2 && !isFurtoRoubo && (
                    <SecaoNaoFurtoERoubo
                        onNext={handleNextStep}
                        onPrevious={handlePreviousStep}
                    />
                )}
                {((currentStep === 3 && !hasAgressorVitimaInfo) ||
                    (hasAgressorVitimaInfo && currentStep === 4)) && (
                    <SecaoFinal
                        onNext={handleNextStep}
                        onPrevious={handlePreviousStep}
                    />
                )}

                {currentStep === 3 && hasAgressorVitimaInfo && (
                    <InformacoesAdicionais
                        onNext={handleNextStep}
                        onPrevious={handlePreviousStep}
                    />
                )}

                {((currentStep === 5 && hasAgressorVitimaInfo) ||
                    (!hasAgressorVitimaInfo && currentStep === 4)) && (
                    <Anexos
                        onNext={() => {
                            console.log("Ocorrência finalizada!");
                        }}
                        onPrevious={handlePreviousStep}
                    />
                )}
            </QuadroBranco>
        </div>
    );
}
