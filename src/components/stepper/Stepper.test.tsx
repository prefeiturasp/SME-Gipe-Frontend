import { render, screen } from "@testing-library/react";
import { Stepper } from "./Stepper";

describe("Stepper", () => {
    const steps = [
        { label: "Passo 1", description: "Descrição 1" },
        { label: "Passo 2", description: "Descrição 2" },
        { label: "Passo 3", description: "Descrição 3" },
    ];

    it("renderiza todos os passos", () => {
        render(<Stepper steps={steps} currentStep={1} />);
        steps.forEach((step) => {
            expect(screen.getByText(step.label)).toBeInTheDocument();
            expect(screen.getByText(step.description)).toBeInTheDocument();
        });
    });

    it("destaca apenas o passo atual", () => {
        render(<Stepper steps={steps} currentStep={2} />);

        const step1 = screen.getByText("Passo 1");
        const step2 = screen.getByText("Passo 2");
        const step3 = screen.getByText("Passo 3");

        // Passo 1 deve estar marcado como concluído (ícone Check)
        expect(screen.getByTestId("check-icon")).toBeInTheDocument();
        expect(step1).toHaveClass("text-[#6f777c]");

        // Passo 2 deve estar ativo
        expect(step2).toHaveClass("text-[#42474a]");

        // Passo 3 deve estar inativo
        expect(step3).toHaveClass("text-[#6f777c]");
    });

    it("exibe os números dos passos não concluídos", () => {
        render(<Stepper steps={steps} currentStep={1} />);

        // Deve mostrar o número 1 no primeiro passo
        expect(screen.getByText("1")).toBeInTheDocument();
        // Passos 2 e 3 ainda devem mostrar os números
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("renderiza o ícone de check para passos concluídos", () => {
        render(<Stepper steps={steps} currentStep={3} />);
        // Passo 1 e 2 concluídos devem ter o ícone
        const checkIcons = screen.getAllByTestId("check-icon");
        expect(checkIcons).toHaveLength(2);
    });
});
