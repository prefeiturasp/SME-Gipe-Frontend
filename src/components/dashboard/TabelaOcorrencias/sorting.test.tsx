import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Mock } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface MockUser {
    username: string;
    name: string;
    perfil_acesso: { nome: string; codigo: number };
}
const mockUser: MockUser = {
    username: "12345",
    name: "JOÃO DA SILVA",
    perfil_acesso: { nome: "GIPE", codigo: 0 },
};

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: (selector: (state: { user: MockUser }) => unknown) =>
        selector({ user: mockUser }),
}));

vi.mock("@/hooks/useOcorrencias", () => ({
    useOcorrencias: vi.fn(),
}));

import { useOcorrencias } from "@/hooks/useOcorrencias";
import TabelaOcorrencias from "./index";

const renderWithQueryProvider = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return render(ui, {
        wrapper: ({ children }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        ),
    });
};

const sampleData = [
    {
        protocolo: "P0002",
        dataHora: "2025-09-02 11:00",
        codigoEol: "EOL2",
        tipoViolencia: "Psicológica",
        status: "Finalizada",
        id: "2",
    },
    {
        protocolo: "P0001",
        dataHora: "2025-09-01 10:00",
        codigoEol: "EOL1",
        tipoViolencia: "Física",
        status: "Incompleta",
        id: "1",
    },
];

describe("TabelaOcorrencias - sorting", () => {
    beforeEach(() => {
        (useOcorrencias as Mock).mockClear();
    });

    it("ordena por protocolo asc e desc", async () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: sampleData,
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() =>
            expect(screen.getByText("P0001")).toBeInTheDocument()
        );

        const protocoloHeader = screen.getByText("Protocolo");
        const user = userEvent.setup();

        await user.click(protocoloHeader);

        const crescent = await screen.findByText(/Crescente \(0 - 10\)/i);
        await user.click(crescent);

        const firstRow = screen.getAllByTestId("td-protocolo")[0];
        expect(within(firstRow).getByText("P0001")).toBeInTheDocument();

        await user.click(protocoloHeader);
        const dec = await screen.findByText(/Decrescente \(10 - 0\)/i);
        await user.click(dec);

        const firstRowDesc = screen.getAllByTestId("td-protocolo")[0];
        expect(within(firstRowDesc).getByText("P0002")).toBeInTheDocument();
    });

    it("ordena por tipoViolencia alfabético e inverso", async () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: sampleData,
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() =>
            expect(screen.getByText("P0001")).toBeInTheDocument()
        );

        const tipoHeader = screen.getByText("Tipo de violência");
        const user = userEvent.setup();

        await user.click(tipoHeader);
        const alpha = await screen.findByText(/Ordem alfabética \(A - Z\)/i);
        await user.click(alpha);

        const first = screen.getAllByTestId("td-protocolo")[0];
        expect(within(first).getByText("P0001")).toBeInTheDocument();

        await user.click(tipoHeader);
        const alphaInv = await screen.findByText(/Ordem alfabética inversa/i);
        await user.click(alphaInv);

        const firstInv = screen.getAllByTestId("td-protocolo")[0];
        expect(within(firstInv).getByText("P0002")).toBeInTheDocument();
    });

    it("ordena por status usando prioridade selecionada", async () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: sampleData,
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() =>
            expect(screen.getByText("P0001")).toBeInTheDocument()
        );

        const statusHeader = screen.getByText("Status");
        const user = userEvent.setup();

        await user.click(statusHeader);
        const menuItems = await screen.findAllByRole("menuitemradio");
        const finalizadaItem = menuItems.find((item) =>
            within(item).queryByText(/Finalizada/i)
        );
        if (!finalizadaItem)
            throw new Error("Finalizada option not found in menu");
        await user.click(finalizadaItem);

        const first = screen.getAllByTestId("td-protocolo")[0];
        expect(within(first).getByText("P0002")).toBeInTheDocument();
    });

    it("prioriza Incompleta quando selecionada", async () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: sampleData,
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() =>
            expect(screen.getByText("P0001")).toBeInTheDocument()
        );

        const statusHeader = screen.getByText("Status");
        const user = userEvent.setup();

        await user.click(statusHeader);
        const menuItems = await screen.findAllByRole("menuitemradio");
        const incompletaItem = menuItems.find((item) =>
            within(item).queryByText(/Incompleta/i)
        );
        if (!incompletaItem)
            throw new Error("Incompleta option not found in menu");
        await user.click(incompletaItem);

        const first = screen.getAllByTestId("td-protocolo")[0];
        expect(within(first).getByText("P0001")).toBeInTheDocument();
    });

    it("prioriza Em andamento quando selecionada", async () => {
        const dataWithEmAndamento = [
            ...sampleData,
            {
                protocolo: "P0003",
                dataHora: "2025-09-03 12:00",
                codigoEol: "EOL3",
                tipoViolencia: "Material",
                status: "Em andamento",
                id: "3",
            },
        ];

        (useOcorrencias as Mock).mockReturnValue({
            data: dataWithEmAndamento,
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() =>
            expect(screen.getByText("P0003")).toBeInTheDocument()
        );

        const statusHeader = screen.getByText("Status");
        const user = userEvent.setup();

        await user.click(statusHeader);
        const menuItems = await screen.findAllByRole("menuitemradio");
        const emAndamentoItem = menuItems.find((item) =>
            within(item).queryByText(/Em andamento/i)
        );
        if (!emAndamentoItem)
            throw new Error("Em andamento option not found in menu");
        await user.click(emAndamentoItem);

        const first = screen.getAllByTestId("td-protocolo")[0];
        expect(within(first).getByText("P0003")).toBeInTheDocument();
    });

    it("ordena por dataHora recent e oldest", async () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: sampleData,
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() =>
            expect(screen.getByText("P0001")).toBeInTheDocument()
        );

        const dataHeader = screen.getByText("Data/Hora");
        const user = userEvent.setup();

        await user.click(dataHeader);
        let menuItems = await screen.findAllByRole("menuitemradio");
        const recentItem = menuItems.find((item) =>
            within(item).queryByText(/Do mais recente ao mais antigo/i)
        );
        if (!recentItem) throw new Error("Recent option not found in menu");
        await user.click(recentItem);

        await waitFor(() => {
            const first = screen.getAllByTestId("td-protocolo")[0];
            expect(within(first).getByText("P0001")).toBeInTheDocument();
        });

        await user.click(dataHeader);
        menuItems = await screen.findAllByRole("menuitemradio");
        const oldestItem = menuItems.find((item) =>
            within(item).queryByText(/Do mais antigo ao mais recente/i)
        );
        if (!oldestItem) throw new Error("Oldest option not found in menu");
        await user.click(oldestItem);

        await waitFor(() => {
            const firstOld = screen.getAllByTestId("td-protocolo")[0];
            expect(within(firstOld).getByText("P0002")).toBeInTheDocument();
        });
    });

    it("ordena por DRE alfabético e inverso", async () => {
        const dataWithDre = [
            {
                protocolo: "P0001",
                dataHora: "2025-09-01 10:00",
                codigoEol: "EOL1",
                tipoViolencia: "Física",
                status: "Incompleta",
                dre: "DRE - Itaquera",
                nomeUe: "EMEF Alpha",
                id: "1",
            },
            {
                protocolo: "P0002",
                dataHora: "2025-09-02 11:00",
                codigoEol: "EOL2",
                tipoViolencia: "Psicológica",
                status: "Finalizada",
                dre: "DRE - Capela do Socorro",
                nomeUe: "EMEF Beta",
                id: "2",
            },
            {
                protocolo: "P0003",
                dataHora: "2025-09-03 12:00",
                codigoEol: "EOL3",
                tipoViolencia: "Material",
                status: "Finalizada",
                dre: "DRE - Penha",
                nomeUe: "EMEF Gamma",
                id: "3",
            },
        ];

        (useOcorrencias as Mock).mockReturnValue({
            data: dataWithDre,
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() =>
            expect(screen.getByText("P0001")).toBeInTheDocument()
        );

        const dreHeader = screen.getByText("DRE");
        const user = userEvent.setup();

        await user.click(dreHeader);
        const alpha = await screen.findByText(/Ordem alfabética \(A - Z\)/i);
        await user.click(alpha);

        const first = screen.getAllByTestId("td-protocolo")[0];
        expect(within(first).getByText("P0002")).toBeInTheDocument();

        await user.click(dreHeader);
        const alphaInv = await screen.findByText(/Ordem alfabética inversa/i);
        await user.click(alphaInv);

        const firstInv = screen.getAllByTestId("td-protocolo")[0];
        expect(within(firstInv).getByText("P0003")).toBeInTheDocument();
    });

    it("ordena por Nome da UE alfabético e inverso", async () => {
        const dataWithUe = [
            {
                protocolo: "P0001",
                dataHora: "2025-09-01 10:00",
                codigoEol: "EOL1",
                tipoViolencia: "Física",
                status: "Incompleta",
                dre: "DRE - Itaquera",
                nomeUe: "CEU Água Azul",
                id: "1",
            },
            {
                protocolo: "P0002",
                dataHora: "2025-09-02 11:00",
                codigoEol: "EOL2",
                tipoViolencia: "Psicológica",
                status: "Finalizada",
                dre: "DRE - Capela do Socorro",
                nomeUe: "EMEF Prof. João",
                id: "2",
            },
            {
                protocolo: "P0003",
                dataHora: "2025-09-03 12:00",
                codigoEol: "EOL3",
                tipoViolencia: "Material",
                status: "Finalizada",
                dre: "DRE - Penha",
                nomeUe: "EMEF Dom Pedro I",
                id: "3",
            },
        ];

        (useOcorrencias as Mock).mockReturnValue({
            data: dataWithUe,
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() =>
            expect(screen.getByText("P0001")).toBeInTheDocument()
        );

        const nomeHeader = screen.getByText("Nome da UE");
        const user = userEvent.setup();

        await user.click(nomeHeader);
        const alpha = await screen.findByText(/Ordem alfabética \(A - Z\)/i);
        await user.click(alpha);

        const first = screen.getAllByTestId("td-protocolo")[0];
        expect(within(first).getByText("P0001")).toBeInTheDocument();

        await user.click(nomeHeader);
        const alphaInv = await screen.findByText(/Ordem alfabética inversa/i);
        await user.click(alphaInv);

        const firstInv = screen.getAllByTestId("td-protocolo")[0];
        expect(within(firstInv).getByText("P0002")).toBeInTheDocument();
    });
});
