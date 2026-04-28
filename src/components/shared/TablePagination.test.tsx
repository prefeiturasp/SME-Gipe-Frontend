import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TablePagination from "./TablePagination";

function renderPagination(
    pageIndex: number,
    pageCount: number,
    onPageChange = vi.fn(),
) {
    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < pageCount - 1;
    return render(
        <TablePagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            onPageChange={onPageChange}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
        />,
    );
}

describe("TablePagination", () => {
    describe("exibição de páginas", () => {
        it("deve exibir todos os botões quando pageCount é 7 ou menos", () => {
            renderPagination(0, 7);
            for (let i = 1; i <= 7; i++) {
                expect(
                    screen.getByRole("button", { name: String(i) }),
                ).toBeInTheDocument();
            }
            expect(screen.queryByText("...")).not.toBeInTheDocument();
        });

        it("deve exibir ellipsis quando há muitas páginas e o cursor está no início", () => {
            renderPagination(0, 20);
            expect(
                screen.getByRole("button", { name: "1" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "2" }),
            ).toBeInTheDocument();
            expect(screen.getByText("...")).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "20" }),
            ).toBeInTheDocument();
        });

        it("deve exibir ellipsis dos dois lados quando o cursor está no meio", () => {
            renderPagination(9, 20);
            expect(
                screen.getByRole("button", { name: "1" }),
            ).toBeInTheDocument();
            expect(screen.getAllByText("...")).toHaveLength(2);
            expect(
                screen.getByRole("button", { name: "20" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "10" }),
            ).toBeInTheDocument();
        });

        it("deve exibir ellipsis apenas no início quando o cursor está no final", () => {
            renderPagination(19, 20);
            expect(
                screen.getByRole("button", { name: "1" }),
            ).toBeInTheDocument();
            expect(screen.getByText("...")).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "19" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "20" }),
            ).toBeInTheDocument();
        });

        it("deve preencher gap de exatamente 2 com a página intermediária, sem ellipsis", () => {
            renderPagination(3, 20);
            expect(
                screen.getByRole("button", { name: "2" }),
            ).toBeInTheDocument();
            expect(screen.getAllByText("...")).toHaveLength(1);
        });
    });

    describe("navegação", () => {
        it("deve chamar onPageChange com índice decrementado ao clicar em anterior", async () => {
            const onPageChange = vi.fn();
            const user = userEvent.setup();
            render(
                <TablePagination
                    pageIndex={2}
                    pageCount={5}
                    onPageChange={onPageChange}
                    canPreviousPage={true}
                    canNextPage={true}
                />,
            );
            await user.click(screen.getByTestId("prev-page-button"));
            expect(onPageChange).toHaveBeenCalledWith(1);
        });

        it("deve chamar onPageChange com índice incrementado ao clicar em próximo", async () => {
            const onPageChange = vi.fn();
            const user = userEvent.setup();
            render(
                <TablePagination
                    pageIndex={2}
                    pageCount={5}
                    onPageChange={onPageChange}
                    canPreviousPage={true}
                    canNextPage={true}
                />,
            );
            await user.click(screen.getByTestId("next-page-button"));
            expect(onPageChange).toHaveBeenCalledWith(3);
        });

        it("deve chamar onPageChange com o índice correto ao clicar em número de página", async () => {
            const onPageChange = vi.fn();
            const user = userEvent.setup();
            renderPagination(0, 5, onPageChange);
            await user.click(screen.getByRole("button", { name: "3" }));
            expect(onPageChange).toHaveBeenCalledWith(2);
        });

        it("deve desabilitar botão anterior na primeira página", () => {
            renderPagination(0, 5);
            expect(screen.getByTestId("prev-page-button")).toBeDisabled();
        });

        it("deve desabilitar botão próximo na última página", () => {
            renderPagination(4, 5);
            expect(screen.getByTestId("next-page-button")).toBeDisabled();
        });

        it("deve habilitar ambos os botões em página intermediária", () => {
            renderPagination(2, 5);
            expect(screen.getByTestId("prev-page-button")).not.toBeDisabled();
            expect(screen.getByTestId("next-page-button")).not.toBeDisabled();
        });
    });

    describe("pageCount = 1", () => {
        it("deve desabilitar ambos os botões com apenas uma página", () => {
            renderPagination(0, 1);
            expect(screen.getByTestId("prev-page-button")).toBeDisabled();
            expect(screen.getByTestId("next-page-button")).toBeDisabled();
        });
    });
});
