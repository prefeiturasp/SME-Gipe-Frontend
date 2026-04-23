import type { IntercorrenciaStatus } from "@/actions/analytics";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import GraficoStatusUE from "./GraficoStatusUE";

let mockTooltipActive = true;
let mockOverrideHoveredLabel: string | undefined = undefined;

const mockIntercorrenciasStatus: IntercorrenciaStatus[] = [
    { status: "Em andamento", total: 30, patrimonial: 12, interpessoal: 18 },
    { status: "Incompleta", total: 10, patrimonial: 6, interpessoal: 4 },
    { status: "Finalizada", total: 20, patrimonial: 15, interpessoal: 5 },
    { status: "Migrada", total: 5, patrimonial: 3, interpessoal: 2 },
];

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
        render(
            <GraficoStatusUE
                intercorrenciasStatus={mockIntercorrenciasStatus}
            />,
        );
        expect(screen.getByText("Intercorrências por UE")).toBeInTheDocument();
    });

    it("deve exibir a quantidade de intercorrências por status na legenda", () => {
        render(
            <GraficoStatusUE
                intercorrenciasStatus={mockIntercorrenciasStatus}
            />,
        );
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
        render(
            <GraficoStatusUE
                intercorrenciasStatus={mockIntercorrenciasStatus}
            />,
        );
        const bar = screen.getByTestId("bar-Intercorrências em andamento");
        fireEvent.mouseEnter(bar);
        expect(screen.getByRole("separator")).toBeInTheDocument();
        expect(screen.getByText("Patrimonial:")).toBeInTheDocument();
        expect(screen.getByText("Interpessoal:")).toBeInTheDocument();
    });

    it("deve ocultar o tooltip ao remover o mouse da barra", () => {
        render(
            <GraficoStatusUE
                intercorrenciasStatus={mockIntercorrenciasStatus}
            />,
        );
        const bar = screen.getByTestId("bar-Intercorrências em andamento");
        fireEvent.mouseEnter(bar);
        fireEvent.mouseLeave(bar);
        expect(screen.queryByRole("separator")).not.toBeInTheDocument();
        expect(screen.queryByText("Patrimonial:")).not.toBeInTheDocument();
    });

    it("deve retornar null do tooltip quando active é false", () => {
        mockTooltipActive = false;
        render(
            <GraficoStatusUE
                intercorrenciasStatus={mockIntercorrenciasStatus}
            />,
        );
        const bar = screen.getByTestId("bar-Intercorrências em andamento");
        fireEvent.mouseEnter(bar);
        expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    });

    it("deve retornar null do tooltip quando o status não existe nos dados", () => {
        mockOverrideHoveredLabel = "Status Inexistente";
        render(
            <GraficoStatusUE
                intercorrenciasStatus={mockIntercorrenciasStatus}
            />,
        );
        expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    });

    it("deve renderizar o skeleton quando isLoading é true", () => {
        render(<GraficoStatusUE isLoading />);
        expect(
            screen.queryByText("Intercorrências por UE"),
        ).not.toBeInTheDocument();
    });

    it("não deve renderizar o skeleton quando isLoading é false", () => {
        render(
            <GraficoStatusUE
                isLoading={false}
                intercorrenciasStatus={mockIntercorrenciasStatus}
            />,
        );
        expect(screen.getByText("Intercorrências por UE")).toBeInTheDocument();
    });

    it("deve exibir '0' quando não há dados do backend", () => {
        render(<GraficoStatusUE />);
        const zeros = screen.getAllByText("0");
        // 4 status × 3 valores (total, patrimonial, interpessoal) = 12 zeros
        expect(zeros.length).toBeGreaterThanOrEqual(12);
    });

    it("não deve aplicar sombra quando pdfLayout é true", () => {
        const { container } = render(
            <GraficoStatusUE
                pdfLayout
                intercorrenciasStatus={mockIntercorrenciasStatus}
            />,
        );
        expect(container.firstChild).not.toHaveClass(
            "shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)]",
        );
    });
});
