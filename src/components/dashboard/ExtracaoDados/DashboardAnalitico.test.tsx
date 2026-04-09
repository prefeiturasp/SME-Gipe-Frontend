import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DashboardAnalitico from "./DashboardAnalitico";

vi.mock("./GraficoDRE", () => ({
    default: ({ isLoading }: { isLoading?: boolean }) => (
        <div data-testid="grafico-dre" data-loading={String(isLoading)} />
    ),
}));
vi.mock("./GraficoStatusUE", () => ({
    default: ({ isLoading }: { isLoading?: boolean }) => (
        <div data-testid="grafico-status-ue" data-loading={String(isLoading)} />
    ),
}));
vi.mock("./GraficoEvolucaoMensal", () => ({
    default: ({ isLoading }: { isLoading?: boolean }) => (
        <div
            data-testid="grafico-evolucao-mensal"
            data-loading={String(isLoading)}
        />
    ),
}));
vi.mock("./GraficoTipoIntercorrencias", () => ({
    default: ({ isLoading }: { isLoading?: boolean }) => (
        <div
            data-testid="grafico-tipo-intercorrencias"
            data-loading={String(isLoading)}
        />
    ),
}));

describe("DashboardAnalitico", () => {
    describe("estado padrão (sem isLoading)", () => {
        it("deve renderizar o título do dashboard", () => {
            render(<DashboardAnalitico />);
            expect(
                screen.getByText("Dashboard analítico de intercorrências"),
            ).toBeInTheDocument();
        });

        it("deve renderizar os 4 cards de resumo com dados", () => {
            render(<DashboardAnalitico />);
            expect(
                screen.getByText("Total de intercorrências:"),
            ).toBeInTheDocument();
            expect(
                screen.getByText("Intercorrências patrimoniais:"),
            ).toBeInTheDocument();
            expect(
                screen.getByText("Intercorrências interpessoais:"),
            ).toBeInTheDocument();
            expect(
                screen.getByText("Média de registros por mês:"),
            ).toBeInTheDocument();
        });

        it("deve renderizar os componentes de gráfico", () => {
            render(<DashboardAnalitico />);
            expect(screen.getByTestId("grafico-dre")).toBeInTheDocument();
            expect(screen.getByTestId("grafico-status-ue")).toBeInTheDocument();
            expect(
                screen.getByTestId("grafico-evolucao-mensal"),
            ).toBeInTheDocument();
            expect(
                screen.getByTestId("grafico-tipo-intercorrencias"),
            ).toBeInTheDocument();
        });

        it("deve repassar isLoading={false} para os gráficos filhos", () => {
            render(<DashboardAnalitico />);
            expect(screen.getByTestId("grafico-dre")).toHaveAttribute(
                "data-loading",
                "false",
            );
            expect(screen.getByTestId("grafico-status-ue")).toHaveAttribute(
                "data-loading",
                "false",
            );
            expect(
                screen.getByTestId("grafico-evolucao-mensal"),
            ).toHaveAttribute("data-loading", "false");
            expect(
                screen.getByTestId("grafico-tipo-intercorrencias"),
            ).toHaveAttribute("data-loading", "false");
        });
    });

    describe("estado de carregamento (isLoading={true})", () => {
        it("não deve exibir os labels dos cards de resumo", () => {
            render(<DashboardAnalitico isLoading />);
            expect(
                screen.queryByText("Total de intercorrências:"),
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Intercorrências patrimoniais:"),
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Intercorrências interpessoais:"),
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Média de registros por mês:"),
            ).not.toBeInTheDocument();
        });

        it("deve repassar isLoading={true} para os gráficos filhos", () => {
            render(<DashboardAnalitico isLoading />);
            expect(screen.getByTestId("grafico-dre")).toHaveAttribute(
                "data-loading",
                "true",
            );
            expect(screen.getByTestId("grafico-status-ue")).toHaveAttribute(
                "data-loading",
                "true",
            );
            expect(
                screen.getByTestId("grafico-evolucao-mensal"),
            ).toHaveAttribute("data-loading", "true");
            expect(
                screen.getByTestId("grafico-tipo-intercorrencias"),
            ).toHaveAttribute("data-loading", "true");
        });

        it("deve manter o título do dashboard visível durante o carregamento", () => {
            render(<DashboardAnalitico isLoading />);
            expect(
                screen.getByText("Dashboard analítico de intercorrências"),
            ).toBeInTheDocument();
        });
    });
});
