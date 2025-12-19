import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import TabelaUnidades from "./TabelaUnidades";
import { mockUnidades } from "@/components/mocks/unidades-mock";


describe("TabelaUnidades", () => {
    it("deve renderizar a tabela com os dados fornecidos", () => {
        render(<TabelaUnidades dataUnidades={mockUnidades} />);

        expect(screen.getByTestId("tabela-unidades")).toBeInTheDocument();
        expect(screen.getByText("Unidade 1")).toBeInTheDocument();
        expect(screen.getByText("Unidade 2")).toBeInTheDocument();
    });

    it("deve exibir mensagem quando não houver unidades", () => {
        render(<TabelaUnidades dataUnidades={[]} />);

        expect(
            screen.getByText("Nenhuma Unidade Educacional encontrada.")
        ).toBeInTheDocument();
    });

    it("deve paginar os dados corretamente", async () => {
        const manyUnidades = Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            nome: `Unidade ${i + 1}`,
            tipo_unidade: "Tipo A",
            rede_label: "Rede Pública",
            codigo_eol: `EOL${String(i + 1).padStart(3, "0")}`,
            dre_nome: `DR ${i + 1}`,
            sigla: `DRE${i + 1}`,
            uuid: `uuid-${i + 1}`,
            status: 'Ativa',
        }));

        render(<TabelaUnidades dataUnidades={manyUnidades} />);

        // Verifica se a primeira página está correta
        expect(screen.getByText("Unidade 1")).toBeInTheDocument();
        expect(screen.getByText("Unidade 10")).toBeInTheDocument();
        expect(screen.queryByText("Unidade 11")).not.toBeInTheDocument();

        const user = userEvent.setup();

        // Navega para a próxima página
        const nextButton = screen.getByTestId("next-page-button");
        await user.click(nextButton);

        // Verifica se a segunda página está correta
        expect(screen.getByText("Unidade 11")).toBeInTheDocument();
        expect(screen.getByText("Unidade 20")).toBeInTheDocument();
        expect(screen.queryByText("Unidade 21")).not.toBeInTheDocument();
    });

    it("deve desabilitar o botão de página anterior na primeira página", () => {
        render(<TabelaUnidades dataUnidades={mockUnidades} />);

        const prevButton = screen.getByTestId("prev-page-button");
        expect(prevButton).toBeDisabled();
    });

    it("deve desabilitar o botão de próxima página na última página", async () => {
        const unidades = Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            nome: `Unidade ${i + 1}`,
            tipo_unidade: "Tipo A",
            rede_label: "Rede Pública",
            codigo_eol: `EOL${String(i + 1).padStart(3, "0")}`,
            dre_nome: `DR ${i + 1}`,
            sigla: `DRE${i + 1}`,
            uuid: `uuid-${i + 1}`,
            status: 'Ativa',
        }));

        render(<TabelaUnidades dataUnidades={unidades} />);

        const nextButton = screen.getByTestId("next-page-button");
        expect(nextButton).toBeDisabled();
    });

    it("deve renderizar corretamente unidades sem uuid", () => {
        const unidadesSemUuid = [
            {
                id: 999,
                uuid: '',
                nome: "Unidade Sem UUID",
                tipo_unidade: "Tipo A",
                rede_label: "Rede Pública",
                codigo_eol: "EOL001",
                dre_nome: "DR 1",
                sigla: "DRE1",
                status: 'Ativa',
            },
        ];

        render(<TabelaUnidades dataUnidades={unidadesSemUuid} />);

        expect(screen.getByText("Unidade Sem UUID")).toBeInTheDocument();
    });

    it("deve usar o index como fallback quando uuid e id forem falsy", () => {
        const unidadesSemIds = [
            {
                id: 0,
                uuid: '',
                nome: "Unidade Com ID 0",
                tipo_unidade: "Tipo A",
                rede_label: "Rede Pública",
                codigo_eol: "EOL001",
                dre_nome: "DR 1",
                sigla: "DRE1",
                status: 'Ativa',
            },
            {
                id: 0,
                uuid: '',
                nome: "Unidade Com ID 0 - Segunda",
                tipo_unidade: "Tipo B",
                rede_label: "Rede Particular",
                codigo_eol: "EOL002",
                dre_nome: "DR 2",
                sigla: "DRE2",
                status: 'Ativa',
            },
        ];

        render(<TabelaUnidades dataUnidades={unidadesSemIds} />);

        expect(screen.getByText("Unidade Com ID 0")).toBeInTheDocument();
        expect(screen.getByText("Unidade Com ID 0 - Segunda")).toBeInTheDocument();
    });

    it("deve navegar para a página anterior", async () => {
        const manyUnidades = Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            nome: `Unidade ${i + 1}`,
            tipo_unidade: "Tipo A",
            rede_label: "Rede Pública",
            codigo_eol: `EOL${String(i + 1).padStart(3, "0")}`,
            dre_nome: `DR ${i + 1}`,
            sigla: `DRE${i + 1}`,
            uuid: `uuid-${i + 1}`,
            status: 'Ativa',
        }));

        render(<TabelaUnidades dataUnidades={manyUnidades} />);

        const user = userEvent.setup();

        // Navega para a próxima página
        const nextButton = screen.getByTestId("next-page-button");
        await user.click(nextButton);

        expect(screen.getByText("Unidade 11")).toBeInTheDocument();

        // Volta para a página anterior
        const prevButton = screen.getByTestId("prev-page-button");
        await user.click(prevButton);

        expect(screen.getByText("Unidade 1")).toBeInTheDocument();
    });

    it("deve clicar no botão de número de página", async () => {
        const manyUnidades = Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            nome: `Unidade ${i + 1}`,
            tipo_unidade: "Tipo A",
            rede_label: "Rede Pública",
            codigo_eol: `EOL${String(i + 1).padStart(3, "0")}`,
            dre_nome: `DR ${i + 1}`,
            sigla: `DRE${i + 1}`,
            uuid: `uuid-${i + 1}`,
            status: 'Ativa',
        }));

        render(<TabelaUnidades dataUnidades={manyUnidades} />);

        const user = userEvent.setup();

        // Clica no botão da página 2
        const page2Button = screen.getByText("2");
        await user.click(page2Button);

        // Verifica se a segunda página está sendo exibida
        expect(screen.getByText("Unidade 11")).toBeInTheDocument();
    });
});
