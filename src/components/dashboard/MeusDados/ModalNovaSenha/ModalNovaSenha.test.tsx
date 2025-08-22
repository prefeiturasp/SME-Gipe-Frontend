import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import ModalNovaSenha from "./ModalNovaSenha";

describe("ModalNovaSenha", () => {
    const defaultProps = {
        open: true,
        onOpenChange: vi.fn(),
        onSalvar: vi.fn(),
        loading: false,
        erroGeral: null,
    };

    it("renderiza os campos de senha na ordem correta", () => {
        render(<ModalNovaSenha {...defaultProps} />);
        expect(
            screen.getByPlaceholderText("Digite a senha atual")
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Digite a nova senha")
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Digite a nova senha novamente")
        ).toBeInTheDocument();
    });

    it("exibe critérios de senha e separa os de 'NÃO deve conter'", () => {
        render(<ModalNovaSenha {...defaultProps} />);
        expect(
            screen.getByText(/a nova senha deve conter/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/a nova senha não deve conter/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/uma letra maiúscula/i)).toBeInTheDocument();
        expect(screen.getByText(/espaço em branco/i)).toBeInTheDocument();
    });

    it("habilita botão Salvar senha apenas quando todos critérios estão ok", async () => {
        render(<ModalNovaSenha {...defaultProps} />);
        const user = userEvent.setup();
        await user.type(
            screen.getByPlaceholderText("Digite a senha atual"),
            "Senha@123"
        );
        await user.type(
            screen.getByPlaceholderText("Digite a nova senha"),
            "Senha@123"
        );
        await user.type(
            screen.getByPlaceholderText("Digite a nova senha novamente"),
            "Senha@123"
        );
        expect(
            screen.getByRole("button", { name: /salvar senha/i })
        ).toBeEnabled();
    });

    it("exibe erro de confirmação quando as senhas não coincidem", async () => {
        render(<ModalNovaSenha {...defaultProps} />);
        const user = userEvent.setup();
        await user.type(
            screen.getByPlaceholderText("Digite a nova senha"),
            "Senha@123"
        );
        await user.type(
            screen.getByPlaceholderText("Digite a nova senha novamente"),
            "SenhaErrada"
        );
        expect(
            screen.getByText(/as senhas não coincidem/i)
        ).toBeInTheDocument();
    });

    it("chama onSalvar ao submeter o formulário com dados válidos", async () => {
        const onSalvar = vi.fn();
        render(<ModalNovaSenha {...defaultProps} onSalvar={onSalvar} />);
        const user = userEvent.setup();
        await user.type(
            screen.getByPlaceholderText("Digite a senha atual"),
            "Senha@123"
        );
        await user.type(
            screen.getByPlaceholderText("Digite a nova senha"),
            "Senha@123"
        );
        await user.type(
            screen.getByPlaceholderText("Digite a nova senha novamente"),
            "Senha@123"
        );
        await user.click(screen.getByRole("button", { name: /salvar senha/i }));
        await waitFor(() => {
            expect(onSalvar).toHaveBeenCalledWith({
                senhaAtual: "Senha@123",
                novaSenha: "Senha@123",
            });
        });
    });

    it("exibe erro geral quando passado via prop", () => {
        render(<ModalNovaSenha {...defaultProps} erroGeral="Erro ao salvar" />);
        expect(screen.getByText(/erro ao salvar/i)).toBeInTheDocument();
    });

    it("exibe o ícone de erro (CloseCheck) quando algum critério não é atendido", async () => {
        render(<ModalNovaSenha {...defaultProps} />);
        const user = userEvent.setup();
        await user.type(
            screen.getByPlaceholderText("Digite a senha atual"),
            "Senha@123"
        );
        await user.type(
            screen.getByPlaceholderText("Digite a nova senha"),
            "abcá"
        );
        await user.type(
            screen.getByPlaceholderText("Digite a nova senha novamente"),
            "abcá"
        );
        const closeCheckIcons = screen.getAllByTestId("close-check-icon");
        expect(closeCheckIcons.length).toBeGreaterThan(0);
    });

    it("alterna visibilidade da senha ao clicar no botão de exibir senha", async () => {
        render(<ModalNovaSenha {...defaultProps} />);
        const user = userEvent.setup();
        // Botão de exibir senha atual
        const btnShowOld = screen
            .getAllByRole("button")
            .find((btn) => btn.innerHTML.includes("svg"));
        const inputOld = screen.getByPlaceholderText("Digite a senha atual");
        expect(inputOld).toHaveAttribute("type", "password");
        if (btnShowOld) {
            await user.click(btnShowOld);
            expect(inputOld).toHaveAttribute("type", "text");
        }
    });

    it("chama onOpenChange ao clicar no botão Cancelar", async () => {
        const onOpenChange = vi.fn();
        render(
            <ModalNovaSenha {...defaultProps} onOpenChange={onOpenChange} />
        );
        const user = userEvent.setup();
        const btnCancelar = screen.getByRole("button", { name: /cancelar/i });
        await user.click(btnCancelar);
        expect(onOpenChange).toHaveBeenCalled();
    });
});
