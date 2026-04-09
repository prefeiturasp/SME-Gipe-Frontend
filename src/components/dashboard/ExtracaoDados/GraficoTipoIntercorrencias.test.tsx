import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import GraficoTipoIntercorrencias from "./GraficoTipoIntercorrencias";

// Variáveis lidas pelas closures do mock no momento do render (não na definição)
let mockBarLabelValue = 5;
let mockXAxisPayload: { value: string } | undefined = {
    value: "Furto no estabelecimento",
};
let mockTooltipActive = true;
let mockTooltipPayload: { value: number }[] = [{ value: 10 }];
let mockTooltipLabel: string | undefined = "Furto no estabelecimento";

vi.mock("recharts", () => ({
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    ),
    BarChart: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    Bar: ({
        label,
        children,
    }: {
        label?: React.ReactElement;
        children?: React.ReactNode;
    }) => (
        <div>
            {label && React.isValidElement(label)
                ? React.cloneElement(
                      label as React.ReactElement<{
                          x: number;
                          y: number;
                          width: number;
                          value: number;
                      }>,
                      { x: 10, y: 20, width: 90, value: mockBarLabelValue },
                  )
                : null}
            {children}
        </div>
    ),
    XAxis: ({ tick }: { tick?: React.ReactElement | object }) => {
        if (!tick || !React.isValidElement(tick)) return null;
        return (
            <div>
                {React.cloneElement(
                    tick as React.ReactElement<{
                        x: number;
                        y: number;
                        payload: { value: string } | undefined;
                    }>,
                    {
                        x: 50,
                        y: 100,
                        payload: mockXAxisPayload,
                    },
                )}
            </div>
        );
    },
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: ({
        content,
    }: {
        content: React.ReactElement<{
            active: boolean;
            payload: { value: number }[];
            label: string;
        }>;
    }) => {
        if (!React.isValidElement(content)) return null;
        return React.cloneElement(
            content as React.ReactElement<{
                active: boolean;
                payload: { value: number }[];
                label: string;
            }>,
            {
                active: mockTooltipActive,
                payload: mockTooltipPayload,
                label: mockTooltipLabel,
            },
        );
    },
}));

afterEach(() => {
    mockBarLabelValue = 5;
    mockXAxisPayload = { value: "Furto no estabelecimento" };
    mockTooltipActive = true;
    mockTooltipPayload = [{ value: 10 }];
    mockTooltipLabel = "Furto no estabelecimento";
});

describe("GraficoTipoIntercorrencias", () => {
    it("deve renderizar o título do gráfico", () => {
        render(<GraficoTipoIntercorrencias />);
        expect(
            screen.getByText("Gráfico por tipo de intercorrências"),
        ).toBeInTheDocument();
    });

    it("deve exibir por padrão a aba de intercorrências patrimoniais", () => {
        render(<GraficoTipoIntercorrencias />);
        expect(
            screen.getByRole("tab", { name: "Intercorrências patrimoniais" }),
        ).toHaveAttribute("data-state", "active");
    });

    it("deve renderizar o rótulo de barra com valor formatado via BarLabel", () => {
        render(<GraficoTipoIntercorrencias />);
        expect(screen.getByText("05")).toBeInTheDocument();
    });

    it("deve renderizar o tick do eixo X com quebra de linha via CustomXAxisTick", () => {
        render(<GraficoTipoIntercorrencias />);
        expect(screen.getByText("Furto no")).toBeInTheDocument();
        expect(screen.getByText("estabelecimento")).toBeInTheDocument();
    });

    it("deve exibir o tooltip com tipo e quantidade de intercorrências", () => {
        render(<GraficoTipoIntercorrencias />);
        expect(
            screen.getByText("Furto no estabelecimento:"),
        ).toBeInTheDocument();
        expect(screen.getByText("10 intercorrências")).toBeInTheDocument();
    });

    it("deve exibir a aba interpessoal ao clicar nela", async () => {
        const user = userEvent.setup();
        render(<GraficoTipoIntercorrencias />);
        await user.click(
            screen.getByRole("tab", {
                name: "Intercorrências interpessoais",
            }),
        );
        expect(
            screen.getByRole("tab", {
                name: "Intercorrências interpessoais",
            }),
        ).toHaveAttribute("data-state", "active");
    });

    it("deve renderizar o gráfico de motivações ao clicar na aba interpessoal", async () => {
        const user = userEvent.setup();
        render(<GraficoTipoIntercorrencias />);
        await user.click(
            screen.getByRole("tab", {
                name: "Intercorrências interpessoais",
            }),
        );
        expect(screen.getByText("Gráfico por motivação")).toBeInTheDocument();
    });

    it("deve exibir a descrição do gráfico de motivações na aba interpessoal", async () => {
        const user = userEvent.setup();
        render(<GraficoTipoIntercorrencias />);
        await user.click(
            screen.getByRole("tab", {
                name: "Intercorrências interpessoais",
            }),
        );
        expect(
            screen.getByText(
                "Confira a quantidade de registros cadastrados por motivo de intercorrências.",
            ),
        ).toBeInTheDocument();
    });

    it("deve retornar null do BarLabel quando value é zero", () => {
        mockBarLabelValue = 0;
        render(<GraficoTipoIntercorrencias />);
        // Com value=0, BarLabel retorna null — o texto "00" não deve aparecer
        expect(screen.queryByText("00")).not.toBeInTheDocument();
    });

    it("deve retornar null do CustomXAxisTick quando payload está ausente", () => {
        mockXAxisPayload = undefined;
        render(<GraficoTipoIntercorrencias />);
        // Sem payload, CustomXAxisTick retorna null — nenhum texto de tick renderizado
        expect(screen.queryByText("Furto no")).not.toBeInTheDocument();
    });

    it("deve usar string vazia quando label é undefined no TooltipColunas", () => {
        mockTooltipLabel = undefined;
        render(<GraficoTipoIntercorrencias />);
        // label ?? "" → "" → tipo = "" → renderiza apenas ":"
        expect(screen.getByText(":")).toBeInTheDocument();
    });

    it("deve retornar null do TooltipColunas quando active é false", () => {
        mockTooltipActive = false;
        render(<GraficoTipoIntercorrencias />);
        expect(
            screen.queryByText("Furto no estabelecimento:"),
        ).not.toBeInTheDocument();
    });

    it("deve retornar null do TooltipColunas quando payload está vazio", () => {
        mockTooltipPayload = [];
        render(<GraficoTipoIntercorrencias />);
        expect(
            screen.queryByText("10 intercorrências"),
        ).not.toBeInTheDocument();
    });

    it("deve renderizar o skeleton quando isLoading é true", () => {
        render(<GraficoTipoIntercorrencias isLoading />);
        expect(
            screen.queryByText("Gráfico por tipo de intercorrências"),
        ).not.toBeInTheDocument();
    });

    it("não deve renderizar o skeleton quando isLoading é false", () => {
        render(<GraficoTipoIntercorrencias isLoading={false} />);
        expect(
            screen.getByText("Gráfico por tipo de intercorrências"),
        ).toBeInTheDocument();
    });
});
