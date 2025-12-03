import { render, screen } from "@testing-library/react";
import ListaDeUsuarios from ".";
describe("ListaDeUsuarios", () => {
    it("renderiza a lista de usuários com status ativos", () => {
        render(<ListaDeUsuarios status="ativos" />);
        const statusText = screen.getByText("Exibindo o Status: ativos");
        expect(statusText).toBeInTheDocument();
        const usuarioNome = screen.getByText("Maria Oliveira");
        expect(usuarioNome).toBeInTheDocument();
    });

    it("renderiza a lista de usuários com status inativos", () => {
        render(<ListaDeUsuarios status="inativos" />);
        const statusText = screen.getByText("Exibindo o Status: inativos");
        expect(statusText).toBeInTheDocument();
        const usuarioNome = screen.getByText("Maria Oliveira");
        expect(usuarioNome).toBeInTheDocument();
    });
});
