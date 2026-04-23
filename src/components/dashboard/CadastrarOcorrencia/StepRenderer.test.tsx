import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Anexos from "./Anexos";
import SecaoFurtoERoubo from "./SecaoFurtoERoubo";
import SecaoInicial from "./SecaoInicial";
import SecaoNaoFurtoERoubo from "./SecaoNaoFurtoERoubo";
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

describe("StepRenderer - Renderização de Componentes", () => {
    const mockOnNext = vi.fn();
    const mockOnPrevious = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Step 1 - SecaoInicial", () => {
        it("deve renderizar SecaoInicial quando currentStep é 1", () => {
            render(
                <StepRenderer
                    currentStep={1}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(screen.getByText("Mock SecaoInicial")).toBeInTheDocument();
        });

        it("deve passar callback onSuccess para SecaoInicial", () => {
            render(
                <StepRenderer
                    currentStep={1}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

            expect(mockOnNext).toHaveBeenCalledTimes(1);
        });
    });

    describe("Step 2 - Renderização condicional baseada em isFurtoRoubo", () => {
        it("deve renderizar SecaoFurtoERoubo quando isFurtoRoubo é true", () => {
            render(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={true}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(
                screen.getByText("Mock SecaoFurtoERoubo"),
            ).toBeInTheDocument();
            expect(
                screen.queryByText("Mock SecaoNaoFurtoERoubo"),
            ).not.toBeInTheDocument();
        });

        it("deve renderizar SecaoNaoFurtoERoubo quando isFurtoRoubo é false", () => {
            render(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(
                screen.getByText("Mock SecaoNaoFurtoERoubo"),
            ).toBeInTheDocument();
            expect(
                screen.queryByText("Mock SecaoFurtoERoubo"),
            ).not.toBeInTheDocument();
        });

        it("deve passar callbacks onNext e onPrevious para SecaoFurtoERoubo", () => {
            render(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={true}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));
            expect(mockOnNext).toHaveBeenCalledTimes(1);

            fireEvent.click(screen.getByRole("button", { name: "Anterior" }));
            expect(mockOnPrevious).toHaveBeenCalledTimes(1);
        });

        it("deve passar callbacks onNext e onPrevious para SecaoNaoFurtoERoubo", () => {
            render(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));
            expect(mockOnNext).toHaveBeenCalledTimes(1);

            fireEvent.click(screen.getByRole("button", { name: "Anterior" }));
            expect(mockOnPrevious).toHaveBeenCalledTimes(1);
        });
    });

    describe("Step 3 - Renderização condicional baseada em hasAgressorVitimaInfo", () => {
        it("deve renderizar InformacoesAdicionais quando hasAgressorVitimaInfo é true", () => {
            render(
                <StepRenderer
                    currentStep={3}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(
                screen.getByText("Mock InformacoesAdicionais"),
            ).toBeInTheDocument();
            expect(
                screen.queryByText("Mock SecaoFinal"),
            ).not.toBeInTheDocument();
        });

        it("deve renderizar SecaoFinal quando hasAgressorVitimaInfo é false", () => {
            render(
                <StepRenderer
                    currentStep={3}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
            expect(
                screen.queryByText("Mock InformacoesAdicionais"),
            ).not.toBeInTheDocument();
        });

        it("deve passar callbacks onNext e onPrevious para InformacoesAdicionais", () => {
            render(
                <StepRenderer
                    currentStep={3}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));
            expect(mockOnNext).toHaveBeenCalledTimes(1);

            fireEvent.click(screen.getByRole("button", { name: "Anterior" }));
            expect(mockOnPrevious).toHaveBeenCalledTimes(1);
        });
    });

    describe("Step 4 - Renderização baseada em hasAgressorVitimaInfo", () => {
        it("deve renderizar SecaoFinal quando currentStep é 4 e hasAgressorVitimaInfo é true", () => {
            render(
                <StepRenderer
                    currentStep={4}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
        });

        it("deve renderizar Anexos quando currentStep é 4 e hasAgressorVitimaInfo é false", () => {
            render(
                <StepRenderer
                    currentStep={4}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(screen.getByText("Mock Anexos")).toBeInTheDocument();
        });

        it("deve passar callbacks onNext e onPrevious para SecaoFinal", () => {
            render(
                <StepRenderer
                    currentStep={4}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));
            expect(mockOnNext).toHaveBeenCalledTimes(1);

            fireEvent.click(screen.getByRole("button", { name: "Anterior" }));
            expect(mockOnPrevious).toHaveBeenCalledTimes(1);
        });
    });

    describe("Step 5 - Anexos", () => {
        it("deve renderizar Anexos quando currentStep é 5", () => {
            render(
                <StepRenderer
                    currentStep={5}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(screen.getByText("Mock Anexos")).toBeInTheDocument();
        });

        it("deve executar console.log ao clicar em Finalizar", () => {
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
                />,
            );

            fireEvent.click(screen.getByRole("button", { name: "Finalizar" }));

            expect(consoleSpy).toHaveBeenCalledWith("Ocorrência finalizada!");

            consoleSpy.mockRestore();
        });

        it("deve passar callback onPrevious para Anexos", () => {
            render(
                <StepRenderer
                    currentStep={5}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={true}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

            expect(mockOnPrevious).toHaveBeenCalledTimes(1);
        });
    });

    describe("Casos de borda", () => {
        it("deve retornar null quando currentStep não corresponde a nenhuma configuração válida", () => {
            const { container } = render(
                <StepRenderer
                    currentStep={99}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(container.textContent).toBe("");
        });
    });

    describe("startingQuestionNumber passado para componentes", () => {
        it("deve passar startingQuestionNumber=1 para SecaoInicial no step 1", () => {
            render(
                <StepRenderer
                    currentStep={1}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(vi.mocked(SecaoInicial)).toHaveBeenCalledWith(
                expect.objectContaining({ startingQuestionNumber: 1 }),
                expect.anything(),
            );
        });

        it("deve passar startingQuestionNumber=5 para SecaoNaoFurtoERoubo no step 2 (não furto/roubo)", () => {
            render(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(vi.mocked(SecaoNaoFurtoERoubo)).toHaveBeenCalledWith(
                expect.objectContaining({ startingQuestionNumber: 5 }),
                expect.anything(),
            );
        });

        it("deve passar startingQuestionNumber=5 para SecaoFurtoERoubo no step 2 (furto/roubo)", () => {
            render(
                <StepRenderer
                    currentStep={2}
                    isFurtoRoubo={true}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(vi.mocked(SecaoFurtoERoubo)).toHaveBeenCalledWith(
                expect.objectContaining({ startingQuestionNumber: 5 }),
                expect.anything(),
            );
        });

        it("deve passar startingQuestionNumber=12 para Anexos no step 5 (não furto/roubo, sem agressor, 1 pessoa)", () => {
            render(
                <StepRenderer
                    currentStep={5}
                    isFurtoRoubo={false}
                    hasAgressorVitimaInfo={false}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
            );

            expect(vi.mocked(Anexos)).toHaveBeenCalledWith(
                expect.objectContaining({ startingQuestionNumber: 12 }),
                expect.anything(),
            );
        });
    });
});
