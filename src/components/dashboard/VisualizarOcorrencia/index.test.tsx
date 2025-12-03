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
    default: vi.fn(({ onPrevious, onNext }) => {
        mockOnPrevious = onPrevious;
        mockOnNext = onNext;
        return (
            <div data-testid="formulario-dre">
                <h1>
                    Detalhes da Intercorrência - Diretoria Regional de Educação
                    (DRE)
                </h1>
                <button onClick={onPrevious}>Anterior</button>
                <button onClick={onNext}>Próximo</button>
            </div>
        );
    }),
}));

vi.mock("../FormularioGipe/DetalhamentoGipe", () => ({
    DetalhamentoGipe: vi.fn(({ onPrevious }) => {
        mockOnPrevious = onPrevious;
        return (
            <div data-testid="formulario-gipe">
                <h1>Detalhamento GIPE</h1>
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

    it("deve navegar para FormularioGipe quando onNext for chamado no FormularioDre", async () => {
        const user = userEvent.setup();
        renderWithClient(<VisualizarOcorrencia />);

        // Navega para FormularioDre
        await user.click(screen.getByText("Próximo"));
        expect(screen.getByTestId("formulario-dre")).toBeInTheDocument();

        // Navega para FormularioGipe
        const botoesProximo = screen.getAllByText("Próximo");
        await user.click(botoesProximo[0]);

        expect(screen.queryByTestId("formulario-dre")).not.toBeInTheDocument();
        expect(screen.getByTestId("formulario-gipe")).toBeInTheDocument();
        expect(screen.getByText("Detalhamento GIPE")).toBeInTheDocument();
    });

    it("deve voltar para FormularioDre quando onPrevious for chamado no FormularioGipe", async () => {
        const user = userEvent.setup();
        renderWithClient(<VisualizarOcorrencia />);

        // Navega até FormularioGipe
        await user.click(screen.getByText("Próximo"));
        const botoesProximo = screen.getAllByText("Próximo");
        await user.click(botoesProximo[0]);

        expect(screen.getByTestId("formulario-gipe")).toBeInTheDocument();

        // Volta para FormularioDre
        const botaoAnterior = screen.getByText("Anterior");
        await user.click(botaoAnterior);

        expect(screen.getByTestId("formulario-dre")).toBeInTheDocument();
        expect(screen.queryByTestId("formulario-gipe")).not.toBeInTheDocument();
    });

    it("deve passar a função onNext para FormularioDre", async () => {
        const user = userEvent.setup();
        renderWithClient(<VisualizarOcorrencia />);

        await user.click(screen.getByText("Próximo"));

        expect(mockOnNext).toBeDefined();
        expect(typeof mockOnNext).toBe("function");
    });

    it("deve passar a função onPrevious para FormularioGipe", async () => {
        const user = userEvent.setup();
        renderWithClient(<VisualizarOcorrencia />);

        // Navega até FormularioGipe
        await user.click(screen.getByText("Próximo"));
        const botoesProximo = screen.getAllByText("Próximo");
        await user.click(botoesProximo[0]);

        expect(mockOnPrevious).toBeDefined();
        expect(typeof mockOnPrevious).toBe("function");
    });

    it("deve manter o fluxo completo de navegação UE -> DRE -> GIPE -> DRE -> UE", async () => {
        const user = userEvent.setup();
        renderWithClient(<VisualizarOcorrencia />);

        // Inicia em UE
        expect(screen.getByTestId("formulario-ue")).toBeInTheDocument();

        // UE -> DRE
        await user.click(screen.getByText("Próximo"));
        expect(screen.getByTestId("formulario-dre")).toBeInTheDocument();

        // DRE -> GIPE
        const botoesProximo = screen.getAllByText("Próximo");
        await user.click(botoesProximo[0]);
        expect(screen.getByTestId("formulario-gipe")).toBeInTheDocument();

        // GIPE -> DRE
        await user.click(screen.getByText("Anterior"));
        expect(screen.getByTestId("formulario-dre")).toBeInTheDocument();

        // DRE -> UE
        await user.click(screen.getByText("Anterior"));
        expect(screen.getByTestId("formulario-ue")).toBeInTheDocument();
    });
});
