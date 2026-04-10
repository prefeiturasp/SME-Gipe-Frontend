import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ExtracaoDadosPage from "./page";

vi.mock(
    "@/components/dashboard/ExtracaoDados/FilterPanel",
    async (importOriginal) => {
        const actual =
            await importOriginal<
                typeof import("@/components/dashboard/ExtracaoDados/FilterPanel")
            >();
        return {
            ...actual,
            default: () => <div data-testid="filter-panel">FilterPanel</div>,
        };
    },
);

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
});
