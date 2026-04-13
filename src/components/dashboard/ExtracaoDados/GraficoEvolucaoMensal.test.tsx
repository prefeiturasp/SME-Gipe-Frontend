import { render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import GraficoEvolucaoMensal from "./GraficoEvolucaoMensal";

// Variáveis lidas pelas closures do mock no momento do render
let mockTooltipActive = true;
let mockTooltipLabel = "Mar";

vi.mock("recharts", () => ({
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: ({
        content,
    }: {
        content: React.ReactElement<{ active: boolean; label: string }>;
    }) => {
        if (!React.isValidElement(content)) return null;
        return React.cloneElement(
            content as React.ReactElement<{ active: boolean; label: string }>,
            { active: mockTooltipActive, label: mockTooltipLabel },
        );
    },
}));

afterEach(() => {
    mockTooltipActive = true;
    mockTooltipLabel = "Mar";
});

describe("GraficoEvolucaoMensal", () => {
    it("deve renderizar o título Evolução mensal", () => {
        render(<GraficoEvolucaoMensal />);
        expect(screen.getByText("Evolução mensal")).toBeInTheDocument();
    });

    it("deve exibir a descrição do gráfico", () => {
        render(<GraficoEvolucaoMensal />);
        expect(
            screen.getByText(
                "Confira a quantidade de registros realizados em cada mês.",
            ),
        ).toBeInTheDocument();
    });

    it("deve exibir os meses na grade de resumo", () => {
        render(<GraficoEvolucaoMensal />);
        expect(screen.getByText("Janeiro")).toBeInTheDocument();
        expect(screen.getByText("Fevereiro")).toBeInTheDocument();
        expect(screen.getByText("Abril:")).toBeInTheDocument();
    });

    it("deve exibir o tooltip com o nome do mês e ano", () => {
        render(<GraficoEvolucaoMensal />);
        expect(screen.getByText("Março/2025:")).toBeInTheDocument();
    });

    it("deve exibir o label de total de intercorrências no tooltip", () => {
        render(<GraficoEvolucaoMensal />);
        expect(
            screen.getByText("Total de intercorrências:"),
        ).toBeInTheDocument();
    });

    it("deve exibir os labels de patrimonial e interpessoal no tooltip", () => {
        render(<GraficoEvolucaoMensal />);
        expect(screen.getByText("Patrimoniais:")).toBeInTheDocument();
        expect(screen.getByText("Interpessoais:")).toBeInTheDocument();
    });

    it("deve retornar null do tooltip quando active é false", () => {
        mockTooltipActive = false;
        render(<GraficoEvolucaoMensal />);
        expect(screen.queryByText("Março/2025:")).not.toBeInTheDocument();
    });

    it("deve retornar null do tooltip quando o mês não existe nos dados", () => {
        mockTooltipLabel = "Xyz";
        render(<GraficoEvolucaoMensal />);
        expect(screen.queryByText("Março/2025:")).not.toBeInTheDocument();
    });

    it("deve renderizar o skeleton quando isLoading é true", () => {
        render(<GraficoEvolucaoMensal isLoading />);
        expect(screen.queryByText("Evolução mensal")).not.toBeInTheDocument();
    });

    it("não deve renderizar o skeleton quando isLoading é false", () => {
        render(<GraficoEvolucaoMensal isLoading={false} />);
        expect(screen.getByText("Evolução mensal")).toBeInTheDocument();
    });

    it("deve usar layout em coluna e remover sombra quando pdfLayout é true", () => {
        const { container } = render(<GraficoEvolucaoMensal pdfLayout />);
        expect(container.firstChild).not.toHaveClass(
            "shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)]",
        );
        expect(container.firstChild).toHaveClass("flex-col");
    });
});
