import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModalTiposOcorrencia } from "./index";

const tiposMock = [
    {
        uuid: "uuid-1",
        nome: "Agressão física",
        descricao:
            "Qualquer ação que cause dano físico a outra pessoa, como empurrões, socos ou chutes.",
    },
    {
        uuid: "uuid-2",
        nome: "Ameaça interna",
        descricao:
            "Situação de ameaça feita por alguém dentro da unidade educacional.",
    },
    {
        uuid: "uuid-3",
        nome: "Sem descrição",
    },
];

describe("ModalTiposOcorrencia", () => {
    const mockOnOpenChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve renderizar o título e subtítulo quando open=true", () => {
        render(
            <ModalTiposOcorrencia
                open={true}
                onOpenChange={mockOnOpenChange}
                tiposOcorrencia={tiposMock}
            />,
        );

        expect(screen.getByText("Tipos de ocorrência")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Entenda o que é cada um dos tipos de ocorrências.",
            ),
        ).toBeInTheDocument();
    });

    it("não deve renderizar o conteúdo do modal quando open=false", () => {
        render(
            <ModalTiposOcorrencia
                open={false}
                onOpenChange={mockOnOpenChange}
                tiposOcorrencia={tiposMock}
            />,
        );

        expect(
            screen.queryByText("Tipos de ocorrência"),
        ).not.toBeInTheDocument();
    });

    it("deve renderizar os nomes dos tipos de ocorrência", () => {
        render(
            <ModalTiposOcorrencia
                open={true}
                onOpenChange={mockOnOpenChange}
                tiposOcorrencia={tiposMock}
            />,
        );

        expect(screen.getByText("Agressão física:")).toBeInTheDocument();
        expect(screen.getByText("Ameaça interna:")).toBeInTheDocument();
        expect(screen.getByText("Sem descrição:")).toBeInTheDocument();
    });

    it("deve renderizar as descrições quando presentes", () => {
        render(
            <ModalTiposOcorrencia
                open={true}
                onOpenChange={mockOnOpenChange}
                tiposOcorrencia={tiposMock}
            />,
        );

        expect(
            screen.getByText(
                "Qualquer ação que cause dano físico a outra pessoa, como empurrões, socos ou chutes.",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Situação de ameaça feita por alguém dentro da unidade educacional.",
            ),
        ).toBeInTheDocument();
    });

    it("não deve renderizar descrição para tipos sem esse campo", () => {
        render(
            <ModalTiposOcorrencia
                open={true}
                onOpenChange={mockOnOpenChange}
                tiposOcorrencia={[{ uuid: "uuid-3", nome: "Sem descrição" }]}
            />,
        );

        expect(screen.getByText("Sem descrição:")).toBeInTheDocument();
        const items = screen
            .getByText("Sem descrição:")
            .closest("div")
            ?.querySelectorAll("p");
        expect(items).toHaveLength(1);
    });

    it("deve renderizar lista vazia sem erros quando tiposOcorrencia é vazio", () => {
        render(
            <ModalTiposOcorrencia
                open={true}
                onOpenChange={mockOnOpenChange}
                tiposOcorrencia={[]}
            />,
        );

        expect(screen.getByText("Tipos de ocorrência")).toBeInTheDocument();
        expect(screen.queryByText("Agressão física:")).not.toBeInTheDocument();
    });

    it("deve chamar onOpenChange(false) ao clicar no botão Fechar", () => {
        render(
            <ModalTiposOcorrencia
                open={true}
                onOpenChange={mockOnOpenChange}
                tiposOcorrencia={tiposMock}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: /fechar/i }));

        expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
});
