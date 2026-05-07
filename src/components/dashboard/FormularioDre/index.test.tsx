import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DetalhamentoDre } from "./DetalhamentoDre";
import FormularioDrePage from "./index";

const mockReset = vi.fn();
const mockInvalidateQueries = vi.fn();
const mockRouterBack = vi.fn();
const mockOnPrevious = vi.fn();
const mockOnNext = vi.fn();

vi.mock("@/stores/useOcorrenciaFormStore", () => ({
    useOcorrenciaFormStore: vi.fn((selector) => {
        const state = {
            reset: mockReset,
            ocorrenciaUuid: "test-uuid-123",
        };
        return selector ? selector(state) : state;
    }),
}));

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual<
        typeof import("@tanstack/react-query")
    >("@tanstack/react-query");

    return {
        ...actual,
        useQueryClient: vi.fn(() => ({
            invalidateQueries: mockInvalidateQueries,
        })),
    };
});

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: mockRouterBack,
        push: vi.fn(),
    }),
}));

vi.mock("../PageHeader/PageHeader", () => ({
    default: vi.fn(({ title, onClickBack }) => (
        <div>
            <h1>{title}</h1>
            <button onClick={onClickBack}>Voltar</button>
        </div>
    )),
}));

vi.mock("./DetalhamentoDre", () => ({
    DetalhamentoDre: vi.fn(({ onPrevious }) => (
        <div data-testid="mock-detalhamento-dre">
            Mock DetalhamentoDre
            {onPrevious && (
                <button onClick={onPrevious}>Anterior (Mock)</button>
            )}
        </div>
    )),
}));

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );
};

describe("FormularioDrePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve renderizar o título correto do PageHeader", () => {
        renderWithClient(
            <FormularioDrePage
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
        );

        expect(
            screen.getByText(
                "Detalhes da Intercorrência - Diretoria Regional de Educação (DRE)",
            ),
        ).toBeInTheDocument();
    });

    it("deve renderizar o componente DetalhamentoDre", () => {
        renderWithClient(
            <FormularioDrePage
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
        );

        expect(screen.getByTestId("mock-detalhamento-dre")).toBeInTheDocument();
    });

    it("deve passar onPrevious para DetalhamentoDre", () => {
        renderWithClient(
            <FormularioDrePage
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
        );

        const botaoAnterior = screen.getByText("Anterior (Mock)");
        botaoAnterior.click();

        expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    });

    it("deve chamar reset e invalidateQueries ao clicar em Voltar", async () => {
        renderWithClient(
            <FormularioDrePage
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
        );

        const botaoVoltar = screen.getByText("Voltar");
        botaoVoltar.click();

        expect(mockReset).toHaveBeenCalledTimes(1);

        await vi.waitFor(() => {
            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ["ocorrencia", "test-uuid-123"],
            });
        });
    });

    it("deve usar o ocorrenciaUuid correto na invalidação de queries", async () => {
        renderWithClient(
            <FormularioDrePage
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
        );

        const botaoVoltar = screen.getByText("Voltar");
        botaoVoltar.click();

        await vi.waitFor(() => {
            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ["ocorrencia", "test-uuid-123"],
            });
        });
    });

    it("deve renderizar o botão Voltar do PageHeader", () => {
        renderWithClient(
            <FormularioDrePage
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
        );

        const botaoVoltar = screen.getByRole("button", { name: /voltar/i });
        expect(botaoVoltar).toBeInTheDocument();
    });

    describe("numeração de perguntas", () => {
        it("deve passar startingQuestionNumber para DetalhamentoDre", () => {
            renderWithClient(
                <FormularioDrePage
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                    startingQuestionNumber={12}
                />,
            );

            expect(vi.mocked(DetalhamentoDre)).toHaveBeenCalledWith(
                expect.objectContaining({ startingQuestionNumber: 12 }),
                expect.anything(),
            );
        });
    });
});
