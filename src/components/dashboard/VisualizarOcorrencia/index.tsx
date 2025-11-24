"use client";

import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import PageHeader from "../PageHeader/PageHeader";
import { Stepper } from "@/components/stepper/Stepper";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useQueryClient } from "@tanstack/react-query";
import SecaoInicial, {
    SecaoInicialRef,
} from "../CadastrarOcorrencia/SecaoInicial";
import SecaoFurtoERoubo, {
    SecaoFurtoERouboRef,
} from "../CadastrarOcorrencia/SecaoFurtoERoubo";
import SecaoNaoFurtoERoubo, {
    SecaoNaoFurtoERouboRef,
} from "../CadastrarOcorrencia/SecaoNaoFurtoERoubo";
import SecaoFinal, { SecaoFinalRef } from "../CadastrarOcorrencia/SecaoFinal";
import InformacoesAdicionais, {
    InformacoesAdicionaisRef,
} from "../CadastrarOcorrencia/InformacoesAdicionais";
import Anexos from "../CadastrarOcorrencia/Anexos";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

export default function VisualizarOcorrencia() {
    const formData = useOcorrenciaFormStore((state) => state.formData);
    const ocorrenciaUuid = useOcorrenciaFormStore(
        (state) => state.ocorrenciaUuid
    );
    const queryClient = useQueryClient();
    const reset = useOcorrenciaFormStore((state) => state.reset);

    // Refs para acessar os métodos dos formulários
    const secaoInicialRef = useRef<SecaoInicialRef>(null);
    const secaoFurtoERouboRef = useRef<SecaoFurtoERouboRef>(null);
    const secaoNaoFurtoERouboRef = useRef<SecaoNaoFurtoERouboRef>(null);
    const informacoesAdicionaisRef = useRef<InformacoesAdicionaisRef>(null);
    const secaoFinalRef = useRef<SecaoFinalRef>(null);

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

    const getStep2Label = () => {
        return isFurtoRoubo ? "Formulário patrimonial" : "Formulário geral";
    };

    const getStep3Label = () => {
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
                            ref={secaoInicialRef}
                            showButtons={false}
                            onFormChange={handleSecaoInicialChange}
                        />
                    </div>

                    <div className="">
                        {isFurtoRoubo ? (
                            <SecaoFurtoERoubo
                                ref={secaoFurtoERouboRef}
                                showButtons={false}
                            />
                        ) : (
                            <SecaoNaoFurtoERoubo
                                ref={secaoNaoFurtoERouboRef}
                                showButtons={false}
                                onFormChange={handleSecaoNaoFurtoChange}
                            />
                        )}
                    </div>

                    {hasAgressorVitimaInfo && !isFurtoRoubo && (
                        <div className="">
                            <InformacoesAdicionais
                                ref={informacoesAdicionaisRef}
                                showButtons={false}
                            />
                        </div>
                    )}

                    <div className="">
                        <SecaoFinal ref={secaoFinalRef} showButtons={false} />
                    </div>

                    <div className="">
                        <Anexos showButtons={false} />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button size="sm" variant="submit">
                            Finalizar
                        </Button>
                    </div>
                </div>
            </QuadroBranco>
        </div>
    );
}
