import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Mock } from "vitest";

interface MockUser {
    username: string;
    nome: string;
    perfil_acesso: { nome: string; codigo: number };
}
const mockUser: MockUser = {
    username: "12345",
    nome: "JOÃO DA SILVA",
    perfil_acesso: { nome: "GIPE", codigo: 0 },
};

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: (selector: (state: { user: MockUser }) => unknown) =>
        selector({ user: mockUser }),
}));

vi.mock("./mockData", () => ({
    getData: vi.fn(),
}));

import { getData } from "./mockData";
import TabelaOcorrencias from "../TabelaOcorrencias";
import { parseDataHora, mapStatusFilter, matchPeriodo } from "./filtros/utils";

const sampleData = [
    {
        protocolo: "P0001",
        dataHora: "2025-09-01 10:00",
        codigoEol: "EOL1",
        tipoViolencia: "Física",
        status: "Incompleta",
        id: "1",
    },
    {
        protocolo: "P0002",
        dataHora: "2025-09-02 11:00",
        codigoEol: "EOL2",
        tipoViolencia: "Psicológica",
        status: "Finalizada",
        id: "2",
    },
];

describe("TabelaOcorrencias", () => {
    beforeEach(() => {
        (getData as unknown as Mock).mockReset();
    });

    it("renderiza cabeçalhos e linhas quando existem dados", async () => {
        (getData as unknown as Mock).mockResolvedValue(sampleData);
        render(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(screen.getByText("P0001")).toBeInTheDocument();
        });

        expect(screen.getByText("Protocolo")).toBeInTheDocument();
        expect(screen.getByText("Data/Hora")).toBeInTheDocument();
        expect(screen.getByText("Código EOL")).toBeInTheDocument();
        expect(screen.getByText("Tipo de violência")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Ação")).toBeInTheDocument();

        expect(screen.getByText("P0001")).toBeInTheDocument();
        expect(screen.getByText("P0002")).toBeInTheDocument();

        const incompleta = screen.getByText("Incompleta");
        const finalizada = screen.getByText("Finalizada");
        expect(incompleta).toBeInTheDocument();
        expect(finalizada).toBeInTheDocument();

        expect(incompleta.className).toContain("bg-[#D06D12]");
        expect(finalizada.className).toContain("bg-[#297805]");

        const visualBtns = screen.getAllByRole("button", {
            name: /Visualizar/i,
        });
        expect(visualBtns.length).toBeGreaterThan(0);

        await userEvent.hover(visualBtns[0]);
        const tooltip = await screen.findByRole("tooltip");
        expect(within(tooltip).getByText(/Visualizar/i)).toBeInTheDocument();
    });

    it("renderiza estado vazio corretamente", async () => {
        (getData as unknown as Mock).mockResolvedValue([]);
        render(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(
                screen.getByText("Nenhum resultado encontrado.")
            ).toBeInTheDocument();
        });
    });

    it("parseDataHora retorna Date esperado (DD/MM/YYYY - HH:mm)", () => {
        const d1 = parseDataHora("01/09/2025 - 10:00");
        expect(d1.getFullYear()).toBe(2025);
        expect(d1.getMonth()).toBe(8);
        expect(d1.getDate()).toBe(1);

        const d2 = parseDataHora("15/01/2024");
        expect(d2.getFullYear()).toBe(2024);
        expect(d2.getMonth()).toBe(0);
        expect(d2.getDate()).toBe(15);
    });

    it("mapStatusFilter mapeia corretamente e faz fallback com ??", () => {
        expect(mapStatusFilter("")).toBe("");
        expect(mapStatusFilter("incompleta")).toBe("Incompleta");
        expect(mapStatusFilter("em-andamento")).toBe("Em andamento");
        expect(mapStatusFilter("finalizada")).toBe("Finalizada");
        expect(mapStatusFilter("em_analise")).toBe("em_analise");
    });

    it("matchPeriodo retorna true/false conforme intervalo e inclui limites", () => {
        const dataDentro = "15/09/2025 - 08:00";
        const inicio = "2025-09-01";
        const fim = "2025-09-30";

        expect(matchPeriodo(dataDentro, inicio, fim)).toBe(true);
        expect(matchPeriodo("01/09/2025 - 00:00", inicio, fim)).toBe(true);
        expect(matchPeriodo("30/09/2025 - 23:59", inicio, fim)).toBe(true);

        expect(matchPeriodo("31/08/2025 - 23:59", inicio, fim)).toBe(false);
        expect(matchPeriodo("01/10/2025 - 00:00", inicio, fim)).toBe(false);

        expect(matchPeriodo("10/09/2025 - 12:00", undefined, fim)).toBe(true);
        expect(matchPeriodo("02/10/2025 - 12:00", undefined, fim)).toBe(false);
        expect(matchPeriodo("10/09/2025 - 12:00", inicio)).toBe(true);
        expect(matchPeriodo("31/08/2025 - 12:00", inicio)).toBe(false);

        expect(matchPeriodo("10/09/2025 - 12:00")).toBe(true);
    });

    it("matchPeriodo suporta limites parciais YYYY e YYYY-MM", () => {
        expect(matchPeriodo("01/01/2025 - 00:00", "2025")).toBe(true);
        expect(matchPeriodo("31/12/2024 - 23:59", "2025")).toBe(false);

        expect(matchPeriodo("01/09/2025 - 00:00", "2025-09")).toBe(true);
        expect(matchPeriodo("31/08/2025 - 23:59", "2025-09")).toBe(false);

        expect(matchPeriodo("01/01/2025 - 10:00", undefined, "2025")).toBe(
            true
        );
        expect(matchPeriodo("02/01/2025 - 00:00", undefined, "2025")).toBe(
            false
        );

        expect(matchPeriodo("01/09/2025 - 00:00", undefined, "2025-09")).toBe(
            true
        );
        expect(matchPeriodo("02/09/2025 - 00:00", undefined, "2025-09")).toBe(
            false
        );
    });

    it("filtra por Código EOL e permite limpar para ver todos novamente", async () => {
        (getData as unknown as Mock).mockResolvedValue(sampleData);
        const user = userEvent.setup();
        render(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(screen.getByText("P0001")).toBeInTheDocument();
        });

        await user.click(screen.getByRole("button", { name: /Filtrar/i }));

        const codigoInput = screen.getByLabelText(/Código EOL/i);
        await user.type(codigoInput, "EOL2");

        const botoesFiltrar = screen.getAllByRole("button", {
            name: /Filtrar/i,
        });
        const botaoFiltrarDoPainel = botoesFiltrar[botoesFiltrar.length - 1];
        await user.click(botaoFiltrarDoPainel);

        await waitFor(() => {
            expect(screen.queryByText("P0001")).not.toBeInTheDocument();
            expect(screen.getByText("P0002")).toBeInTheDocument();
        });

        const botaoLimpar = screen.getByRole("button", { name: /Limpar/i });
        await user.click(botaoLimpar);
        await waitFor(() => {
            expect(screen.getByText("P0001")).toBeInTheDocument();
            expect(screen.getByText("P0002")).toBeInTheDocument();
        });
    });

    it("filtra por Tipo de violência e Status", async () => {
        (getData as unknown as Mock).mockResolvedValue(sampleData);
        const user = userEvent.setup();
        render(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(screen.getByText("P0001")).toBeInTheDocument();
        });

        await user.click(screen.getByRole("button", { name: /Filtrar/i }));

        await user.click(
            screen.getByRole("combobox", { name: /Tipo de violência/i })
        );
        const tvListbox = await screen.findByRole("listbox");
        const tvOption = await within(tvListbox).findByRole("option", {
            name: /Psicológica/i,
        });
        await user.click(tvOption);

        await user.click(screen.getByRole("combobox", { name: /Status/i }));
        const statusListbox = await screen.findByRole("listbox");
        const statusOption = await within(statusListbox).findByRole("option", {
            name: /Finalizada/i,
        });
        await user.click(statusOption);

        const botoesFiltrar2 = screen.getAllByRole("button", {
            name: /Filtrar/i,
        });
        const botaoFiltrarDoPainel2 = botoesFiltrar2[botoesFiltrar2.length - 1];
        await user.click(botaoFiltrarDoPainel2);

        await waitFor(() => {
            expect(screen.queryByText("P0001")).not.toBeInTheDocument();
            expect(screen.getByText("P0002")).toBeInTheDocument();
        });

        const allRows = screen.getAllByRole("row");
        const rowP2 = allRows.find((r) => within(r).queryByText("P0002"));
        expect(rowP2).toBeTruthy();
        const statusCell = within(rowP2 as HTMLElement).getByTestId(
            "td-status"
        );
        expect(within(statusCell).getByText("Finalizada")).toBeInTheDocument();
    });
});
