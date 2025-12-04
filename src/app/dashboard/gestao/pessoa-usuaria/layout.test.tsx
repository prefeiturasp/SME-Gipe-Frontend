import { render, screen } from "@testing-library/react";
import GestaoLayout from "./layout";
describe("GestaoLayout", () => {
    it("renderiza o header e o children corretamente", () => {
        render(
            <GestaoLayout>
                <div data-testid="child">Conteúdo Gestão</div>
            </GestaoLayout>
        );
        const child = screen.getByTestId("child");
        expect(child).toBeInTheDocument();
        const pageHeader = screen.getByText("Gestão de usuários");
        expect(pageHeader).toBeInTheDocument();
        const header = screen.getByText("Cadastrar pessoa usuária");
        expect(header).toBeInTheDocument();
    });
});
