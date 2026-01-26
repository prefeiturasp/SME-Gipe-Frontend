import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ModalConfirmacao from "./index";

describe("ModalConfirmacao", () => {
    const mockOnOpenChange = vi.fn();
    const mockOnConfirm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve renderizar o modal quando open é true", () => {
        render(
            <ModalConfirmacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onConfirm={mockOnConfirm}
            />
        );

        expect(screen.getByText("Cadastro de perfil")).toBeInTheDocument();
        expect(
            screen.getByText(
                /Ao finalizar o perfil será registrado no CoreSSO./i
            )
        ).toBeInTheDocument();
    });

    it("não deve renderizar o modal quando open é false", () => {
        render(
            <ModalConfirmacao
                open={false}
                onOpenChange={mockOnOpenChange}
                onConfirm={mockOnConfirm}
            />
        );

        expect(
            screen.queryByText("Cadastro de perfil")
        ).not.toBeInTheDocument();
    });

    it("deve renderizar os botões Cancelar e Cadastrar perfil", () => {
        render(
            <ModalConfirmacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onConfirm={mockOnConfirm}
            />
        );

        expect(
            screen.getByRole("button", { name: "Cancelar" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Cadastrar perfil" })
        ).toBeInTheDocument();
    });

    it("deve chamar onOpenChange com false ao clicar em Cancelar", () => {
        render(
            <ModalConfirmacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onConfirm={mockOnConfirm}
            />
        );

        const cancelarButton = screen.getByRole("button", { name: "Cancelar" });
        fireEvent.click(cancelarButton);

        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
        expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onConfirm ao clicar em Cadastrar perfil", () => {
        render(
            <ModalConfirmacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onConfirm={mockOnConfirm}
            />
        );

        const cadastrarButton = screen.getByRole("button", {
            name: "Cadastrar perfil",
        });
        fireEvent.click(cadastrarButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it("deve desabilitar os botões quando isLoading é true", () => {
        render(
            <ModalConfirmacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onConfirm={mockOnConfirm}
                isLoading={true}
            />
        );

        const buttons = screen.getAllByRole("button");
        const cancelarButton = screen.getByRole("button", { name: "Cancelar" });
        const cadastrarButton = buttons[1];

        expect(cancelarButton).toBeDisabled();
        expect(cadastrarButton).toBeDisabled();
    });

    it("deve habilitar os botões quando isLoading é false", () => {
        render(
            <ModalConfirmacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onConfirm={mockOnConfirm}
                isLoading={false}
            />
        );

        const cancelarButton = screen.getByRole("button", { name: "Cancelar" });
        const cadastrarButton = screen.getByRole("button", {
            name: "Cadastrar perfil",
        });

        expect(cancelarButton).toBeEnabled();
        expect(cadastrarButton).toBeEnabled();
    });

    it("não deve chamar onConfirm quando o botão está desabilitado", () => {
        render(
            <ModalConfirmacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onConfirm={mockOnConfirm}
                isLoading={true}
            />
        );

        const buttons = screen.getAllByRole("button");
        const cadastrarButton = buttons[1];

        fireEvent.click(cadastrarButton);

        expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it("deve ter a descrição acessível para screen readers", () => {
        render(
            <ModalConfirmacao
                open={true}
                onOpenChange={mockOnOpenChange}
                onConfirm={mockOnConfirm}
            />
        );

        const description = screen.getByText(
            "Confirmação de cadastro de perfil no CoreSSO"
        );
        expect(description).toHaveClass("sr-only");
    });
});
