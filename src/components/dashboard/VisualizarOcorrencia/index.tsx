"use client";

import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import PageHeader from "../PageHeader/PageHeader";
import { Stepper } from "@/components/stepper/Stepper";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useQueryClient } from "@tanstack/react-query";
import SecaoInicial from "../CadastrarOcorrencia/SecaoInicial";
import SecaoFurtoERoubo from "../CadastrarOcorrencia/SecaoFurtoERoubo";
import SecaoNaoFurtoERoubo from "../CadastrarOcorrencia/SecaoNaoFurtoERoubo";
import SecaoFinal from "../CadastrarOcorrencia/SecaoFinal";
import InformacoesAdicionais from "../CadastrarOcorrencia/InformacoesAdicionais";
import Anexos from "../CadastrarOcorrencia/Anexos";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/headless-toast";
import { useEffect, useState } from "react";

export default function VisualizarOcorrencia() {
    const formData = useOcorrenciaFormStore((state) => state.formData);
    const ocorrenciaUuid = useOcorrenciaFormStore(
        (state) => state.ocorrenciaUuid
    );
    const queryClient = useQueryClient();
    const reset = useOcorrenciaFormStore((state) => state.reset);

    // Estados locais que refletem os valores dos formulários em tempo real
    const [currentTipoOcorrencia, setCurrentTipoOcorrencia] = useState<
        string | undefined
    >(formData.tipoOcorrencia);
    const [currentPossuiInfoAgressor, setCurrentPossuiInfoAgressor] = useState<
        string | undefined
    >(formData.possuiInfoAgressorVitima);

    // Valores reativos baseados nos estados locais
    const isFurtoRoubo = currentTipoOcorrencia === "Sim";
    const hasAgressorVitimaInfo = currentPossuiInfoAgressor === "Sim";

    // Callbacks para receber mudanças dos formulários
    const handleSecaoInicialChange = (data: { tipoOcorrencia?: string }) => {
        if (data.tipoOcorrencia !== undefined) {
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

    // Inicializa com valores do formData
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

    const handleSaveAll = () => {
        toast({
            title: "Alterações salvas",
            description:
                "As alterações nos formulários são salvas automaticamente ao preencher cada seção.",
            variant: "success",
        });
    };

    const getStep2Label = () => {
        return isFurtoRoubo ? "Formulário patrimonial" : "Formulário geral";
    };

    const getStep3Label = () => {
        return hasAgressorVitimaInfo ? "Informações adicionais" : "Seção final";
    };

    const steps = [
        { label: "Cadastro de ocorrência", description: "" },
        { label: getStep2Label(), description: "" },

        ...(hasAgressorVitimaInfo
            ? [
                  { label: getStep3Label(), description: "" },
                  { label: "Seção final", description: "" },
              ]
            : [{ label: getStep3Label(), description: "" }]),

        { label: "Anexos", description: "" },
    ];

    const totalSteps = steps.length + 1;

    return (
        <div className="pt-4">
            <PageHeader
                title="Intercorrências Institucionais"
                onClickBack={handleClick}
            />
            <QuadroBranco>
                <div className="flex flex-col">
                    <h1 className="text-[#42474a] text-[24px] font-bold m-0">
                        Visualizar ocorrência
                    </h1>
                    <span className="text-[14px] text-[#42474a] my-4">
                        Confira abaixo todas as informações registradas nesta
                        ocorrência.
                    </span>
                </div>
            </QuadroBranco>

            <QuadroBranco>
                <div className="mt-4">
                    <Stepper steps={steps} currentStep={totalSteps} />
                </div>

                <div className="flex flex-col mt-8">
                    <div className="">
                        <SecaoInicial
                            showButtons={false}
                            onFormChange={handleSecaoInicialChange}
                        />
                    </div>

                    <div className="">
                        {isFurtoRoubo ? (
                            <SecaoFurtoERoubo showButtons={false} />
                        ) : (
                            <SecaoNaoFurtoERoubo
                                showButtons={false}
                                onFormChange={handleSecaoNaoFurtoChange}
                            />
                        )}
                    </div>

                    {hasAgressorVitimaInfo && (
                        <div className="">
                            <InformacoesAdicionais showButtons={false} />
                        </div>
                    )}

                    <div className="">
                        <SecaoFinal showButtons={false} />
                    </div>

                    <div className="">
                        <Anexos showButtons={false} />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            size="sm"
                            variant="submit"
                            onClick={handleSaveAll}
                        >
                            Finalizar
                        </Button>
                    </div>
                </div>
            </QuadroBranco>
        </div>
    );
}
