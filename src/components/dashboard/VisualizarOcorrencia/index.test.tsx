import { screen, cleanup } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderWithClient } from "../CadastrarOcorrencia/__tests__/helpers";
import VisualizarOcorrencia from "./index";
import userEvent from "@testing-library/user-event";

let mockOnNext: (() => void) | undefined;
let mockOnPrevious: (() => void) | undefined;

vi.mock("../FormularioUE/FormularioUE", () => ({
    FormularioUE: vi.fn(({ onNext }) => {
        mockOnNext = onNext;
        return (
            <div data-testid="formulario-ue">
                <h1>FormularioUE</h1>
                <button onClick={onNext}>Próximo</button>
            </div>
        );
    }),
}));

vi.mock("../FormularioDre", () => ({
    default: vi.fn(({ onPrevious }) => {
        mockOnPrevious = onPrevious;
        return (
            <div data-testid="formulario-dre">
                <h1>
                    Detalhes da Intercorrência - Diretoria Regional de Educação
                    (DRE)
                </h1>
                <button onClick={onPrevious}>Anterior</button>
            </div>
        );
    }),
}));

describe("VisualizarOcorrencia", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
        mockOnNext = undefined;
        mockOnPrevious = undefined;
    });

    it("deve renderizar o FormularioUE inicialmente", () => {
        renderWithClient(<VisualizarOcorrencia />);

        expect(screen.getByTestId("formulario-ue")).toBeInTheDocument();
        expect(screen.getByText("FormularioUE")).toBeInTheDocument();
        expect(screen.queryByTestId("formulario-dre")).not.toBeInTheDocument();
    });

    it("deve navegar para FormularioDre quando onNext for chamado", async () => {
        const user = userEvent.setup();
        renderWithClient(<VisualizarOcorrencia />);

        expect(screen.getByTestId("formulario-ue")).toBeInTheDocument();

        const botaoProximo = screen.getByText("Próximo");
        await user.click(botaoProximo);

        expect(screen.queryByTestId("formulario-ue")).not.toBeInTheDocument();
        expect(screen.getByTestId("formulario-dre")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Detalhes da Intercorrência - Diretoria Regional de Educação (DRE)"
            )
        ).toBeInTheDocument();
    });

    it("deve voltar para FormularioUE quando onPrevious for chamado", async () => {
        const user = userEvent.setup();
        renderWithClient(<VisualizarOcorrencia />);

        const botaoProximo = screen.getByText("Próximo");
        await user.click(botaoProximo);

        expect(screen.getByTestId("formulario-dre")).toBeInTheDocument();

        const botaoAnterior = screen.getByText("Anterior");
        await user.click(botaoAnterior);

        expect(screen.getByTestId("formulario-ue")).toBeInTheDocument();
        expect(screen.queryByTestId("formulario-dre")).not.toBeInTheDocument();
    });

    it("deve manter o estado correto após múltiplas navegações", async () => {
        const user = userEvent.setup();
        renderWithClient(<VisualizarOcorrencia />);

        await user.click(screen.getByText("Próximo"));
        expect(screen.getByTestId("formulario-dre")).toBeInTheDocument();

        await user.click(screen.getByText("Anterior"));
        expect(screen.getByTestId("formulario-ue")).toBeInTheDocument();

        await user.click(screen.getByText("Próximo"));
        expect(screen.getByTestId("formulario-dre")).toBeInTheDocument();
    });

    it("deve passar a função onNext para FormularioUE", () => {
        renderWithClient(<VisualizarOcorrencia />);

        expect(mockOnNext).toBeDefined();
        expect(typeof mockOnNext).toBe("function");
    });

    it("deve passar a função onPrevious para FormularioDre", async () => {
        const user = userEvent.setup();
        renderWithClient(<VisualizarOcorrencia />);

        await user.click(screen.getByText("Próximo"));

        expect(mockOnPrevious).toBeDefined();
        expect(typeof mockOnPrevious).toBe("function");
    });
});
