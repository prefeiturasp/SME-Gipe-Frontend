import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DataTable } from "./data-table";
import { Ocorrencia } from "@/types/ocorrencia";

vi.mock("@/hooks/useUserPermissions", () => ({
    useUserPermissions: () => ({
        isGipe: true,
        isPontoFocal: false,
        isAssistenteOuDiretor: false,
    }),
}));

function makeRows(n: number): Ocorrencia[] {
    return Array.from({ length: n }).map((_, i) => ({
        id: i + 1,
        uuid: `uuid-${i + 1}`,
        protocolo: `P${i + 1}`,
        dataHora: `2025-09-${String(i + 1).padStart(2, "0")} 10:00`,
        codigoEol: `EOL${i + 1}`,
        dre: `DRE-${i + 1}`,
        nomeUe: `UE-${i + 1}`,
        tipoViolencia: "Física",
        status: "Em andamento",
    }));
}

describe("DataTable - paginação e empty", () => {
    it("mostra botão de paginação correto para mais de uma página", async () => {
        const rows = makeRows(11);
        render(<DataTable data={rows} />);

        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();

        const page2 = screen.getByRole("button", { name: "2" });
        const user = userEvent.setup();
        await user.click(page2);
        expect(await screen.findByText("P11")).toBeInTheDocument();
    });

    it("navega com next e prev buttons", async () => {
        const rows = makeRows(11);
        render(<DataTable data={rows} />);

        const user = userEvent.setup();

        expect(screen.queryByText("P11")).not.toBeInTheDocument();

        const next = screen.getByTestId("next-page-button");
        await user.click(next);
        expect(await screen.findByText("P11")).toBeInTheDocument();

        const prev = screen.getByTestId("prev-page-button");
        await user.click(prev);
        expect(await screen.findByText("P1")).toBeInTheDocument();
    });

    it("renderiza mensagem de 'Nenhum resultado encontrado.' quando data é vazia", () => {
        render(<DataTable data={[]} />);
        expect(
            screen.getByText("Nenhum resultado encontrado.")
        ).toBeInTheDocument();
    });
});
