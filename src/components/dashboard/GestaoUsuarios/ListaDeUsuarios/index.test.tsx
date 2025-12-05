import { render, screen } from "@testing-library/react";
import ListaDeUsuarios from ".";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function renderWithQueryProvider(ui: React.ReactElement) {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
}

describe("ListaDeUsuarios", () => {
    it("renderiza a lista de usuários com status ativos", () => {
        renderWithQueryProvider(<ListaDeUsuarios status="ativos" />);
        const statusText = screen.getByText("Exibindo o Status: ativos");
        expect(statusText).toBeInTheDocument();
        const usuarioNome = screen.getByText("Maria Oliveira");
        expect(usuarioNome).toBeInTheDocument();
    });

    it("renderiza a lista de usuários com status inativos", () => {
        renderWithQueryProvider(<ListaDeUsuarios status="inativos" />);
        const statusText = screen.getByText("Exibindo o Status: inativos");
        expect(statusText).toBeInTheDocument();
        const usuarioNome = screen.getByText("Maria Oliveira");
        expect(usuarioNome).toBeInTheDocument();
    });
});
