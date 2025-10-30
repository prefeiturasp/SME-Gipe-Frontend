import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOcorrenciasColumns } from "./useOcorrenciasColumns";
import { Ocorrencia } from "@/types/ocorrencia";
import type { Row, Column, Table, Cell } from "@tanstack/react-table";

vi.mock("@/hooks/useUserPermissions", () => ({
    useUserPermissions: vi.fn(() => ({
        isGipe: true,
        isPontoFocal: false,
        isAssistenteOuDiretor: false,
    })),
}));

const renderWithQueryProvider = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return {
        queryClient,
        ...render(ui, {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            ),
        }),
    };
};

const TestActionColumn = ({ uuid }: { uuid: string }) => {
    const columns = useOcorrenciasColumns();
    const acaoColumn = columns.find((col) => col.id === "acao");

    if (!acaoColumn || !acaoColumn.cell) {
        return <div>Coluna não encontrada</div>;
    }

    const mockRow = {
        original: { uuid } as Ocorrencia,
        getValue: vi.fn(),
    } as unknown as Row<Ocorrencia>;

    const CellComponent =
        typeof acaoColumn.cell === "function"
            ? acaoColumn.cell
            : () => <div>Invalid cell</div>;

    return (
        <div>
            {CellComponent({
                row: mockRow,
                column: {} as Column<Ocorrencia>,
                table: {} as Table<Ocorrencia>,
                cell: {} as Cell<Ocorrencia, unknown>,
                getValue: vi.fn(),
                renderValue: vi.fn(),
            })}
        </div>
    );
};

describe("useOcorrenciasColumns", () => {
    describe("Coluna de Ação", () => {
        it("deve invalidar o cache da ocorrência ao clicar no botão de visualizar", async () => {
            const uuid = "test-uuid-123";
            const { queryClient } = renderWithQueryProvider(
                <TestActionColumn uuid={uuid} />
            );

            const invalidateQueriesSpy = vi.spyOn(
                queryClient,
                "invalidateQueries"
            );

            const visualizarButton = screen.getByRole("link", {
                name: /Visualizar/i,
            });

            const user = userEvent.setup();
            await user.click(visualizarButton);

            expect(invalidateQueriesSpy).toHaveBeenCalledWith({
                queryKey: ["ocorrencia", uuid],
            });
        });

        it("deve renderizar o link com o uuid correto", () => {
            const uuid = "test-uuid-456";
            renderWithQueryProvider(<TestActionColumn uuid={uuid} />);

            const visualizarLink = screen.getByRole("link", {
                name: /Visualizar/i,
            });

            expect(visualizarLink).toHaveAttribute(
                "href",
                `/dashboard/cadastrar-ocorrencia/${uuid}`
            );
        });

        it("deve renderizar o ícone de search", () => {
            const uuid = "test-uuid-789";
            renderWithQueryProvider(<TestActionColumn uuid={uuid} />);

            const visualizarButton = screen.getByRole("link", {
                name: /Visualizar/i,
            });

            expect(visualizarButton).toBeInTheDocument();
            expect(screen.getByText("Visualizar")).toBeInTheDocument();
        });
    });
});
