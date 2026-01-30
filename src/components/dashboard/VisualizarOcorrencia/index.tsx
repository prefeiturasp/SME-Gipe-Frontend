"use client";

import { useEffect, useState } from "react";
import FormularioDre from "../FormularioDre";
import FormularioGipe from "../FormularioGipe";
import { FormularioUE } from "../FormularioUE/FormularioUE";

type StepType = "ue" | "dre" | "gipe";

export default function VisualizarOcorrencia() {
    const [step, setStep] = useState<StepType>("ue");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

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
