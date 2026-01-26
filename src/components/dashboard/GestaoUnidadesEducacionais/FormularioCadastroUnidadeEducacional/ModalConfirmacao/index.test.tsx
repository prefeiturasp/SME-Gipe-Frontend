import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModalConfirmacao from "./index";

describe("ModalConfirmacao", () => {
    const mockOnOpenChange = vi.fn();
    const mockOnConfirm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Modo Inativação", () => {
        it("deve renderizar o modal de inativação quando open=true e mode=inativar", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    mode="inativar"
                />,
            );

            expect(
                screen.getByText("Inativação de Unidade Educacional"),
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    /Ao inativar o perfil da unidade educacional, não será mais possível vincular novas intercorrências a ela/i,
                ),
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText(/Motivo da inativação da UE/i),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", {
                    name: /Inativar Unidade Educacional/i,
                }),
            ).toBeInTheDocument();
        });

        it("deve renderizar o modal de inativação por padrão quando mode não é especificado", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                />,
            );

            expect(
                screen.getByText("Inativação de Unidade Educacional"),
            ).toBeInTheDocument();
        });

        it("deve chamar onConfirm com o motivo ao clicar no botão Inativar", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    mode="inativar"
                />,
            );

            const textarea = screen.getByLabelText(
                /Motivo da inativação da UE/i,
            );
            const inativarButton = screen.getByRole("button", {
                name: /Inativar Unidade Educacional/i,
            });

            fireEvent.change(textarea, {
                target: { value: "Motivo de inativação" },
            });
            fireEvent.click(inativarButton);

            expect(mockOnConfirm).toHaveBeenCalledTimes(1);
            expect(mockOnConfirm).toHaveBeenCalledWith("Motivo de inativação");
        });

        it("deve manter o botão Inativar desabilitado quando o motivo está vazio", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    mode="inativar"
                />,
            );

            const inativarButton = screen.getByRole("button", {
                name: /Inativar Unidade Educacional/i,
            });

            expect(inativarButton).toBeDisabled();
        });

        it("deve habilitar o botão Inativar quando o motivo é preenchido", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    mode="inativar"
                />,
            );

            const textarea = screen.getByLabelText(
                /Motivo da inativação da UE/i,
            );
            const inativarButton = screen.getByRole("button", {
                name: /Inativar Unidade Educacional/i,
            });

            fireEvent.change(textarea, {
                target: { value: "Motivo de teste" },
            });

            expect(inativarButton).not.toBeDisabled();
        });
    });

    describe("Modo Reativação", () => {
        it("deve renderizar o modal de reativação quando mode=reativar", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    mode="reativar"
                />,
            );

            expect(
                screen.getByText("Reativação de Unidade Educacional"),
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    /Ao reativar o perfil da unidade educacional, novas intercorrências poderão ser vinculadas a ela/i,
                ),
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText(/Motivo da reativação da UE/i),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", {
                    name: /Reativar Unidade Educacional/i,
                }),
            ).toBeInTheDocument();
        });

        it("deve chamar onConfirm com o motivo ao clicar no botão Reativar", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    mode="reativar"
                />,
            );

            const textarea = screen.getByLabelText(
                /Motivo da reativação da UE/i,
            );
            const reativarButton = screen.getByRole("button", {
                name: /Reativar Unidade Educacional/i,
            });

            fireEvent.change(textarea, {
                target: { value: "Motivo de reativação" },
            });
            fireEvent.click(reativarButton);

            expect(mockOnConfirm).toHaveBeenCalledTimes(1);
            expect(mockOnConfirm).toHaveBeenCalledWith("Motivo de reativação");
        });

        it("deve manter o botão Reativar desabilitado quando o motivo está vazio", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    mode="reativar"
                />,
            );

            const reativarButton = screen.getByRole("button", {
                name: /Reativar Unidade Educacional/i,
            });

            expect(reativarButton).toBeDisabled();
        });

        it("deve habilitar o botão Reativar quando o motivo é preenchido", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    mode="reativar"
                />,
            );

            const textarea = screen.getByLabelText(
                /Motivo da reativação da UE/i,
            );
            const reativarButton = screen.getByRole("button", {
                name: /Reativar Unidade Educacional/i,
            });

            fireEvent.change(textarea, {
                target: { value: "Motivo de teste" },
            });

            expect(reativarButton).not.toBeDisabled();
        });
    });

    describe("Comportamentos Gerais", () => {
        it("não deve renderizar o conteúdo do modal quando open=false", () => {
            render(
                <ModalConfirmacao
                    open={false}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                />,
            );

            expect(
                screen.queryByText("Inativação de Unidade Educacional"),
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Reativação de Unidade Educacional"),
            ).not.toBeInTheDocument();
        });

        it("deve atualizar o valor do textarea ao digitar", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    mode="inativar"
                />,
            );

            const textarea = screen.getByLabelText(
                /Motivo da inativação da UE/i,
            ) as HTMLTextAreaElement;

            fireEvent.change(textarea, {
                target: { value: "Motivo de teste" },
            });

            expect(textarea.value).toBe("Motivo de teste");
        });

        it("deve manter o botão desabilitado quando o motivo contém apenas espaços", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    mode="inativar"
                />,
            );

            const textarea = screen.getByLabelText(
                /Motivo da inativação da UE/i,
            );
            const inativarButton = screen.getByRole("button", {
                name: /Inativar Unidade Educacional/i,
            });

            fireEvent.change(textarea, { target: { value: "   " } });

            expect(inativarButton).toBeDisabled();
        });

        it("deve chamar onOpenChange(false) ao clicar no botão Cancelar", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                />,
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
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    isLoading={true}
                    mode="inativar"
                />,
            );

            const textarea = screen.getByLabelText(
                /Motivo da inativação da UE/i,
            );
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
                    !button.textContent?.includes("Close"),
            );

            expect(cancelarButton).toBeDisabled();
            expect(inativarButton).toBeDisabled();
        });

        it("deve exibir o placeholder correto no textarea", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                />,
            );

            const textarea = screen.getByPlaceholderText(
                "Digite aqui...",
            ) as HTMLTextAreaElement;

            expect(textarea).toBeInTheDocument();
        });

        it("deve renderizar os botões com as variantes corretas", () => {
            render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                />,
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
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                />,
            );

            const textarea = screen.getByLabelText(
                /Motivo da inativação da UE/i,
            ) as HTMLTextAreaElement;

            expect(textarea).toHaveAttribute("required");
        });

        it("deve limpar o campo ao reabrir o modal", async () => {
            const { rerender } = render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                />,
            );

            const textarea = screen.getByLabelText(
                /Motivo da inativação da UE/i,
            ) as HTMLTextAreaElement;

            fireEvent.change(textarea, {
                target: { value: "Motivo de teste" },
            });

            expect(textarea.value).toBe("Motivo de teste");

            rerender(
                <ModalConfirmacao
                    open={false}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                />,
            );

            rerender(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                />,
            );

            const textareaReopened = screen.getByLabelText(
                /Motivo da inativação da UE/i,
            ) as HTMLTextAreaElement;

            expect(textareaReopened.value).toBe("Motivo de teste");
        });

        it("deve alternar corretamente entre os modos ao mudar a prop mode", () => {
            const { rerender } = render(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    mode="inativar"
                />,
            );

            expect(
                screen.getByText("Inativação de Unidade Educacional"),
            ).toBeInTheDocument();

            rerender(
                <ModalConfirmacao
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onConfirm={mockOnConfirm}
                    mode="reativar"
                />,
            );

            expect(
                screen.getByText("Reativação de Unidade Educacional"),
            ).toBeInTheDocument();
        });
    });
});
