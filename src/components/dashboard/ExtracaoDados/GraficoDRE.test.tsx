import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import GraficoDRE from "./GraficoDRE";

// Variáveis lidas pelas closures do mock no momento do render (não na definição)
let mockTooltipActive = true;
// Quando definido, sobrepõe o hoveredNome que vem do estado do componente
let mockOverrideHoveredNome: string | undefined = undefined;

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
        if (mockOverrideHoveredNome !== undefined) {
            extraProps.hoveredNome = mockOverrideHoveredNome;
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
    mockOverrideHoveredNome = undefined;
});

describe("GraficoDRE", () => {
    it("deve renderizar o título Intercorrências por DRE", () => {
        render(<GraficoDRE />);
        expect(screen.getByText("Intercorrências por DRE")).toBeInTheDocument();
    });

    it("deve exibir o total geral de intercorrências no cabeçalho", () => {
        render(<GraficoDRE />);
        expect(
            screen.getByText(/Total: \d+ intercorrências/),
        ).toBeInTheDocument();
    });

    it("deve listar as DREs com seus dados na legenda", () => {
        render(<GraficoDRE />);
        expect(screen.getByText("DRE Butantã")).toBeInTheDocument();
        expect(screen.getByText("DRE Campo Limpo")).toBeInTheDocument();
        expect(screen.getByText("DRE Itaquera")).toBeInTheDocument();
    });

    it("deve exibir o tooltip com os dados da DRE ao passar o mouse na barra", () => {
        render(<GraficoDRE />);
        const bar = screen.getByTestId("bar-DRE Butantã");
        fireEvent.mouseEnter(bar);
        expect(
            screen.getByText("Total de intercorrências: 50"),
        ).toBeInTheDocument();
        expect(screen.getByText("Patrimoniais: 23")).toBeInTheDocument();
        expect(screen.getByText("Interpessoais: 27")).toBeInTheDocument();
    });

    it("deve ocultar o tooltip ao remover o mouse da barra", () => {
        render(<GraficoDRE />);
        const bar = screen.getByTestId("bar-DRE Butantã");
        fireEvent.mouseEnter(bar);
        fireEvent.mouseLeave(bar);
        expect(
            screen.queryByText("Total de intercorrências: 50"),
        ).not.toBeInTheDocument();
    });

    it("não deve exibir tooltip para DRE com total zero", () => {
        render(<GraficoDRE />);
        expect(
            screen.queryByTestId("bar-DRE São Miguel"),
        ).not.toBeInTheDocument();
    });

    it("deve retornar null do tooltip quando active é false", () => {
        mockTooltipActive = false;
        render(<GraficoDRE />);
        const bar = screen.getByTestId("bar-DRE Butantã");
        fireEvent.mouseEnter(bar);
        expect(
            screen.queryByText("Total de intercorrências: 50"),
        ).not.toBeInTheDocument();
    });

    it("deve retornar null do tooltip quando a DRE não existe nos dados", () => {
        mockOverrideHoveredNome = "DRE Inexistente";
        render(<GraficoDRE />);
        // dre = undefined → TooltipDRE retorna null → sem separador
        expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    });

    it("deve renderizar o skeleton quando isLoading é true", () => {
        render(<GraficoDRE isLoading />);
        expect(
            screen.queryByText("Intercorrências por DRE"),
        ).not.toBeInTheDocument();
    });

    it("não deve renderizar o skeleton quando isLoading é false", () => {
        render(<GraficoDRE isLoading={false} />);
        expect(screen.getByText("Intercorrências por DRE")).toBeInTheDocument();
    });
});
