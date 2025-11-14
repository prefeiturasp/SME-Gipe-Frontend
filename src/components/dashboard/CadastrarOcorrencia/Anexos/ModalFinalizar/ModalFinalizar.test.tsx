import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalFinalizar from "./ModalFinalizar";
import userEvent from "@testing-library/user-event";

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

    it("Renderiza o modal corretamente", () => {
        setup();

        expect(
            screen.getByText("Finalizar ocorrência")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Você está finalizando a intercorrência/i)
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

    it("Mostra o botão 'Fechar' após finalizar", async () => {
        setup();

        const input = screen.getByTestId("input-motivo");

        await userEvent.type(input, "Motivo correto de encerramento");

        const finalizar = screen.getByRole("button", { name: /Finalizar/i });

        await userEvent.click(finalizar);

        expect(
            await screen.findByRole("button", { name: "Fechar" })
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

    it("Chama handleClose ao clicar em Fechar após sucesso", async () => {
        const onOpenChange = vi.fn();
        render(<ModalFinalizar open={true} onOpenChange={onOpenChange} />);

        const textarea = screen.getByTestId("input-motivo");
        await userEvent.type(textarea, "Motivo válido para encerramento");

        // envia o formulário
        const finalizarButton = screen.getByRole("button", { name: /finalizar/i });
        await userEvent.click(finalizarButton);

        // agora existe o botão "Fechar"
        const fecharButton = await screen.findByRole("button", { name: /fechar/i });

        await userEvent.click(fecharButton);

        // handleClose deve ter sido chamado com "false"
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });


});
