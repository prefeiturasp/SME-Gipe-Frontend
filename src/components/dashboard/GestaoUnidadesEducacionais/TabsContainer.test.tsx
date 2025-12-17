import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TabsContainer from "@/components/dashboard/GestaoUnidadesEducacionais/TabsContainer";

vi.mock("@/components/dashboard/GestaoUnidadesEducacionais/ListaDeUnidadesEducacionais", () => ({
    __esModule: true,
    default: ({ status }: { status: "ativas" | "inativas" }) => {
        return (
            <div data-testid={`lista-unidades-${status}`}>
                Exibindo o status: {status}
            </div>
        );
    },
}));

describe("TabsContainer", () => {
    it("deve renderizar as abas corretamente", () => {
        render(<TabsContainer />);

        expect(
            screen.getByRole("tab", {
                name: /Unidades Educacionais ativas/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("tab", {
                name: /Unidades Educacionais inativas/i,
            })
        ).toBeInTheDocument();
    });

    it("deve alternar entre as abas ao clicar nos gatilhos", async () => {
        render(<TabsContainer />);
        const user = userEvent.setup();

        const abaAtivas = screen.getByRole("tab", {
            name: /Unidades Educacionais ativas/i,
        });
        const abaInativas = screen.getByRole("tab", {
            name: /Unidades Educacionais inativas/i,
        });

        // Verifica se a aba "ativas" está ativa por padrão
        expect(
            screen.getByTestId("lista-unidades-ativas")
        ).toBeInTheDocument();

        // Clica na aba "inativas"
        await user.click(abaInativas);

        // Verifica se a aba "inativas" está ativa
        expect(
            screen.getByTestId("lista-unidades-inativas")
        ).toBeInTheDocument();

        // Clica novamente na aba "ativas"
        await user.click(abaAtivas);

        // Verifica se a aba "ativas" está ativa novamente
        expect(
            screen.getByTestId("lista-unidades-ativas")
        ).toBeInTheDocument();
    });
});
