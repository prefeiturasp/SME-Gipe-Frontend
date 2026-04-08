import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FilterPanel from "./FilterPanel";

vi.mock("@/hooks/useGetUnidades", () => ({
    useGetUnidades: (
        _ativa?: boolean,
        _dre?: string,
        tipo_unidade?: string,
    ) => {
        if (tipo_unidade === "DRE") {
            return { data: [{ uuid: "dre-uuid-1", nome: "DRE Butantã" }] };
        }
        return { data: [{ uuid: "ue-uuid-1", nome: "EMEF Teste" }] };
    },
}));

vi.mock("@/hooks/useCategoriasDisponiveis", () => ({
    useCategoriasDisponiveis: () => ({
        data: {
            etapa_escolar: [
                { value: "infantil", label: "Educação Infantil" },
                { value: "fundamental1", label: "Ensino Fundamental I" },
                { value: "fundamental2", label: "Ensino Fundamental II" },
                { value: "medio", label: "Ensino Médio" },
            ],
            motivo_ocorrencia: [],
            grupo_etnico_racial: [],
            genero: [],
            frequencia_escolar: [],
        },
        isLoading: false,
    }),
}));

const ANO_ATUAL = new Date().getFullYear().toString();

describe("FilterPanel", () => {
    it("deve renderizar o painel com o título Filtros", () => {
        render(<FilterPanel />);
        expect(screen.getByText("Filtros")).toBeInTheDocument();
    });

    it("deve renderizar as seções Período, Local e Perfil", () => {
        render(<FilterPanel />);
        expect(screen.getByText("Período")).toBeInTheDocument();
        expect(screen.getByText("Local")).toBeInTheDocument();
        expect(screen.getByText("Perfil")).toBeInTheDocument();
    });

    it("não deve renderizar a seção Intercorrências", () => {
        render(<FilterPanel />);
        expect(screen.queryByText("Intercorrências")).not.toBeInTheDocument();
    });

    it("deve exibir o ano atual como valor padrão do campo Ano", () => {
        render(<FilterPanel />);
        expect(
            screen.getByRole("combobox", { name: /ano/i }),
        ).toHaveTextContent(ANO_ATUAL);
    });

    it("deve exibir o botão Limpar tudo desabilitado por padrão", () => {
        render(<FilterPanel />);
        expect(
            screen.getByRole("button", { name: /limpar tudo/i }),
        ).toBeDisabled();
    });

    it("deve habilitar o botão Limpar tudo ao selecionar Bimestre", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const bimestreField = screen.getByText("Bimestre").closest("div")!;
        const trigger = within(bimestreField).getByRole("button");
        await user.click(trigger);
        await user.click(screen.getByText("1º Bimestre"));

        expect(
            screen.getByRole("button", { name: /limpar tudo/i }),
        ).toBeEnabled();
    });

    it("deve habilitar o botão Limpar tudo ao selecionar Gênero", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        await user.click(screen.getByRole("combobox", { name: /gênero/i }));
        await user.click(screen.getByRole("option", { name: "Masculino" }));

        expect(
            screen.getByRole("button", { name: /limpar tudo/i }),
        ).toBeEnabled();
    });

    it("deve habilitar o botão Limpar tudo ao ativar o switch Menos de um ano", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        await user.click(screen.getByRole("switch"));

        expect(
            screen.getByRole("button", { name: /limpar tudo/i }),
        ).toBeEnabled();
    });

    it("deve limpar o Bimestre selecionado ao clicar em Limpar tudo", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const bimestreField = screen.getByText("Bimestre").closest("div")!;
        const trigger = within(bimestreField).getByRole("button");
        await user.click(trigger);
        await user.click(screen.getByText("2º Bimestre"));
        await user.keyboard("{Escape}");

        await user.click(screen.getByRole("button", { name: /limpar tudo/i }));

        expect(trigger).toHaveTextContent("Selecione");
    });

    it("não deve resetar o Ano ao clicar em Limpar tudo", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        await user.click(screen.getByRole("combobox", { name: /gênero/i }));
        await user.click(screen.getByRole("option", { name: "Feminino" }));

        await user.click(screen.getByRole("button", { name: /limpar tudo/i }));

        expect(
            screen.getByRole("combobox", { name: /ano/i }),
        ).toHaveTextContent(ANO_ATUAL);
    });

    it("deve desabilitar o botão Limpar tudo após limpar os filtros", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        await user.click(screen.getByRole("combobox", { name: /gênero/i }));
        await user.click(screen.getByRole("option", { name: "Feminino" }));

        const btnLimpar = screen.getByRole("button", { name: /limpar tudo/i });
        await user.click(btnLimpar);

        expect(btnLimpar).toBeDisabled();
    });

    it("deve exibir placeholder de anos por padrão no campo Idade", () => {
        render(<FilterPanel />);

        expect(
            screen.getByPlaceholderText("Digite quantos anos..."),
        ).toBeInTheDocument();
    });

    it("deve alterar o placeholder do campo Idade para meses ao ativar o switch", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        await user.click(screen.getByRole("switch"));

        expect(
            screen.getByPlaceholderText("Digite quantos meses..."),
        ).toBeInTheDocument();
    });

    it("deve limpar o campo Idade ao alternar o switch", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const idadeInput = screen.getByPlaceholderText(
            "Digite quantos anos...",
        );
        await user.type(idadeInput, "5");
        expect(idadeInput).toHaveValue(5);

        await user.click(screen.getByRole("switch"));

        expect(
            screen.getByPlaceholderText("Digite quantos meses..."),
        ).toHaveValue(null);
    });

    it("deve resetar o switch ao clicar em Limpar tudo", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const switchEl = screen.getByRole("switch");
        await user.click(switchEl);
        expect(switchEl).toBeChecked();

        await user.click(screen.getByRole("button", { name: /limpar tudo/i }));

        expect(switchEl).not.toBeChecked();
    });

    it("deve exibir o nome do item quando apenas um mês está selecionado", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const mesField = screen.getByText("Mês").closest("div")!;
        const triggerMes = within(mesField).getByRole("button");
        await user.click(triggerMes);
        await user.click(screen.getByText("Janeiro"));

        expect(triggerMes).toHaveTextContent("Janeiro");
    });

    it("deve exibir contagem ao selecionar todos os meses", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const mesField = screen.getByText("Mês").closest("div")!;
        const triggerMes = within(mesField).getByRole("button");
        await user.click(triggerMes);
        await user.click(screen.getByText("Selecionar todos"));

        expect(triggerMes).toHaveTextContent("12 selecionados");
    });

    it("deve deselecionar um item ao clicar nele novamente", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const mesField = screen.getByText("Mês").closest("div")!;
        const triggerMes = within(mesField).getByRole("button");
        await user.click(triggerMes);

        const janeiroOption = screen.getByRole("option", { name: /janeiro/i });
        await user.click(janeiroOption);
        expect(triggerMes).toHaveTextContent("Janeiro");

        await user.click(screen.getByRole("option", { name: /janeiro/i }));
        expect(triggerMes).toHaveTextContent("Selecione");
    });

    it("deve selecionar uma DRE e limpar o campo UE", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const dreField = screen
            .getByText("Diretoria Regional de Educação (DRE)")
            .closest("div")!;
        const triggerDre = within(dreField).getByRole("button");
        await user.click(triggerDre);
        await user.click(screen.getByText("DRE Butantã"));

        expect(triggerDre).toHaveTextContent("DRE Butantã");
    });

    it("deve limpar o campo Idade ao apagar o valor digitado", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const idadeInput = screen.getByPlaceholderText(
            "Digite quantos anos...",
        );
        await user.type(idadeInput, "8");
        expect(idadeInput).toHaveValue(8);

        await user.clear(idadeInput);
        expect(idadeInput).toHaveValue(null);
    });

    it("deve ignorar valor menor que 1 no campo Idade", () => {
        render(<FilterPanel />);

        const idadeInput = screen.getByPlaceholderText(
            "Digite quantos anos...",
        );
        fireEvent.change(idadeInput, { target: { value: "0" } });

        expect(idadeInput).toHaveValue(null);
    });

    it("deve ignorar valor acima de 12 no campo Idade com switch ativo", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        await user.click(screen.getByRole("switch"));

        const idadeInput = screen.getByPlaceholderText(
            "Digite quantos meses...",
        );
        fireEvent.change(idadeInput, { target: { value: "13" } });

        expect(idadeInput).toHaveValue(null);
    });

    it("deve desselecionar todos os itens ao clicar em Selecionar todos novamente", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const mesField = screen.getByText("Mês").closest("div")!;
        const triggerMes = within(mesField).getByRole("button");
        await user.click(triggerMes);
        await user.click(screen.getByText("Selecionar todos"));
        expect(triggerMes).toHaveTextContent("12 selecionados");

        await user.click(screen.getByText("Selecionar todos"));
        expect(triggerMes).toHaveTextContent("Selecione");
    });

    it("deve exibir etapas escolares vindas da API", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const etapaField = screen.getByText("Etapa escolar").closest("div")!;
        const trigger = within(etapaField).getByRole("button");
        await user.click(trigger);

        expect(screen.getByText("Educação Infantil")).toBeInTheDocument();
        expect(screen.getByText("Ensino Fundamental I")).toBeInTheDocument();
        expect(screen.getByText("Ensino Fundamental II")).toBeInTheDocument();
        expect(screen.getByText("Ensino Médio")).toBeInTheDocument();
    });

    it("deve habilitar o botão Limpar tudo ao selecionar uma etapa escolar", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const etapaField = screen.getByText("Etapa escolar").closest("div")!;
        const trigger = within(etapaField).getByRole("button");
        await user.click(trigger);
        await user.click(screen.getByText("Ensino Médio"));

        expect(
            screen.getByRole("button", { name: /limpar tudo/i }),
        ).toBeEnabled();
    });

    it("deve limpar a etapa escolar selecionada ao clicar em Limpar tudo", async () => {
        const user = userEvent.setup();
        render(<FilterPanel />);

        const etapaField = screen.getByText("Etapa escolar").closest("div")!;
        const trigger = within(etapaField).getByRole("button");
        await user.click(trigger);
        await user.click(screen.getByText("Ensino Médio"));
        await user.keyboard("{Escape}");

        await user.click(screen.getByRole("button", { name: /limpar tudo/i }));

        expect(trigger).toHaveTextContent("Selecione");
    });
});
