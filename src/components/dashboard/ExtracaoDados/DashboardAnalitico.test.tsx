import type { AnalyticsResponse } from "@/actions/analytics";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DashboardAnalitico from "./DashboardAnalitico";

vi.mock("./GraficoDRE", () => ({
    default: ({
        isLoading,
        activeDres,
    }: {
        isLoading?: boolean;
        activeDres?: string[];
    }) => (
        <div
            data-testid="grafico-dre"
            data-loading={String(isLoading)}
            data-active-dres={JSON.stringify(activeDres)}
        />
    ),
}));
vi.mock("./GraficoStatusUE", () => ({
    default: ({ isLoading }: { isLoading?: boolean }) => (
        <div data-testid="grafico-status-ue" data-loading={String(isLoading)} />
    ),
}));
vi.mock("./GraficoEvolucaoMensal", () => ({
    default: ({
        isLoading,
        activeMeses,
    }: {
        isLoading?: boolean;
        activeMeses?: string[];
    }) => (
        <div
            data-testid="grafico-evolucao-mensal"
            data-loading={String(isLoading)}
            data-active-meses={JSON.stringify(activeMeses)}
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

    describe("com analyticsData preenchido", () => {
        const mockAnalytics: AnalyticsResponse = {
            intercorrencias_dre: [
                {
                    codigo_eol: "108500",
                    total: 10,
                    patrimonial: 6,
                    interpessoal: 4,
                },
            ],
            intercorrencias_status: [
                {
                    status: "Em andamento",
                    total: 5,
                    patrimonial: 3,
                    interpessoal: 2,
                },
            ],
            evolucao_mensal: [
                {
                    mes: 3,
                    total: 18,
                    patrimonial: 10,
                    interpessoal: 8,
                },
            ],
            intercorrencias_tipos: {
                patrimonial: { "Dano material": 4 },
                interpessoal: { "Agressão física": 6 },
            },
            total_por_motivo: { Bullying: 6 },
            cards: [
                { total_intercorrencia: 42 },
                { intercorrencias_patrimoniais: 18 },
                { intercorrencias_interpessoais: 24 },
                { media_mensal: 7 },
            ],
        };

        it("deve exibir os valores dos cards a partir do analyticsData", () => {
            render(<DashboardAnalitico analyticsData={mockAnalytics} />);
            expect(screen.getByText("42")).toBeInTheDocument();
            expect(screen.getByText("18")).toBeInTheDocument();
            expect(screen.getByText("24")).toBeInTheDocument();
            expect(screen.getByText("7")).toBeInTheDocument();
        });

        it("deve exibir 0 quando a chave do card não existe no array", () => {
            const analyticsComCardsParciais: AnalyticsResponse = {
                ...mockAnalytics,
                cards: [{ total_intercorrencia: 10 }],
            };
            render(
                <DashboardAnalitico
                    analyticsData={analyticsComCardsParciais}
                />,
            );
            expect(screen.getByText("10")).toBeInTheDocument();
            const zeros = screen.getAllByText("0");
            expect(zeros.length).toBeGreaterThanOrEqual(3);
        });

        it("deve repassar activeDres e activeMeses quando filterState é fornecido", () => {
            render(
                <DashboardAnalitico
                    analyticsData={mockAnalytics}
                    filterState={{
                        ano: "2025",
                        meses: ["03"],
                        bimestre: [],
                        dres: ["108500"],
                        ues: [],
                        genero: "",
                        etapas: [],
                        idade: "",
                        menosDeUmAno: false,
                    }}
                />,
            );
            expect(screen.getByTestId("grafico-dre")).toHaveAttribute(
                "data-active-dres",
                JSON.stringify(["108500"]),
            );
            expect(
                screen.getByTestId("grafico-evolucao-mensal"),
            ).toHaveAttribute("data-active-meses", JSON.stringify(["03"]));
        });
    });
});
