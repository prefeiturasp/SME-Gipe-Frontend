import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModalSemUnidade from "./index";

describe("ModalSemUnidade", () => {
    const mockOnOpenChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve renderizar o modal com título e descrição quando open=true", () => {
        render(<ModalSemUnidade open={true} onOpenChange={mockOnOpenChange} />);

        expect(
            screen.getByText("Não encontramos a sua Unidade Educacional"),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /Para registrar uma intercorrência, é necessário possuir uma unidade educacional associada ao seu perfil. Entre em contato com o Gabinete da DRE para atualizar seu cadastro./i,
            ),
        ).toBeInTheDocument();
    });

    it("não deve renderizar o conteúdo do modal quando open=false", () => {
        render(
            <ModalSemUnidade open={false} onOpenChange={mockOnOpenChange} />,
        );

        expect(
            screen.queryByText("Não encontramos a sua Unidade Educacional"),
        ).not.toBeInTheDocument();
    });

    it("deve chamar onOpenChange(false) ao clicar no botão Fechar", () => {
        render(<ModalSemUnidade open={true} onOpenChange={mockOnOpenChange} />);

        const fecharButton = screen.getByRole("button", {
            name: /fechar/i,
        });

        fireEvent.click(fecharButton);

        expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
});
