import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalFinalizar from "./ModalFinalizar";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => ({ get: () => null }),
    useParams: () => ({}),
    redirect: vi.fn(),
    notFound: vi.fn(),
}));


describe("ModalFinalizarEtapa", () => {
    const onOpenChange = vi.fn();

    function setup(open = true) {
        return render(
            <ModalFinalizar open={open} onOpenChange={onOpenChange} />
        );
    }

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Renderiza o modal corretamente na primeira fase", () => {
        setup();

        expect(
            screen.getByText("Conclusão de etapa")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Você está finalizando esta etapa da intercorrência/i)
        ).toBeInTheDocument();

        expect(screen.getByTestId("input-motivo")).toBeInTheDocument();
    });

    it("Mostra erro ao tentar enviar com texto insuficiente", async () => {
        setup();

        const input = screen.getByTestId("input-motivo");
        const button = screen.getByRole("button", { name: /Finalizar/i });

        await userEvent.type(input, "oi");

        expect(button).toBeDisabled();

        fireEvent.click(button);

        expect(
            await screen.findByText("O motivo deve ter pelo menos 5 caracteres.")
        ).toBeInTheDocument();
    });

    it("Habilita o botão quando o texto é válido", async () => {
        setup();

        const input = screen.getByTestId("input-motivo");
        const button = screen.getByRole("button", { name: /Finalizar/i });

        await userEvent.type(input, "Motivo válido para finalizar");

        await waitFor(() => {
            expect(button).toBeEnabled();
        });
    });

    it("Mostra a segunda fase após finalizar", async () => {
        setup();

        const input = screen.getByTestId("input-motivo");

        await userEvent.type(input, "Motivo correto de encerramento");

        const finalizar = screen.getByRole("button", { name: /Finalizar/i });
        await userEvent.click(finalizar);

        expect(
            await screen.findByText("Ocorrência registrada com sucesso!")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Protocolo da intercorrência:/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText("GIPE-2025/0042")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Marcus Paulo de Souza Andrade")
        ).toBeInTheDocument();
    });

    it("Renderiza a frase final na segunda fase", async () => {
        setup();

        const input = screen.getByTestId("input-motivo");
        await userEvent.type(input, "Algum motivo válido");

        const finalizar = screen.getByRole("button", { name: /Finalizar/i });
        await userEvent.click(finalizar);

        expect(
            await screen.findByText(
                "Esta justificativa será registrada permanentemente no histórico da intercorrência."
            )
        ).toBeInTheDocument();
    });

    it("Chama onOpenChange(false) ao clicar em 'Voltar'", async () => {
        setup();

        const botaoVoltar = screen.getByRole("button", { name: /Voltar/i });

        await userEvent.click(botaoVoltar);

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("Reseta formulário ao fechar o modal", async () => {
        const { unmount } = setup();

        const input = screen.getByTestId("input-motivo");

        await userEvent.type(input, "Algum texto válido");

        const botaoVoltar = screen.getByRole("button", { name: /Voltar/i });
        await userEvent.click(botaoVoltar);

        unmount();

        setup();

        expect(screen.getByTestId("input-motivo")).toHaveValue("");
    });

    it("Chama onOpenChange(false) ao clicar em Fechar na segunda fase", async () => {
        const onOpenChangeMock = vi.fn();
        render(<ModalFinalizar open={true} onOpenChange={onOpenChangeMock} />);

        const textarea = screen.getByTestId("input-motivo");
        await userEvent.type(textarea, "Motivo válido para encerramento");

        const finalizarButton = screen.getByRole("button", { name: /finalizar/i });
        await userEvent.click(finalizarButton);

        const fecharButton = await screen.findByRole("button", { name: /fechar/i });

        await userEvent.click(fecharButton);

        expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });

    it("redireciona para /dashboard ao clicar em Fechar", async () => {
        const onOpenChange = vi.fn();

        render(<ModalFinalizar open={true} onOpenChange={onOpenChange} />);

        const input = screen.getByTestId("input-motivo");
        await userEvent.type(input, "motivo válido");

        const finalizar = screen.getByRole("button", { name: /finalizar/i });
        await userEvent.click(finalizar);

        const fechar = await screen.findByRole("button", { name: /fechar/i });
        await userEvent.click(fechar);

        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });


});
