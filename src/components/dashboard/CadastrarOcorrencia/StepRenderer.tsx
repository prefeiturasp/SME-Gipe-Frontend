import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import Anexos from "./Anexos";
import InformacoesAdicionais from "./InformacoesAdicionais";
import { computeStartingNumbers } from "./questionNumberingUtils";
import SecaoFinal from "./SecaoFinal";
import SecaoFurtoERoubo from "./SecaoFurtoERoubo";
import SecaoInicial from "./SecaoInicial";
import SecaoNaoFurtoERoubo from "./SecaoNaoFurtoERoubo";

type StepRendererProps = {
    currentStep: number;
    isFurtoRoubo: boolean;
    hasAgressorVitimaInfo: boolean;
    onNext: () => void;
    onPrevious: () => void;
    onSecaoInicialChange?: (data: { tipoOcorrencia?: string }) => void;
    onSecaoNaoFurtoChange?: (data: {
        possuiInfoAgressorVitima?: string;
    }) => void;
};

export default function StepRenderer({
    currentStep,
    isFurtoRoubo,
    hasAgressorVitimaInfo,
    onNext,
    onPrevious,
    onSecaoInicialChange,
    onSecaoNaoFurtoChange,
}: Readonly<StepRendererProps>) {
    const formData = useOcorrenciaFormStore((state) => state.formData);
    const personCount = formData.pessoasAgressoras?.length ?? 1;

    const qNumbers = computeStartingNumbers(
        isFurtoRoubo,
        hasAgressorVitimaInfo,
        personCount,
    );
    const getCurrentStepNumber = () => {
        if (currentStep === 1) return 1;
        if (currentStep === 2) return 2;

        if (currentStep === 3) {
            return hasAgressorVitimaInfo && !isFurtoRoubo ? 3 : 4;
        }

        if (currentStep === 4) {
            return hasAgressorVitimaInfo && !isFurtoRoubo ? 4 : 5;
        }

        if (currentStep === 5) return 5;

        return currentStep;
    };

    const stepComponents = [
        {
            step: 1,
            component: (
                <SecaoInicial
                    onSuccess={onNext}
                    onFormChange={onSecaoInicialChange}
                    startingQuestionNumber={qNumbers.secaoInicial}
                />
            ),
        },
        {
            step: 2,
            condition: isFurtoRoubo,
            component: (
                <SecaoFurtoERoubo
                    onNext={onNext}
                    onPrevious={onPrevious}
                    startingQuestionNumber={qNumbers.step2}
                />
            ),
        },
        {
            step: 2,
            condition: !isFurtoRoubo,
            component: (
                <SecaoNaoFurtoERoubo
                    onNext={onNext}
                    onPrevious={onPrevious}
                    onFormChange={onSecaoNaoFurtoChange}
                    startingQuestionNumber={qNumbers.step2}
                />
            ),
        },
        {
            step: 3,
            condition: hasAgressorVitimaInfo && !isFurtoRoubo,
            component: (
                <InformacoesAdicionais
                    onNext={onNext}
                    onPrevious={onPrevious}
                    startingQuestionNumber={qNumbers.informacoesAdicionais}
                />
            ),
        },
        {
            step: 4,
            component: (
                <SecaoFinal
                    onNext={onNext}
                    onPrevious={onPrevious}
                    startingQuestionNumber={qNumbers.secaoFinal}
                />
            ),
        },
        {
            step: 5,
            component: (
                <Anexos
                    onNext={() => {
                        console.log("Ocorrência finalizada!");
                    }}
                    onPrevious={onPrevious}
                    startingQuestionNumber={qNumbers.anexos}
                />
            ),
        },
    ];

    const stepNumber = getCurrentStepNumber();
    const stepConfig = stepComponents.find(
        (config) =>
            config.step === stepNumber &&
            (config.condition === undefined || config.condition === true),
    );

    return stepConfig?.component || null;
}
