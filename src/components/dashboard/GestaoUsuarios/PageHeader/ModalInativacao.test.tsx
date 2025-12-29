import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ModalInativacao from "./ModalInativacao";

describe("ModalInativacao", () => {
    const defaultProps = {
        open: true,
        onOpenChange: vi.fn(),
        onConfirm: vi.fn(),
        isLoading: false,
    };

    it("deve renderizar o modal quando open é true", () => {
        render(<ModalInativacao {...defaultProps} />);

        expect(screen.getByText("Inativação de perfil")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Ao inativar o perfil, a pessoa não terá mais acesso ao GIPE. Tem certeza que deseja continuar?"
            )
        ).toBeInTheDocument();

        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(3);
    });

    it("não deve renderizar o modal quando open é false", () => {
        render(<ModalInativacao {...defaultProps} open={false} />);

        expect(
            screen.queryByText("Inativação de perfil")
        ).not.toBeInTheDocument();
    });

    it("deve chamar onOpenChange com false ao clicar em Cancelar", async () => {
        const user = userEvent.setup();
        const mockOnOpenChange = vi.fn();

        render(
            <ModalInativacao
                {...defaultProps}
                onOpenChange={mockOnOpenChange}
            />
        );

        const buttons = screen.getAllByRole("button");
        const cancelarButton = buttons[0];
        await user.click(cancelarButton);

        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("deve chamar onConfirm ao clicar em Inativar perfil", async () => {
        const user = userEvent.setup();
        const mockOnConfirm = vi.fn();

        render(<ModalInativacao {...defaultProps} onConfirm={mockOnConfirm} />);

        const buttons = screen.getAllByRole("button");
        const inativarButton = buttons[1];
        await user.click(inativarButton);

        expect(mockOnConfirm).toHaveBeenCalled();
    });

    it("deve desabilitar os botões quando isLoading é true", () => {
        render(<ModalInativacao {...defaultProps} isLoading={true} />);

        const buttons = screen.getAllByRole("button");
        expect(buttons[0]).toBeDisabled();
        expect(buttons[1]).toBeDisabled();
    });

    it("deve mostrar loading no botão de confirmar quando isLoading é true", () => {
        render(<ModalInativacao {...defaultProps} isLoading={true} />);

        const buttons = screen.getAllByRole("button");
        const inativarButton = buttons[1];

        expect(inativarButton).toBeDisabled();
        const spinner = inativarButton.querySelector(".animate-spin");
        expect(spinner).toBeInTheDocument();
    });
});
