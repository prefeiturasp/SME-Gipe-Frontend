import * as useTiposOcorrenciaHook from "@/hooks/useTiposOcorrencia";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import type { Mock } from "vitest";
import { vi } from "vitest";

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

vi.mock("@/hooks/useTiposOcorrencia");

vi.mock("@/hooks/useUserPermissions", () => ({
    useUserPermissions: vi.fn(),
}));

const mockTiposOcorrencia = [
    {
        uuid: "1cd5b78c-3d8a-483c-a2c5-1346c44a4e97",
        nome: "Física",
    },
    {
        uuid: "f2a5b2d7-390d-4af9-ab1b-06551eec0dba",
        nome: "Psicológica",
    },
];

import { useOcorrencias } from "@/hooks/useOcorrencias";
import * as useUnidadesHook from "@/hooks/useUnidades";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import TabelaOcorrencias from "../TabelaOcorrencias";
import { mapStatusFilter, matchPeriodo, parseDataHora } from "./filtros/utils";

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
        protocolo: "P0001",
        dataHora: "2025-09-01 10:00",
        codigoEol: "EOL1",
        dre: "DRE Centro",
        nomeUe: "EMEF Escola Teste 1",
        tipoOcorrencia: "Física",
        status: "Incompleta",
        id: "1",
        uuid: "uuid-test-1",
    },
    {
        protocolo: "P0002",
        dataHora: "2025-09-02 11:00",
        codigoEol: "EOL2",
        dre: "DRE Sul",
        nomeUe: "EMEF Escola Teste 2",
        tipoOcorrencia: "Psicológica",
        status: "Finalizada",
        id: "2",
        uuid: "uuid-test-2",
    },
];

describe("TabelaOcorrencias", () => {
    beforeEach(() => {
        (useOcorrencias as Mock).mockClear();

        (useUserPermissions as Mock).mockReturnValue({
            isGipe: true,
            isPontoFocal: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });

        vi.spyOn(useTiposOcorrenciaHook, "useTiposOcorrencia").mockReturnValue({
            data: mockTiposOcorrencia,
            isLoading: false,
            isError: false,
            error: null,
        } as never);

        vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
            data: [
                { uuid: "dre-1", nome: "DRE 1" },
                { uuid: "dre-2", nome: "DRE 2" },
                { uuid: "dre-3", nome: "DRE 3" },
            ],
            isLoading: false,
            isError: false,
            error: null,
        } as never);

        vi.spyOn(useUnidadesHook, "useFetchTodasUEs").mockReturnValue({
            data: [
                { uuid: "ue-1", nome: "UE 1" },
                { uuid: "ue-2", nome: "UE 2" },
                { uuid: "ue-3", nome: "UE 3" },
            ],
            isLoading: false,
            isError: false,
            error: null,
        } as never);
    });

    it("renderiza cabeçalhos e linhas quando existem dados", async () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: sampleData,
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(screen.getByText("P0001")).toBeInTheDocument();
        });

        expect(screen.getByText("Protocolo")).toBeInTheDocument();
        expect(screen.getByText("Data/Hora")).toBeInTheDocument();
        expect(screen.getByText("Código EOL")).toBeInTheDocument();
        expect(screen.getByText("Tipo de Ocorrência")).toBeInTheDocument();
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

        const visualLinks = screen.getAllByRole("link", {
            name: /Visualizar/i,
        });
        expect(visualLinks.length).toBeGreaterThan(0);
        expect(visualLinks[0]).toHaveAttribute(
            "href",
            "/dashboard/cadastrar-ocorrencia/uuid-test-1"
        );

        await userEvent.hover(visualLinks[0]);
        const tooltip = await screen.findByRole("tooltip");
        expect(within(tooltip).getByText(/Visualizar/i)).toBeInTheDocument();
    });

    it("renderiza estado vazio corretamente", async () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: [],
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Você ainda não possui nenhuma intercorrência registrada."
                )
            ).toBeInTheDocument();
        });

        expect(
            screen.getByText("Clique em nova ocorrência para começar.")
        ).toBeInTheDocument();
    });

    it("deve exibir alerta quando não há ocorrências registradas", async () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: [],
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Você ainda não possui nenhuma intercorrência registrada."
                )
            ).toBeInTheDocument();
        });

        expect(
            screen.getByText("Clique em nova ocorrência para começar.")
        ).toBeInTheDocument();
    });

    it("deve desabilitar botões Exportar e Filtrar quando não há ocorrências", async () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: [],
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: /Exportar/i })
            ).toBeDisabled();
        });

        expect(screen.getByRole("button", { name: /Filtrar/i })).toBeDisabled();
    });

    it("deve habilitar botões Exportar e Filtrar quando há ocorrências", async () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: sampleData,
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(screen.getByText("P0001")).toBeInTheDocument();
        });

        expect(
            screen.getByRole("button", { name: /Exportar/i })
        ).not.toBeDisabled();
        expect(
            screen.getByRole("button", { name: /Filtrar/i })
        ).not.toBeDisabled();
    });

    it("deve renderizar o estado de loading", () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        expect(screen.getByText("Carregando...")).toBeInTheDocument();
        expect(screen.queryByText("Protocolo")).not.toBeInTheDocument();
    });

    it("deve usar array vazio quando ocorrenciasData é undefined", async () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
        });
        renderWithQueryProvider(<TabelaOcorrencias />);

        expect(
            screen.getByText("Histórico de ocorrências registradas")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /Exportar/i })
        ).toBeDisabled();
        expect(screen.getByRole("button", { name: /Filtrar/i })).toBeDisabled();
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
        (useOcorrencias as Mock).mockReturnValue({
            data: sampleData,
            isLoading: false,
        });
        const user = userEvent.setup();
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(screen.getByText("P0001")).toBeInTheDocument();
        });

        await user.click(screen.getByRole("button", { name: /Filtrar/i }));

        const codigoInput = screen.getByLabelText(/Código EOL/i);
        await user.type(codigoInput, "EOL2");

        const botoesFiltrar = screen.getAllByRole("button", {
            name: /Filtrar/i,
        });
        const botaoFiltrarDoPainel = botoesFiltrar.at(-1);
        await user.click(botaoFiltrarDoPainel!);

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

    it("filtra por Tipo de Ocorrência e Status", async () => {
        (useOcorrencias as Mock).mockReturnValue({
            data: sampleData,
            isLoading: false,
        });
        const user = userEvent.setup();
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(screen.getByText("P0001")).toBeInTheDocument();
        });

        await user.click(screen.getByRole("button", { name: /Filtrar/i }));

        await user.click(
            screen.getByRole("combobox", { name: /Tipo de Ocorrência/i })
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
        const botaoFiltrarDoPainel2 = botoesFiltrar2.at(-1);
        await user.click(botaoFiltrarDoPainel2!);

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

    it("deve exibir colunas DRE e Nome da UE para perfil GIPE", async () => {
        (useUserPermissions as Mock).mockReturnValue({
            isGipe: true,
            isPontoFocal: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });

        (useOcorrencias as Mock).mockReturnValue({
            data: sampleData,
            isLoading: false,
        });

        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(screen.getByText("P0001")).toBeInTheDocument();
        });

        expect(screen.getByText("DRE")).toBeInTheDocument();
        expect(screen.getByText("Nome da UE")).toBeInTheDocument();

        expect(screen.getByText("DRE Centro")).toBeInTheDocument();
        expect(screen.getByText("DRE Sul")).toBeInTheDocument();
        expect(screen.getByText("EMEF Escola Teste 1")).toBeInTheDocument();
        expect(screen.getByText("EMEF Escola Teste 2")).toBeInTheDocument();
    });

    it("deve exibir coluna Nome da UE mas não DRE para perfil Ponto Focal", async () => {
        (useUserPermissions as Mock).mockReturnValue({
            isGipe: false,
            isPontoFocal: true,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });

        (useOcorrencias as Mock).mockReturnValue({
            data: sampleData,
            isLoading: false,
        });

        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(screen.getByText("P0001")).toBeInTheDocument();
        });

        expect(screen.queryByText("DRE")).not.toBeInTheDocument();
        expect(screen.getByText("Nome da UE")).toBeInTheDocument();

        expect(screen.getByText("EMEF Escola Teste 1")).toBeInTheDocument();
        expect(screen.getByText("EMEF Escola Teste 2")).toBeInTheDocument();
    });

    it("deve filtrar corretamente quando dre é undefined", async () => {
        const dataComDreUndefined = [
            {
                protocolo: "P0003",
                dataHora: "2025-09-03 12:00",
                codigoEol: "EOL3",
                nomeUe: "EMEF Escola Teste 3",
                tipoOcorrencia: "Física",
                status: "Incompleta",
                id: "3",
                uuid: "uuid-test-3",
            },
            {
                protocolo: "P0004",
                dataHora: "2025-09-04 13:00",
                codigoEol: "EOL4",
                dre: "DRE Norte",
                nomeUe: "EMEF Escola Teste 4",
                tipoOcorrencia: "Psicológica",
                status: "Finalizada",
                id: "4",
                uuid: "uuid-test-4",
            },
        ];

        (useOcorrencias as Mock).mockReturnValue({
            data: dataComDreUndefined,
            isLoading: false,
        });

        const user = userEvent.setup();
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(screen.getByText("P0003")).toBeInTheDocument();
        });

        await user.click(screen.getByRole("button", { name: /Filtrar/i }));

        const codigoInput = screen.getByLabelText(/Código EOL/i);
        await user.type(codigoInput, "EOL3");

        const botoesFiltrar = screen.getAllByRole("button", {
            name: /Filtrar/i,
        });
        const botaoFiltrarDoPainel = botoesFiltrar.at(-1);
        await user.click(botaoFiltrarDoPainel!);

        await waitFor(() => {
            expect(screen.getByText("P0003")).toBeInTheDocument();
            expect(screen.queryByText("P0004")).not.toBeInTheDocument();
        });
    });

    it("deve filtrar corretamente quando nomeUe é undefined", async () => {
        const dataComNomeUeUndefined = [
            {
                protocolo: "P0005",
                dataHora: "2025-09-05 14:00",
                codigoEol: "EOL5",
                dre: "DRE Leste",
                tipoOcorrencia: "Psicológica",
                status: "Finalizada",
                id: "5",
                uuid: "uuid-test-5",
            },
            {
                protocolo: "P0006",
                dataHora: "2025-09-06 15:00",
                codigoEol: "EOL6",
                dre: "DRE Oeste",
                nomeUe: "EMEF Escola Teste 6",
                tipoOcorrencia: "Física",
                status: "Incompleta",
                id: "6",
                uuid: "uuid-test-6",
            },
        ];

        (useOcorrencias as Mock).mockReturnValue({
            data: dataComNomeUeUndefined,
            isLoading: false,
        });

        const user = userEvent.setup();
        renderWithQueryProvider(<TabelaOcorrencias />);

        await waitFor(() => {
            expect(screen.getByText("P0005")).toBeInTheDocument();
        });

        await user.click(screen.getByRole("button", { name: /Filtrar/i }));

        const codigoInput = screen.getByLabelText(/Código EOL/i);
        await user.type(codigoInput, "EOL5");

        const botoesFiltrar = screen.getAllByRole("button", {
            name: /Filtrar/i,
        });
        const botaoFiltrarDoPainel = botoesFiltrar.at(-1);
        await user.click(botaoFiltrarDoPainel!);

        await waitFor(() => {
            expect(screen.getByText("P0005")).toBeInTheDocument();
            expect(screen.queryByText("P0006")).not.toBeInTheDocument();
        });
    });
});
