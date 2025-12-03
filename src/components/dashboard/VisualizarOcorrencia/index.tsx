"use client";

import FormularioDre from "../FormularioDre";
import FormularioGipe from "../FormularioGipe";
import { FormularioUE } from "../FormularioUE/FormularioUE";
import { useState } from "react";

type StepType = "ue" | "dre" | "gipe";

export default function VisualizarOcorrencia() {
    const [step, setStep] = useState<StepType>("ue");

    const renderStep = () => {
        switch (step) {
            case "dre":
                return (
                    <FormularioDre
                        onPrevious={() => setStep("ue")}
                        onNext={() => setStep("gipe")}
                    />
                );
            case "gipe":
                return <FormularioGipe onPrevious={() => setStep("dre")} />;
            case "ue":
            default:
                return <FormularioUE onNext={() => setStep("dre")} />;
        }
    };

    return <div className="pt-4">{renderStep()}</div>;
}
