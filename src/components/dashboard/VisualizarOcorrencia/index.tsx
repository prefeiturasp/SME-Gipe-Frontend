"use client";

import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useEffect, useState } from "react";
import {
    ANEXOS_COUNT,
    DRE_QUESTION_COUNT,
    computeStartingNumbers,
} from "../CadastrarOcorrencia/questionNumberingUtils";
import FormularioDre from "../FormularioDre";
import FormularioGipe from "../FormularioGipe";
import { FormularioUE } from "../FormularioUE/FormularioUE";

type StepType = "ue" | "dre" | "gipe";

export default function VisualizarOcorrencia() {
    const [step, setStep] = useState<StepType>("ue");
    const formData = useOcorrenciaFormStore((state) => state.formData);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    const isFurtoRoubo = formData.tipoOcorrencia === "Sim";
    const hasAgressorVitimaInfo = formData.possuiInfoAgressorVitima === "Sim";
    const personCount = formData.pessoasAgressoras?.length ?? 1;

    const qNumbers = computeStartingNumbers(
        isFurtoRoubo,
        hasAgressorVitimaInfo,
        personCount,
    );
    const dreStart = qNumbers.anexos + ANEXOS_COUNT;
    const gipeStart = dreStart + DRE_QUESTION_COUNT + ANEXOS_COUNT;

    const renderStep = () => {
        switch (step) {
            case "dre":
                return (
                    <FormularioDre
                        onPrevious={() => setStep("ue")}
                        onNext={() => setStep("gipe")}
                        startingQuestionNumber={dreStart}
                    />
                );
            case "gipe":
                return (
                    <FormularioGipe
                        onPrevious={() => setStep("dre")}
                        startingQuestionNumber={gipeStart}
                    />
                );
            case "ue":
            default:
                return <FormularioUE onNext={() => setStep("dre")} />;
        }
    };

    return <div className="pt-4">{renderStep()}</div>;
}
