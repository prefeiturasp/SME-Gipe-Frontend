import type { FilterState } from "@/components/dashboard/ExtracaoDados/FilterPanel";
import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ExtracaoDadosPage from "./page";

// Controla se useRef deve retornar refs com current=null (Proxy que ignora writes do React)
const useRefOverride = vi.hoisted(() => ({ active: false }));

vi.mock("react", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react")>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalUseRef = actual.useRef as (...args: any[]) => any;
    return {
        ...actual,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        useRef: (...args: any[]) => {
            if (useRefOverride.active) {
                // Proxy que ignora ref.current = domNode do React, mantendo current null
                return new Proxy({ current: null } as { current: null }, {
                    set() {
                        return true;
                    },
                });
            }
            return originalUseRef(...args);
        },
    };
});

let capturedOnStateChange: ((state: FilterState) => void) | undefined;

vi.mock(
    "@/components/dashboard/ExtracaoDados/FilterPanel",
    async (importOriginal) => {
        const actual =
            await importOriginal<
                typeof import("@/components/dashboard/ExtracaoDados/FilterPanel")
            >();
        return {
            ...actual,
            default: ({
                onStateChange,
            }: {
                onStateChange?: (state: FilterState) => void;
            }) => {
                capturedOnStateChange = onStateChange;
                return <div data-testid="filter-panel">FilterPanel</div>;
            },
        };
    },
);

const mockToPng = vi.fn().mockResolvedValue("data:image/png;base64,fake");
vi.mock("html-to-image", () => ({
    toPng: (...args: unknown[]) => mockToPng(...args),
}));

const mockToBlob = vi.fn().mockResolvedValue(new Blob(["pdf"]));
vi.mock("@react-pdf/renderer", () => ({
    pdf: vi.fn(() => ({ toBlob: mockToBlob })),
}));

afterEach(() => {
    capturedOnStateChange = undefined;
    useRefOverride.active = false;
    mockToPng.mockResolvedValue("data:image/png;base64,fake");
    mockToBlob.mockResolvedValue(new Blob(["pdf"]));
    mockUseAnalytics.mockReturnValue({ data: undefined, isLoading: false });
});

vi.mock("@/components/dashboard/ExtracaoDados/GraficoDRE", () => ({
    default: () => <div data-testid="grafico-dre" />,
}));

vi.mock("@/components/dashboard/ExtracaoDados/GraficoStatusUE", () => ({
    default: () => <div data-testid="grafico-status-ue" />,
}));

vi.mock("@/components/dashboard/ExtracaoDados/GraficoEvolucaoMensal", () => ({
    default: () => <div data-testid="grafico-evolucao-mensal" />,
}));

vi.mock(
    "@/components/dashboard/ExtracaoDados/GraficoTipoIntercorrencias",
    () => ({
        GraficoColunasVertical: () => (
            <div data-testid="grafico-colunas-vertical" />
        ),
        GraficoMotivacoes: () => <div data-testid="grafico-motivacoes" />,
    }),
);

vi.mock("@/components/dashboard/ExtracaoDados/DashboardAnalitico", () => ({
    default: () => <div data-testid="dashboard-analitico" />,
}));

vi.mock("@/components/dashboard/ExtracaoDados/ExportacaoPDF", () => ({
    default: () => null,
}));

const mockUseAnalytics = vi.fn().mockReturnValue({
    data: undefined,
    isLoading: false,
});
vi.mock("@/hooks/useAnalytics", () => ({
    useAnalytics: (...args: unknown[]) => mockUseAnalytics(...args),
}));

vi.mock("@/assets/icons/Export", () => ({
    default: () => <svg data-testid="export-icon" />,
}));

describe("ExtracaoDadosPage", () => {
    it("deve renderizar o título da página", () => {
        render(<ExtracaoDadosPage />);
        expect(screen.getByText("Extração de dados")).toBeInTheDocument();
    });

    it("deve renderizar o subtítulo da página", () => {
        render(<ExtracaoDadosPage />);
        expect(
            screen.getByText(/confira todas as intercorrências/i),
        ).toBeInTheDocument();
    });

    it("deve renderizar o botão Exportar dados", () => {
        render(<ExtracaoDadosPage />);
        expect(
            screen.getByRole("button", { name: /exportar dados/i }),
        ).toBeInTheDocument();
    });

    it("deve renderizar o FilterPanel", () => {
        render(<ExtracaoDadosPage />);
        expect(screen.getByTestId("filter-panel")).toBeInTheDocument();
    });

    it("deve retornar cedo sem chamar toPng quando os refs são nulos", () => {
        useRefOverride.active = true;
        render(<ExtracaoDadosPage />);
        fireEvent.click(
            screen.getByRole("button", { name: /exportar dados/i }),
        );
        expect(mockToPng).not.toHaveBeenCalled();
    });

    it("deve atualizar o estado dos filtros ao receber callback do FilterPanel", () => {
        render(<ExtracaoDadosPage />);
        expect(capturedOnStateChange).toBeDefined();
        act(() => {
            capturedOnStateChange?.({
                ano: "2024",
                meses: [],
                bimestre: [],
                dres: [],
                ues: [],
                genero: "masculino",
                etapas: [],
                idade: "",
                menosDeUmAno: false,
            });
        });
        // callback executado sem erros
    });

    it("deve exportar e fazer download do PDF ao clicar no botão", async () => {
        const mockAnchorClick = vi.fn();
        vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
            mockAnchorClick,
        );
        global.URL.createObjectURL = vi.fn().mockReturnValue("blob:fake-url");
        global.URL.revokeObjectURL = vi.fn();

        render(<ExtracaoDadosPage />);
        fireEvent.click(
            screen.getByRole("button", { name: /exportar dados/i }),
        );

        await waitFor(() => {
            expect(mockToPng).toHaveBeenCalledTimes(6);
        });
        await waitFor(() => {
            expect(mockAnchorClick).toHaveBeenCalled();
        });
        expect(global.URL.createObjectURL).toHaveBeenCalled();
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(
            "blob:fake-url",
        );

        vi.restoreAllMocks();
    });

    it("deve exibir 'Gerando PDF...' durante a exportação", async () => {
        let resolveToPng!: (value: string) => void;
        const pendingPromise = new Promise<string>((resolve) => {
            resolveToPng = resolve;
        });
        mockToPng.mockReturnValue(pendingPromise);

        render(<ExtracaoDadosPage />);
        fireEvent.click(
            screen.getByRole("button", { name: /exportar dados/i }),
        );

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: /gerando pdf\.\.\./i }),
            ).toBeInTheDocument();
        });

        resolveToPng("data:image/png;base64,fake");

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: /exportar dados/i }),
            ).toBeInTheDocument();
        });
    });

    it("deve extrair valores dos cards ao exportar quando analyticsData possui cards", async () => {
        mockUseAnalytics.mockReturnValue({
            data: {
                cards: [
                    { total_intercorrencia: 10 },
                    { intercorrencias_patrimoniais: 4 },
                    { intercorrencias_interpessoais: 6 },
                    { media_mensal: 2 },
                ],
                intercorrencias_dre: [],
                intercorrencias_status: [],
                evolucao_mensal: [],
                intercorrencias_tipos: { patrimonial: {}, interpessoal: {} },
                total_por_motivo: {},
            },
            isLoading: false,
        });

        const mockAnchorClick = vi.fn();
        vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
            mockAnchorClick,
        );
        global.URL.createObjectURL = vi.fn().mockReturnValue("blob:fake-url");
        global.URL.revokeObjectURL = vi.fn();

        render(<ExtracaoDadosPage />);
        fireEvent.click(
            screen.getByRole("button", { name: /exportar dados/i }),
        );

        await waitFor(() => {
            expect(mockAnchorClick).toHaveBeenCalled();
        });

        vi.restoreAllMocks();
    });

    it("deve retornar 0 quando cards existe mas não contém a chave buscada", async () => {
        mockUseAnalytics.mockReturnValue({
            data: {
                cards: [],
                intercorrencias_dre: [],
                intercorrencias_status: [],
                evolucao_mensal: [],
                intercorrencias_tipos: { patrimonial: {}, interpessoal: {} },
                total_por_motivo: {},
            },
            isLoading: false,
        });

        const mockAnchorClick = vi.fn();
        vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
            mockAnchorClick,
        );
        global.URL.createObjectURL = vi.fn().mockReturnValue("blob:fake-url");
        global.URL.revokeObjectURL = vi.fn();

        render(<ExtracaoDadosPage />);
        fireEvent.click(
            screen.getByRole("button", { name: /exportar dados/i }),
        );

        await waitFor(() => {
            expect(mockAnchorClick).toHaveBeenCalled();
        });

        vi.restoreAllMocks();
    });
});
