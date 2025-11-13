import SecaoInicial from "./SecaoInicial";
import SecaoFurtoERoubo from "./SecaoFurtoERoubo";
import SecaoNaoFurtoERoubo from "./SecaoNaoFurtoERoubo";
import SecaoFinal from "./SecaoFinal";
import InformacoesAdicionais from "./InformacoesAdicionais";
import Anexos from "./Anexos";

type StepRendererProps = {
    currentStep: number;
    isFurtoRoubo: boolean;
    hasAgressorVitimaInfo: boolean;
    onNext: () => void;
    onPrevious: () => void;
};

export default function StepRenderer({
    currentStep,
    isFurtoRoubo,
    hasAgressorVitimaInfo,
    onNext,
    onPrevious,
}: Readonly<StepRendererProps>) {
    const getCurrentStepNumber = () => {
        if (currentStep === 1) return 1;
        if (currentStep === 2) return 2;

        if (currentStep === 3) {
            return hasAgressorVitimaInfo ? 3 : 4;
        }

        if (currentStep === 4) {
            return hasAgressorVitimaInfo ? 4 : 5;
        }

        if (currentStep === 5) return 5;

        return currentStep;
    };

    const stepComponents = [
        {
            step: 1,
            component: <SecaoInicial onSuccess={onNext} />,
        },
        {
            step: 2,
            condition: isFurtoRoubo,
            component: (
                <SecaoFurtoERoubo onNext={onNext} onPrevious={onPrevious} />
            ),
        },
        {
            step: 2,
            condition: !isFurtoRoubo,
            component: (
                <SecaoNaoFurtoERoubo onNext={onNext} onPrevious={onPrevious} />
            ),
        },
        {
            step: 3,
            condition: hasAgressorVitimaInfo,
            component: (
                <InformacoesAdicionais
                    onNext={onNext}
                    onPrevious={onPrevious}
                />
            ),
        },
        {
            step: 4,
            component: <SecaoFinal onNext={onNext} onPrevious={onPrevious} />,
        },
        {
            step: 5,
            component: (
                <Anexos
                    onNext={() => {
                        console.log("Ocorrência finalizada!");
                    }}
                    onPrevious={onPrevious}
                />
            ),
        },
    ];

    const stepNumber = getCurrentStepNumber();
    const stepConfig = stepComponents.find(
        (config) =>
            config.step === stepNumber &&
            (config.condition === undefined || config.condition === true)
    );

    return stepConfig?.component || null;
}
