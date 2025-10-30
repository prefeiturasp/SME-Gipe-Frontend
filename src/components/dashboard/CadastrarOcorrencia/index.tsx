"use client";

import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import PageHeader from "../PageHeader/PageHeader";
import { Stepper } from "@/components/stepper/Stepper";
import SecaoInicial from "./SecaoInicial";
import { useState } from "react";
import SecaoFurtoERoubo from "./SecaoFurtoERoubo";
import SecaoNaoFurtoERoubo from "./SecaoNaoFurtoERoubo";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useQueryClient } from "@tanstack/react-query";

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

    const getStep2Label = () => {
        if (!formData.tipoOcorrencia) return "Fase 02";
        return isFurtoRoubo ? "Formulário patrimonial" : "Formulário geral";
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
            label: "Fase 03",
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
                    <SecaoInicial onSuccess={() => setCurrentStep(2)} />
                )}
                {currentStep === 2 && isFurtoRoubo && (
                    <SecaoFurtoERoubo
                        onNext={() => setCurrentStep(3)}
                        onPrevious={() => setCurrentStep(1)}
                    />
                )}
                {currentStep === 2 && !isFurtoRoubo && (
                    <SecaoNaoFurtoERoubo
                        onNext={() => setCurrentStep(3)}
                        onPrevious={() => setCurrentStep(1)}
                    />
                )}
            </QuadroBranco>
        </div>
    );
}
