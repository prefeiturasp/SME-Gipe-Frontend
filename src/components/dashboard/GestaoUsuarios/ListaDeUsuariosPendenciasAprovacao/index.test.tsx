import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ListaDeUsuariosPendenciasAprovacao from ".";

const mockToast = vi.fn();
vi.mock("@/components/ui/headless-toast", () => ({
    toast: (params: unknown) => mockToast(params),
}));

import { usuariosMock } from "@/components/mocks/usuarios-mock";

vi.mock("@/hooks/useAprovarUsuarioGestao", () => ({
    useAprovarUsuarioGestao: () => ({
        mutateAsync: async () => ({ success: true }),
        isPending: false,
    }),
}));

function renderComponent(
    props?: Partial<
        React.ComponentProps<typeof ListaDeUsuariosPendenciasAprovacao>
    >
) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return render(
        <QueryClientProvider client={queryClient}>
            <ListaDeUsuariosPendenciasAprovacao
                usuarios={usuariosMock}
                {...props}
            />
        </QueryClientProvider>
    );
}

describe("ListaDeUsuariosPendenciasAprovacao", () => {
    beforeEach(() => {
        vi.spyOn(console, "log").mockImplementation(() => {});
        mockToast.mockClear();
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

        expect(screen.getByText("Aprovação de perfil")).toBeInTheDocument();

        const confirmarBtn = screen.getByRole("button", {
            name: /Aprovar perfil/i,
        });
        await user.click(confirmarBtn);

        expect(
            screen.queryByText("Aprovação de perfil")
        ).not.toBeInTheDocument();
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
                email: "joao.silva@example.com",
            })
        );
    });

    it("deve aprovar o usuário correto quando houver múltiplos usuários", async () => {
        const user = userEvent.setup();
        renderComponent();

        const aprovarButtons = screen.getAllByText("Aprovar");
        await user.click(aprovarButtons[1]);

        expect(screen.getByText("Aprovação de perfil")).toBeInTheDocument();

        const confirmarBtn = screen.getByRole("button", {
            name: /Aprovar perfil/i,
        });
        await user.click(confirmarBtn);

        expect(
            screen.queryByText("Aprovação de perfil")
        ).not.toBeInTheDocument();
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
                email: "maria.oliveira@example.com",
            })
        );
    });

    it("não deve renderizar CardUsuariosPendenciasAprovacao quando usuarios é undefined", () => {
        renderComponent({ usuarios: undefined });

        expect(screen.queryByText("Aprovar")).not.toBeInTheDocument();
        expect(screen.queryByText("Recusar")).not.toBeInTheDocument();
    });

    it("não deve renderizar CardUsuariosPendenciasAprovacao quando usuarios é array vazio", () => {
        renderComponent({ usuarios: [] });

        expect(screen.queryByText("Aprovar")).not.toBeInTheDocument();
        expect(screen.queryByText("Recusar")).not.toBeInTheDocument();
    });

    it("mostra toast de sucesso quando a aprovação for bem sucedida", async () => {
        const user = userEvent.setup();
        renderComponent();

        const aprovarButtons = screen.getAllByText("Aprovar");
        await user.click(aprovarButtons[0]);

        const confirmarBtn = screen.getByRole("button", {
            name: /Aprovar perfil/i,
        });
        await user.click(confirmarBtn);

        expect(mockToast).toHaveBeenCalledWith(
            expect.objectContaining({ title: "Tudo certo por aqui!" })
        );
    });

    it("mostra toast de erro quando a requisição falha", async () => {
        const hook = await import("@/hooks/useAprovarUsuarioGestao");
        vi.spyOn(hook, "useAprovarUsuarioGestao").mockReturnValue({
            mutateAsync: async () => ({ success: false, error: "Falha geral" }),
            isPending: false,
        } as unknown as ReturnType<typeof hook.useAprovarUsuarioGestao>);

        const user = userEvent.setup();
        renderComponent();

        const aprovarButtons = screen.getAllByText("Aprovar");
        await user.click(aprovarButtons[0]);

        const confirmarBtn = screen.getByRole("button", {
            name: /Aprovar perfil/i,
        });
        await user.click(confirmarBtn);

        expect(mockToast).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Não conseguimos concluir a ação!",
            })
        );
    });

    it("mostra mensagem padrão de erro quando não houver error na resposta", async () => {
        const hook = await import("@/hooks/useAprovarUsuarioGestao");
        vi.spyOn(hook, "useAprovarUsuarioGestao").mockReturnValue({
            mutateAsync: async () => ({ success: false }),
            isPending: false,
        } as unknown as ReturnType<typeof hook.useAprovarUsuarioGestao>);

        const user = userEvent.setup();
        renderComponent();

        const aprovarButtons = screen.getAllByText("Aprovar");
        await user.click(aprovarButtons[0]);

        const confirmarBtn = screen.getByRole("button", {
            name: /Aprovar perfil/i,
        });
        await user.click(confirmarBtn);

        expect(mockToast).toHaveBeenCalledWith(
            expect.objectContaining({
                description: "Erro ao aprovar usuário.",
            })
        );
    });

    it("deve fechar o modal e limpar o estado quando onOpenChange for disparado", async () => {
        const user = userEvent.setup();
        renderComponent();

        const aprovarButtons = screen.getAllByText("Aprovar");
        await user.click(aprovarButtons[0]);
        expect(screen.getByText("Aprovação de perfil")).toBeInTheDocument();

        const cancelarBtn = screen.getByRole("button", { name: /cancelar/i });
        await user.click(cancelarBtn);

        expect(
            screen.queryByText("Aprovação de perfil")
        ).not.toBeInTheDocument();
    });
});
