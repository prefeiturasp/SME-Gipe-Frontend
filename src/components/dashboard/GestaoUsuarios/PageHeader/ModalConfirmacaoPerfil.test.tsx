import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ModalConfirmacaoPerfil from "./ModalConfirmacaoPerfil";

describe("ModalConfirmacaoPerfil", () => {
    const defaultProps = {
        open: true,
        onOpenChange: vi.fn(),
        onConfirm: vi.fn(),
        isLoading: false,
        motivoInativacao: "Este é um motivo de inativação de exemplo.",
        setMotivoInativacao: vi.fn(),
    };

    describe("Modal de Inativação", () => {
        it("deve renderizar o modal de inativação quando isReativacao é false", () => {
            render(<ModalConfirmacaoPerfil {...defaultProps} />);

            expect(
                screen.getByText("Inativação de perfil")
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    "Ao inativar o perfil, a pessoa não terá mais acesso ao GIPE. Tem certeza que deseja continuar?"
                )
            ).toBeInTheDocument();

            const buttons = screen.getAllByRole("button");
            expect(buttons).toHaveLength(3);
            expect(buttons[1]).toHaveTextContent("Inativar perfil");
        });
    });

    describe("Modal de Reativação", () => {
        it("deve renderizar o modal de reativação quando isReativacao é true", () => {
            render(
                <ModalConfirmacaoPerfil {...defaultProps} isReativacao={true} />
            );

            expect(
                screen.getByText("Reativação de perfil")
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    "Ao reativar o perfil, a pessoa terá acesso ao GIPE novamente. Tem certeza que deseja continuar?"
                )
            ).toBeInTheDocument();

            const buttons = screen.getAllByRole("button");
            expect(buttons).toHaveLength(3);
            expect(buttons[1]).toHaveTextContent("Reativar perfil");
        });
    });

    it("não deve renderizar o modal quando open é false", () => {
        render(<ModalConfirmacaoPerfil {...defaultProps} open={false} />);

        expect(
            screen.queryByText("Inativação de perfil")
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText("Reativação de perfil")
        ).not.toBeInTheDocument();
    });

    it("deve chamar onOpenChange com false ao clicar em Cancelar", async () => {
        const user = userEvent.setup();
        const mockOnOpenChange = vi.fn();

        render(
            <ModalConfirmacaoPerfil
                {...defaultProps}
                onOpenChange={mockOnOpenChange}
            />
        );

        const buttons = screen.getAllByRole("button");
        const cancelarButton = buttons[0];
        await user.click(cancelarButton);

        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("deve chamar onConfirm ao clicar no botão de confirmar", async () => {
        const user = userEvent.setup();
        const mockOnConfirm = vi.fn();

        render(
            <ModalConfirmacaoPerfil
                {...defaultProps}
                onConfirm={mockOnConfirm}
            />
        );

        const buttons = screen.getAllByRole("button");
        const confirmarButton = buttons[1];
        await user.click(confirmarButton);

        expect(mockOnConfirm).toHaveBeenCalled();
    });

    it("deve desabilitar os botões quando isLoading é true", () => {
        render(<ModalConfirmacaoPerfil {...defaultProps} isLoading={true} />);

        const buttons = screen.getAllByRole("button");
        expect(buttons[0]).toBeDisabled();
        expect(buttons[1]).toBeDisabled();
    });

    it("deve mostrar loading no botão de confirmar quando isLoading é true", () => {
        render(<ModalConfirmacaoPerfil {...defaultProps} isLoading={true} />);

        const buttons = screen.getAllByRole("button");
        const confirmarButton = buttons[1];

        expect(confirmarButton).toBeDisabled();
        const spinner = confirmarButton.querySelector(".animate-spin");
        expect(spinner).toBeInTheDocument();
    });
});
