import { render, screen } from "@testing-library/react";
import { Stepper } from "./Stepper";

describe("Stepper", () => {
    const steps = [
        { label: "Cadastro de ocorrência" },
        { label: "Formulário patrimonial" },
        { label: "Fase 03" },
        { label: "Anexos" },
    ];

    it("deve renderizar todos os labels dos passos", () => {
        render(<Stepper steps={steps} currentStep={1} />);
        steps.forEach((step) => {
            expect(screen.getByText(step.label)).toBeInTheDocument();
        });
    });

    it("deve aplicar a cor correta para o passo ativo, concluído e pendente", () => {
        render(<Stepper steps={steps} currentStep={2} />);

        const step1Label = screen.getByText("Cadastro de ocorrência");
        const step2Label = screen.getByText("Formulário patrimonial");
        const step3Label = screen.getByText("Fase 03");

        expect(step1Label).toHaveClass("text-[#42474a]");

        expect(step2Label).toHaveClass("text-[#42474a]");

        expect(step3Label).toHaveClass("text-[#dadada]");
    });

    it("não deve exibir números dentro dos passos", () => {
        render(<Stepper steps={steps} currentStep={1} />);
        expect(screen.queryByText("1")).not.toBeInTheDocument();
        expect(screen.queryByText("2")).not.toBeInTheDocument();
        expect(screen.queryByText("3")).not.toBeInTheDocument();
        expect(screen.queryByText("4")).not.toBeInTheDocument();
    });

    it("deve renderizar o ícone de check apenas para os passos concluídos", () => {
        render(<Stepper steps={steps} currentStep={3} />);
        const checkIcons = screen.getAllByTestId("check-icon");
        expect(checkIcons).toHaveLength(2);
    });

    it("não deve renderizar nenhum ícone de check se nenhum passo estiver concluído", () => {
        render(<Stepper steps={steps} currentStep={1} />);
        expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
    });
});
