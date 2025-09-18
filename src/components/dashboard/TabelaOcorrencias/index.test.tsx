import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Mock } from "vitest";

vi.mock("./mockData", () => ({
    getData: vi.fn(),
}));

import { getData } from "./mockData";
import TabelaOcorrencias from "../TabelaOcorrencias";

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
});
