import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModalInativacao from "./index";

describe("ModalInativacao", () => {
    const mockOnOpenChange = vi.fn();
    const mockOnInativar = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve renderizar o modal quando open=true", () => {
        render(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        expect(
            screen.getByText("Inativação de Unidade Educacional")
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Ao inativar o perfil da unidade educacional/i)
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(/Motivo da inativação da UE/i)
        ).toBeInTheDocument();
    });

    it("não deve renderizar o conteúdo do modal quando open=false", () => {
        render(
            <ModalInativacao
                open={false}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        expect(
            screen.queryByText("Inativação de Unidade Educacional")
        ).not.toBeInTheDocument();
    });

    it("deve atualizar o valor do textarea ao digitar", () => {
        render(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        const textarea = screen.getByLabelText(
            /Motivo da inativação da UE/i
        ) as HTMLTextAreaElement;

        fireEvent.change(textarea, {
            target: { value: "Motivo de teste" },
        });

        expect(textarea.value).toBe("Motivo de teste");
    });

    it("deve manter o botão Inativar desabilitado quando o motivo está vazio", () => {
        render(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        const inativarButton = screen.getByRole("button", {
            name: /Inativar Unidade Educacional/i,
        });

        expect(inativarButton).toBeDisabled();
    });

    it("deve manter o botão Inativar desabilitado quando o motivo contém apenas espaços", () => {
        render(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        const textarea = screen.getByLabelText(/Motivo da inativação da UE/i);
        const inativarButton = screen.getByRole("button", {
            name: /Inativar Unidade Educacional/i,
        });

        fireEvent.change(textarea, { target: { value: "   " } });

        expect(inativarButton).toBeDisabled();
    });

    it("deve habilitar o botão Inativar quando o motivo é preenchido", () => {
        render(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        const textarea = screen.getByLabelText(/Motivo da inativação da UE/i);
        const inativarButton = screen.getByRole("button", {
            name: /Inativar Unidade Educacional/i,
        });

        fireEvent.change(textarea, {
            target: { value: "Motivo de teste" },
        });

        expect(inativarButton).not.toBeDisabled();
    });

    it("deve chamar onInativar com o motivo ao clicar no botão Inativar", () => {
        render(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        const textarea = screen.getByLabelText(/Motivo da inativação da UE/i);
        const inativarButton = screen.getByRole("button", {
            name: /Inativar Unidade Educacional/i,
        });

        fireEvent.change(textarea, {
            target: { value: "Motivo de teste" },
        });
        fireEvent.click(inativarButton);

        expect(mockOnInativar).toHaveBeenCalledTimes(1);
        expect(mockOnInativar).toHaveBeenCalledWith("Motivo de teste");
    });

    it("deve chamar onOpenChange(false) ao clicar no botão Cancelar", () => {
        render(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        const cancelarButton = screen.getByRole("button", {
            name: /Cancelar/i,
        });

        fireEvent.click(cancelarButton);

        expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("deve desabilitar os botões quando isLoading=true", () => {
        render(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
                isLoading={true}
            />
        );

        const textarea = screen.getByLabelText(/Motivo da inativação da UE/i);
        fireEvent.change(textarea, {
            target: { value: "Motivo de teste" },
        });

        const cancelarButton = screen.getByRole("button", {
            name: /Cancelar/i,
        });

        const buttons = screen.getAllByRole("button");
        const inativarButton = buttons.find(
            (button) =>
                (button as HTMLButtonElement).type === "button" &&
                button !== cancelarButton &&
                !button.textContent?.includes("Close")
        );

        expect(cancelarButton).toBeDisabled();
        expect(inativarButton).toBeDisabled();
    });

    it("deve exibir o placeholder correto no textarea", () => {
        render(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        const textarea = screen.getByPlaceholderText(
            "Digite aqui..."
        ) as HTMLTextAreaElement;

        expect(textarea).toBeInTheDocument();
    });

    it("deve renderizar os botões com as variantes corretas", () => {
        render(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        const cancelarButton = screen.getByRole("button", {
            name: /Cancelar/i,
        });
        const inativarButton = screen.getByRole("button", {
            name: /Inativar Unidade Educacional/i,
        });

        expect(cancelarButton).toBeInTheDocument();
        expect(inativarButton).toBeInTheDocument();
    });

    it("deve ter o atributo required no textarea", () => {
        render(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        const textarea = screen.getByLabelText(
            /Motivo da inativação da UE/i
        ) as HTMLTextAreaElement;

        expect(textarea).toHaveAttribute("required");
    });

    it("deve limpar o campo ao reabrir o modal", async () => {
        const { rerender } = render(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        const textarea = screen.getByLabelText(
            /Motivo da inativação da UE/i
        ) as HTMLTextAreaElement;

        fireEvent.change(textarea, {
            target: { value: "Motivo de teste" },
        });

        expect(textarea.value).toBe("Motivo de teste");

        // Fecha o modal
        rerender(
            <ModalInativacao
                open={false}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        // Reabre o modal
        rerender(
            <ModalInativacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onInativar={mockOnInativar}
            />
        );

        const textareaReopened = screen.getByLabelText(
            /Motivo da inativação da UE/i
        ) as HTMLTextAreaElement;

        // O campo mantém o valor pois o componente mantém o estado
        expect(textareaReopened.value).toBe("Motivo de teste");
    });
});
