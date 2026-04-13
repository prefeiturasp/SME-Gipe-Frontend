import type { IntercorrenciaDre } from "@/actions/analytics";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import GraficoDRE from "./GraficoDRE";

// Mock useGetUnidades para retornar DREs fake
const mockDreUnidades = [
    { uuid: "1", nome: "DRE Butantã", codigo_eol: "108500" },
    { uuid: "2", nome: "DRE Campo Limpo", codigo_eol: "108600" },
    { uuid: "3", nome: "DRE Itaquera", codigo_eol: "108700" },
    { uuid: "4", nome: "DRE São Miguel", codigo_eol: "108800" },
];

vi.mock("@/hooks/useGetUnidades", () => ({
    useGetUnidades: () => ({ data: mockDreUnidades }),
}));

const mockIntercorrenciasDre: IntercorrenciaDre[] = [
    { codigo_eol: "108500", total: 50, patrimonial: 23, interpessoal: 27 },
    { codigo_eol: "108600", total: 10, patrimonial: 9, interpessoal: 1 },
    { codigo_eol: "108700", total: 50, patrimonial: 32, interpessoal: 18 },
    // DRE São Miguel sem analytics → total 0
];

let mockTooltipActive = true;
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
        render(<GraficoDRE intercorrenciasDre={mockIntercorrenciasDre} />);
        expect(screen.getByText("Intercorrências por DRE")).toBeInTheDocument();
    });

    it("deve exibir o total geral de intercorrências no cabeçalho", () => {
        render(<GraficoDRE intercorrenciasDre={mockIntercorrenciasDre} />);
        expect(
            screen.getByText(/Total: \d+ intercorrências/),
        ).toBeInTheDocument();
    });

    it("deve listar as DREs com seus dados na legenda", () => {
        render(<GraficoDRE intercorrenciasDre={mockIntercorrenciasDre} />);
        expect(screen.getByText("DRE Butantã")).toBeInTheDocument();
        expect(screen.getByText("DRE Campo Limpo")).toBeInTheDocument();
        expect(screen.getByText("DRE Itaquera")).toBeInTheDocument();
    });

    it("deve exibir o tooltip com os dados da DRE ao passar o mouse na barra", () => {
        render(<GraficoDRE intercorrenciasDre={mockIntercorrenciasDre} />);
        const bar = screen.getByTestId("bar-DRE Butantã");
        fireEvent.mouseEnter(bar);
        expect(
            screen.getByText("Total de intercorrências: 50"),
        ).toBeInTheDocument();
        expect(screen.getByText("Patrimoniais: 23")).toBeInTheDocument();
        expect(screen.getByText("Interpessoais: 27")).toBeInTheDocument();
    });

    it("deve ocultar o tooltip ao remover o mouse da barra", () => {
        render(<GraficoDRE intercorrenciasDre={mockIntercorrenciasDre} />);
        const bar = screen.getByTestId("bar-DRE Butantã");
        fireEvent.mouseEnter(bar);
        fireEvent.mouseLeave(bar);
        expect(
            screen.queryByText("Total de intercorrências: 50"),
        ).not.toBeInTheDocument();
    });

    it("não deve exibir tooltip para DRE com total zero", () => {
        render(<GraficoDRE intercorrenciasDre={mockIntercorrenciasDre} />);
        expect(
            screen.queryByTestId("bar-DRE São Miguel"),
        ).not.toBeInTheDocument();
    });

    it("deve retornar null do tooltip quando active é false", () => {
        mockTooltipActive = false;
        render(<GraficoDRE intercorrenciasDre={mockIntercorrenciasDre} />);
        const bar = screen.getByTestId("bar-DRE Butantã");
        fireEvent.mouseEnter(bar);
        expect(
            screen.queryByText("Total de intercorrências: 50"),
        ).not.toBeInTheDocument();
    });

    it("deve retornar null do tooltip quando a DRE não existe nos dados", () => {
        mockOverrideHoveredNome = "DRE Inexistente";
        render(<GraficoDRE intercorrenciasDre={mockIntercorrenciasDre} />);
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
        render(
            <GraficoDRE
                isLoading={false}
                intercorrenciasDre={mockIntercorrenciasDre}
            />,
        );
        expect(screen.getByText("Intercorrências por DRE")).toBeInTheDocument();
    });

    it("não deve aplicar sombra quando pdfLayout é true", () => {
        const { container } = render(
            <GraficoDRE
                pdfLayout
                intercorrenciasDre={mockIntercorrenciasDre}
            />,
        );
        expect(container.firstChild).not.toHaveClass(
            "shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)]",
        );
    });
});
