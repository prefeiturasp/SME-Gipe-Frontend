import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ListaDeUsuariosPendenciasAprovacao from ".";

import { usuariosMock } from "@/components/mocks/usuarios-mock";

function renderComponent(
    props?: Partial<React.ComponentProps<typeof ListaDeUsuariosPendenciasAprovacao>>,
) {
    return render(
        <ListaDeUsuariosPendenciasAprovacao
            usuarios={usuariosMock}
            {...props}
        />,
    );
}

describe("ListaDeUsuariosPendenciasAprovacao", () => {
    beforeEach(() => {
        vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renderiza a lista de usuários com pendências de aprovação", () => {
        renderComponent();
        const usuarioNome = screen.getByText("Maria Oliveira");
        expect(usuarioNome).toBeInTheDocument();
        const aprovarButtons = screen.getAllByText("Aprovar");
        expect(aprovarButtons.length).toBeGreaterThan(0);
        const recusarButtons = screen.getAllByText("Recusar");
        expect(recusarButtons.length).toBeGreaterThan(0);
    });

    it("deve chamar onAprovar quando o botão Aprovar for clicado", async () => {
        const user = userEvent.setup();
        renderComponent();

        const aprovarButtons = screen.getAllByText("Aprovar");
        await user.click(aprovarButtons[0]);

        expect(console.log).toHaveBeenCalledWith(
            "Aprovado:",
            expect.objectContaining({
                nome: "João Silva",
                email: "joao.silva@example.com"
            })
        );
    });

    it("deve chamar onRecusar quando o botão Recusar for clicado", async () => {
        const user = userEvent.setup();
        renderComponent();

        const recusarButtons = screen.getAllByText("Recusar");
        await user.click(recusarButtons[0]);

        expect(console.log).toHaveBeenCalledWith(
            "Recusado:",
            expect.objectContaining({
                nome: "João Silva",
                email: "joao.silva@example.com"
            })
        );
    });

    it("deve aprovar o usuário correto quando houver múltiplos usuários", async () => {
        const user = userEvent.setup();
        renderComponent();

        const aprovarButtons = screen.getAllByText("Aprovar");
        await user.click(aprovarButtons[1]);

        expect(console.log).toHaveBeenCalledWith(
            "Aprovado:",
            expect.objectContaining({
                nome: "Maria Oliveira",
                email: "maria.oliveira@example.com"
            })
        );
    });

    it("deve recusar o usuário correto quando houver múltiplos usuários", async () => {
        const user = userEvent.setup();
        renderComponent();

        const recusarButtons = screen.getAllByText("Recusar");
        await user.click(recusarButtons[1]);

        expect(console.log).toHaveBeenCalledWith(
            "Recusado:",
            expect.objectContaining({
                nome: "Maria Oliveira",
                email: "maria.oliveira@example.com"
            })
        );
    });

    it("não deve renderizar CardUsuariosPendenciasAprovacao quando usuarios é undefined", () => {
        renderComponent({ usuarios: undefined });

        // Verifica que os botões de aprovar/recusar não existem
        expect(screen.queryByText("Aprovar")).not.toBeInTheDocument();
        expect(screen.queryByText("Recusar")).not.toBeInTheDocument();
    });

    it("não deve renderizar CardUsuariosPendenciasAprovacao quando usuarios é array vazio", () => {
        renderComponent({ usuarios: [] });

        // Verifica que os botões de aprovar/recusar não existem
        expect(screen.queryByText("Aprovar")).not.toBeInTheDocument();
        expect(screen.queryByText("Recusar")).not.toBeInTheDocument();
    });
});
