import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import GraficoStatusUE from "./GraficoStatusUE";

// Variáveis lidas pelas closures do mock no momento do render
let mockTooltipActive = true;
// Quando definido, sobrepõe o hoveredLabel que vem do estado do componente
let mockOverrideHoveredLabel: string | undefined = undefined;

vi.mock("recharts", () => ({
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    ),
    BarChart: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    Bar: ({
        dataKey,
        onMouseEnter,
        onMouseLeave,
    }: {
        dataKey: string;
        onMouseEnter?: () => void;
        onMouseLeave?: () => void;
    }) => (
        <div
            data-testid={`bar-${dataKey}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    ),
    Tooltip: ({ content }: { content: React.ReactElement }) => {
        if (!React.isValidElement(content)) return null;
        const extraProps: Record<string, unknown> = {
            active: mockTooltipActive,
        };
        if (mockOverrideHoveredLabel !== undefined) {
            extraProps.hoveredLabel = mockOverrideHoveredLabel;
        }
        return React.cloneElement(
            content as React.ReactElement<Record<string, unknown>>,
            extraProps,
        );
    },
    XAxis: () => null,
    YAxis: () => null,
}));

afterEach(() => {
    mockTooltipActive = true;
    mockOverrideHoveredLabel = undefined;
});

describe("GraficoStatusUE", () => {
    it("deve renderizar o título Intercorrências por UE", () => {
        render(<GraficoStatusUE />);
        expect(screen.getByText("Intercorrências por UE")).toBeInTheDocument();
    });

    it("deve exibir a quantidade de intercorrências por status na legenda", () => {
        render(<GraficoStatusUE />);
        expect(
            screen.getByText("Intercorrências em andamento:"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Intercorrências incompletas:"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Intercorrências finalizadas:"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Intercorrências migradas:"),
        ).toBeInTheDocument();
    });

    it("deve exibir o tooltip com os dados ao passar o mouse na barra", () => {
        render(<GraficoStatusUE />);
        const bar = screen.getByTestId("bar-Intercorrências em andamento");
        fireEvent.mouseEnter(bar);
        // O tooltip tem <hr> único no componente e usa singular (Patrimonial/Interpessoal)
        // enquanto a legenda usa plural (Patrimoniais/Interpessoais)
        expect(screen.getByRole("separator")).toBeInTheDocument();
        expect(screen.getByText("Patrimonial:")).toBeInTheDocument();
        expect(screen.getByText("Interpessoal:")).toBeInTheDocument();
    });

    it("deve ocultar o tooltip ao remover o mouse da barra", () => {
        render(<GraficoStatusUE />);
        const bar = screen.getByTestId("bar-Intercorrências em andamento");
        fireEvent.mouseEnter(bar);
        fireEvent.mouseLeave(bar);
        expect(screen.queryByRole("separator")).not.toBeInTheDocument();
        expect(screen.queryByText("Patrimonial:")).not.toBeInTheDocument();
    });

    it("deve retornar null do tooltip quando active é false", () => {
        mockTooltipActive = false;
        render(<GraficoStatusUE />);
        const bar = screen.getByTestId("bar-Intercorrências em andamento");
        fireEvent.mouseEnter(bar);
        expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    });

    it("deve retornar null do tooltip quando o status não existe nos dados", () => {
        mockOverrideHoveredLabel = "Status Inexistente";
        render(<GraficoStatusUE />);
        // status = undefined → TooltipStatus retorna null → sem separador
        expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    });
});
