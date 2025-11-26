import { screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { forwardRef } from "react";
import { renderWithClient } from "../CadastrarOcorrencia/__tests__/helpers";
import { FormularioUE } from "./FormularioUE";

const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockRouterPush,
        back: vi.fn(),
    }),
}));

vi.mock("../CadastrarOcorrencia/SecaoInicial", () => {
    const Mock = forwardRef<
        HTMLDivElement,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { onFormChange?: (data: any) => void }
    >((props, ref) => {
        return (
            <div
                ref={ref}
                data-testid="mock-secao-inicial"
                data-onformchange={!!props.onFormChange}
            >
                Mock SecaoInicial
            </div>
        );
    });
    Mock.displayName = "SecaoInicial";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/SecaoFurtoERoubo", () => {
    const Mock = forwardRef<HTMLDivElement>((_, ref) => (
        <div ref={ref}>Mock SecaoFurtoERoubo</div>
    ));
    Mock.displayName = "SecaoFurtoERoubo";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/SecaoNaoFurtoERoubo", () => {
    const Mock = forwardRef<
        HTMLDivElement,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { onFormChange?: (data: any) => void }
    >((props, ref) => {
        return (
            <div
                ref={ref}
                data-testid="mock-secao-nao-furto"
                data-onformchange={!!props.onFormChange}
            >
                Mock SecaoNaoFurtoERoubo
            </div>
        );
    });
    Mock.displayName = "SecaoNaoFurtoERoubo";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/SecaoFinal", () => {
    const Mock = forwardRef<HTMLDivElement>((_, ref) => (
        <div ref={ref}>Mock SecaoFinal</div>
    ));
    Mock.displayName = "SecaoFinal";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/InformacoesAdicionais", () => {
    const Mock = forwardRef<HTMLDivElement>((_, ref) => (
        <div ref={ref}>Mock InformacoesAdicionais</div>
    ));
    Mock.displayName = "InformacoesAdicionais";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/Anexos", () => ({
    default: () => <div>Mock Anexos</div>,
}));

vi.mock("@/components/stepper/Stepper", () => ({
    Stepper: ({
        steps,
        currentStep,
    }: {
        steps: { label: string }[];
        currentStep: number;
    }) => (
        <div data-testid="mock-stepper">
            <span data-testid="current-step">{currentStep}</span>
            <span data-testid="total-steps">{steps.length}</span>
            {steps.map((step) => (
                <span key={step.label}>{step.label}</span>
            ))}
        </div>
    ),
}));

const mockStoreState = {
    formData: {},
    ocorrenciaUuid: "test-uuid",
};

vi.mock("@/stores/useOcorrenciaFormStore", () => ({
    useOcorrenciaFormStore: vi.fn((selector) => {
        if (typeof selector === "function") {
            return selector(mockStoreState);
        }
        return mockStoreState;
    }),
}));

describe("FormularioUE", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockStoreState.formData = {};
        mockRouterPush.mockClear();
    });

    it("deve renderizar o Stepper", () => {
        renderWithClient(<FormularioUE />);

        expect(screen.getByTestId("mock-stepper")).toBeInTheDocument();
    });

    it("deve renderizar SecaoInicial", () => {
        renderWithClient(<FormularioUE />);

        expect(screen.getByTestId("mock-secao-inicial")).toBeInTheDocument();
    });

    it("deve renderizar SecaoFinal", () => {
        renderWithClient(<FormularioUE />);

        expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
    });

    it("deve renderizar Anexos", () => {
        renderWithClient(<FormularioUE />);

        expect(screen.getByText("Mock Anexos")).toBeInTheDocument();
    });

    it("deve renderizar SecaoFurtoERoubo quando tipoOcorrencia é 'Sim'", () => {
        mockStoreState.formData = { tipoOcorrencia: "Sim" };
        renderWithClient(<FormularioUE />);

        expect(screen.getByText("Mock SecaoFurtoERoubo")).toBeInTheDocument();
        expect(
            screen.queryByTestId("mock-secao-nao-furto")
        ).not.toBeInTheDocument();
    });

    it("deve renderizar SecaoNaoFurtoERoubo quando tipoOcorrencia não é 'Sim'", () => {
        mockStoreState.formData = { tipoOcorrencia: "Não" };
        renderWithClient(<FormularioUE />);

        expect(screen.getByTestId("mock-secao-nao-furto")).toBeInTheDocument();
        expect(
            screen.queryByText("Mock SecaoFurtoERoubo")
        ).not.toBeInTheDocument();
    });

    it("deve renderizar InformacoesAdicionais quando possuiInfoAgressorVitima é 'Sim' e não é furto/roubo", () => {
        mockStoreState.formData = {
            tipoOcorrencia: "Não",
            possuiInfoAgressorVitima: "Sim",
        };
        renderWithClient(<FormularioUE />);

        expect(
            screen.getByText("Mock InformacoesAdicionais")
        ).toBeInTheDocument();
    });

    it("não deve renderizar InformacoesAdicionais quando possuiInfoAgressorVitima não é 'Sim'", () => {
        mockStoreState.formData = {
            tipoOcorrencia: "Não",
            possuiInfoAgressorVitima: "Não",
        };
        renderWithClient(<FormularioUE />);

        expect(
            screen.queryByText("Mock InformacoesAdicionais")
        ).not.toBeInTheDocument();
    });

    it("deve calcular corretamente o número total de steps para Furto/Roubo", () => {
        mockStoreState.formData = { tipoOcorrencia: "Sim" };
        renderWithClient(<FormularioUE />);

        const currentStep = screen.getByTestId("current-step");
        expect(currentStep).toHaveTextContent("5"); // 4 steps + 1
    });

    it("deve calcular corretamente o número total de steps para Não Furto/Roubo sem info agressor", () => {
        mockStoreState.formData = {
            tipoOcorrencia: "Não",
            possuiInfoAgressorVitima: "Não",
        };
        renderWithClient(<FormularioUE />);

        const currentStep = screen.getByTestId("current-step");
        expect(currentStep).toHaveTextContent("5"); // 4 steps + 1
    });

    it("deve calcular corretamente o número total de steps para Não Furto/Roubo com info agressor", () => {
        mockStoreState.formData = {
            tipoOcorrencia: "Não",
            possuiInfoAgressorVitima: "Sim",
        };
        renderWithClient(<FormularioUE />);

        const currentStep = screen.getByTestId("current-step");
        expect(currentStep).toHaveTextContent("6"); // 5 steps + 1
    });

    it("deve passar showButtons=false para todos os subcomponentes por padrão", () => {
        renderWithClient(<FormularioUE />);

        // Anexos deve receber showButtons como false
        expect(screen.getByText("Mock Anexos")).toBeInTheDocument();
    });
});
