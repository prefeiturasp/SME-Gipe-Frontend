import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import StepRenderer from "./StepRenderer";

vi.mock("./SecaoInicial", () => ({
    default: vi.fn(({ onSuccess }) => (
        <div>
            <span>Mock SecaoInicial</span>
            <button onClick={onSuccess}>Próximo</button>
        </div>
    )),
}));

vi.mock("./SecaoFurtoERoubo", () => ({
    default: vi.fn(({ onNext, onPrevious }) => (
        <div>
            <span>Mock SecaoFurtoERoubo</span>
            <button onClick={onNext}>Próximo</button>
            <button onClick={onPrevious}>Anterior</button>
        </div>
    )),
}));

vi.mock("./SecaoNaoFurtoERoubo", () => ({
    default: vi.fn(({ onNext, onPrevious }) => (
        <div>
            <span>Mock SecaoNaoFurtoERoubo</span>
            <button onClick={onNext}>Próximo</button>
            <button onClick={onPrevious}>Anterior</button>
        </div>
    )),
}));

vi.mock("./SecaoFinal", () => ({
    default: vi.fn(({ onNext, onPrevious }) => (
        <div>
            <span>Mock SecaoFinal</span>
            <button onClick={onNext}>Próximo</button>
            <button onClick={onPrevious}>Anterior</button>
        </div>
    )),
}));

vi.mock("./InformacoesAdicionais", () => ({
    default: vi.fn(({ onNext, onPrevious }) => (
        <div>
            <span>Mock InformacoesAdicionais</span>
            <button onClick={onNext}>Próximo</button>
            <button onClick={onPrevious}>Anterior</button>
        </div>
    )),
}));

vi.mock("./Anexos", () => ({
    default: vi.fn(({ onNext, onPrevious }) => (
        <div>
            <span>Mock Anexos</span>
            <button onClick={onNext}>Finalizar</button>
            <button onClick={onPrevious}>Anterior</button>
        </div>
    )),
}));

describe("StepRenderer", () => {
    const mockOnNext = vi.fn();
    const mockOnPrevious = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getCurrentStepNumber - Step 1", () => {
        it("deve retornar 1 quando currentStep é 1", () => {
            render(
                <StepRenderer
                    currentStep={1}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(screen.getByText("Mock SecaoInicial")).toBeInTheDocument();
        });
    });

    describe("getCurrentStepNumber - Step 2", () => {
        it("deve retornar 2 quando currentStep é 2", () => {
            render(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={true}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(
                screen.getByText("Mock SecaoFurtoERoubo")
            ).toBeInTheDocument();
        });
    });

    describe("getCurrentStepNumber - Step 3", () => {
        it("deve retornar 3 quando currentStep é 3 e hasAgressorVitimaInfo é true", () => {
            render(
                <StepRenderer
                    currentStep={3}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(
                screen.getByText("Mock InformacoesAdicionais")
            ).toBeInTheDocument();
        });

        it("deve retornar 4 quando currentStep é 3 e hasAgressorVitimaInfo é false", () => {
            render(
                <StepRenderer
                    currentStep={3}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
        });
    });

    describe("getCurrentStepNumber - Step 4", () => {
        it("deve retornar 4 quando currentStep é 4 e hasAgressorVitimaInfo é true", () => {
            render(
                <StepRenderer
                    currentStep={4}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
        });

        it("deve retornar 5 quando currentStep é 4 e hasAgressorVitimaInfo é false", () => {
            render(
                <StepRenderer
                    currentStep={4}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(screen.getByText("Mock Anexos")).toBeInTheDocument();
        });
    });

    describe("getCurrentStepNumber - Step 5", () => {
        it("deve retornar 5 quando currentStep é 5", () => {
            render(
                <StepRenderer
                    currentStep={5}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(screen.getByText("Mock Anexos")).toBeInTheDocument();
        });
    });

    describe("getCurrentStepNumber - Default case", () => {
        it("deve retornar currentStep quando não corresponde a nenhum caso específico", () => {
            render(
                <StepRenderer
                    currentStep={99}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(
                screen.queryByText("Mock SecaoInicial")
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Mock SecaoFurtoERoubo")
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Mock SecaoNaoFurtoERoubo")
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Mock InformacoesAdicionais")
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Mock SecaoFinal")
            ).not.toBeInTheDocument();
            expect(screen.queryByText("Mock Anexos")).not.toBeInTheDocument();
        });
    });

    describe("Renderização condicional - isFurtoRoubo", () => {
        it("deve renderizar SecaoFurtoERoubo quando isFurtoRoubo é true no step 2", () => {
            render(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={true}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(
                screen.getByText("Mock SecaoFurtoERoubo")
            ).toBeInTheDocument();
            expect(
                screen.queryByText("Mock SecaoNaoFurtoERoubo")
            ).not.toBeInTheDocument();
        });

        it("deve renderizar SecaoNaoFurtoERoubo quando isFurtoRoubo é false no step 2", () => {
            render(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(
                screen.getByText("Mock SecaoNaoFurtoERoubo")
            ).toBeInTheDocument();
            expect(
                screen.queryByText("Mock SecaoFurtoERoubo")
            ).not.toBeInTheDocument();
        });
    });

    describe("Renderização condicional - hasAgressorVitimaInfo", () => {
        it("deve renderizar InformacoesAdicionais quando hasAgressorVitimaInfo é true no step 3", () => {
            render(
                <StepRenderer
                    currentStep={3}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(
                screen.getByText("Mock InformacoesAdicionais")
            ).toBeInTheDocument();
            expect(
                screen.queryByText("Mock SecaoFinal")
            ).not.toBeInTheDocument();
        });

        it("não deve renderizar InformacoesAdicionais quando hasAgressorVitimaInfo é false no step 3", () => {
            render(
                <StepRenderer
                    currentStep={3}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
            expect(
                screen.queryByText("Mock InformacoesAdicionais")
            ).not.toBeInTheDocument();
        });
    });

    describe("Callbacks onNext e onPrevious", () => {
        it("deve chamar onNext quando clicar em Próximo na SecaoInicial", () => {
            render(
                <StepRenderer
                    currentStep={1}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

            expect(mockOnNext).toHaveBeenCalledTimes(1);
        });

        it("deve chamar onNext quando clicar em Próximo na SecaoFurtoERoubo", () => {
            render(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={true}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

            expect(mockOnNext).toHaveBeenCalledTimes(1);
        });

        it("deve chamar onPrevious quando clicar em Anterior na SecaoFurtoERoubo", () => {
            render(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={true}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

            expect(mockOnPrevious).toHaveBeenCalledTimes(1);
        });

        it("deve executar console.log quando clicar em Finalizar nos Anexos", () => {
            const consoleSpy = vi
                .spyOn(console, "log")
                .mockImplementation(() => {});

            render(
                <StepRenderer
                    currentStep={5}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            fireEvent.click(screen.getByRole("button", { name: "Finalizar" }));

            expect(consoleSpy).toHaveBeenCalledWith("Ocorrência finalizada!");

            consoleSpy.mockRestore();
        });

        it("deve chamar onPrevious quando clicar em Anterior nos Anexos", () => {
            render(
                <StepRenderer
                    currentStep={5}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

            expect(mockOnPrevious).toHaveBeenCalledTimes(1);
        });
    });

    describe("Retorno null quando stepConfig não encontrado", () => {
        it("deve retornar null quando nenhum stepConfig corresponde", () => {
            const { container } = render(
                <StepRenderer
                    currentStep={999}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(container.textContent).toBe("");
        });
    });

    describe("Todos os steps em sequência", () => {
        it("deve renderizar todos os steps corretamente em sequência (sem InformacoesAdicionais)", () => {
            const { rerender } = render(
                <StepRenderer
                    currentStep={1}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(screen.getByText("Mock SecaoInicial")).toBeInTheDocument();

            rerender(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );
            expect(
                screen.getByText("Mock SecaoNaoFurtoERoubo")
            ).toBeInTheDocument();

            rerender(
                <StepRenderer
                    currentStep={3}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );
            expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();

            rerender(
                <StepRenderer
                    currentStep={4}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );
            expect(screen.getByText("Mock Anexos")).toBeInTheDocument();
        });

        it("deve renderizar todos os steps corretamente em sequência (com InformacoesAdicionais)", () => {
            const { rerender } = render(
                <StepRenderer
                    currentStep={1}
                    isFurtoRoubo={true}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );

            expect(screen.getByText("Mock SecaoInicial")).toBeInTheDocument();

            rerender(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={true}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );
            expect(
                screen.getByText("Mock SecaoFurtoERoubo")
            ).toBeInTheDocument();

            rerender(
                <StepRenderer
                    currentStep={3}
                    isFurtoRoubo={true}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );
            expect(
                screen.getByText("Mock InformacoesAdicionais")
            ).toBeInTheDocument();

            rerender(
                <StepRenderer
                    currentStep={4}
                    isFurtoRoubo={true}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );
            expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();

            rerender(
                <StepRenderer
                    currentStep={5}
                    isFurtoRoubo={true}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />
            );
            expect(screen.getByText("Mock Anexos")).toBeInTheDocument();
        });
    });
});
