import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import ExportacaoPDF, { type CapturedImages } from "./ExportacaoPDF";
import type { FilterState } from "./FilterPanel";

vi.mock("@react-pdf/renderer", () => ({
    Document: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="document">{children}</div>
    ),
    Page: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="page">{children}</div>
    ),
    Text: ({ children }: { children: React.ReactNode }) => (
        <span>{children}</span>
    ),
    View: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    Image: ({ src }: { src: string }) => <img src={src} alt="" />,
    StyleSheet: { create: (v: unknown) => v },
}));

const mockImages: CapturedImages = {
    dre: "data:image/png;base64,dre",
    statusUE: "data:image/png;base64,statusUE",
    evolucaoMensal: "data:image/png;base64,evolucaoMensal",
    tiposPatrimonial: "data:image/png;base64,tiposPatrimonial",
    tiposInterpessoal: "data:image/png;base64,tiposInterpessoal",
    motivacoes: "data:image/png;base64,motivacoes",
};

const baseFilterState: FilterState = {
    ano: "2025",
    meses: [],
    bimestre: [],
    dres: [],
    ues: [],
    genero: "",
    etapas: [],
    idade: "",
    menosDeUmAno: false,
};

describe("ExportacaoPDF", () => {
    it("deve renderizar o cabeçalho com o título Extração de dados", () => {
        render(
            <ExportacaoPDF filterState={baseFilterState} images={mockImages} />,
        );
        expect(screen.getByText("Extração de dados")).toBeInTheDocument();
    });

    it("deve renderizar o label 'Filtros aplicados:'", () => {
        render(
            <ExportacaoPDF filterState={baseFilterState} images={mockImages} />,
        );
        expect(screen.getByText("Filtros aplicados:")).toBeInTheDocument();
    });

    it("deve exibir o ano letivo no filtro", () => {
        render(
            <ExportacaoPDF filterState={baseFilterState} images={mockImages} />,
        );
        expect(screen.getByText("2025")).toBeInTheDocument();
    });

    it("deve exibir o nome do mês quando apenas um está selecionado", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, meses: ["01"] }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("Janeiro")).toBeInTheDocument();
    });

    it("deve exibir o valor bruto do mês quando não está mapeado nas opções", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, meses: ["99"] }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("99")).toBeInTheDocument();
    });

    it("deve exibir a contagem quando múltiplos meses estão selecionados", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, meses: ["01", "02", "03"] }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("3 meses")).toBeInTheDocument();
    });

    it("deve exibir o nome do bimestre quando apenas um está selecionado", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, bimestre: ["1"] }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("1º Bimestre")).toBeInTheDocument();
    });

    it("deve exibir a contagem de bimestres quando múltiplos estão selecionados", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, bimestre: ["1", "2"] }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("2 bimestres")).toBeInTheDocument();
    });

    it("deve exibir '1 DRE selecionada' quando uma DRE está selecionada", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, dres: ["dre-1"] }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("1 DRE selecionada")).toBeInTheDocument();
    });

    it("deve exibir 'N DREs selecionadas' quando múltiplas DREs estão selecionadas", () => {
        render(
            <ExportacaoPDF
                filterState={{
                    ...baseFilterState,
                    dres: ["dre-1", "dre-2", "dre-3"],
                }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("3 DREs selecionadas")).toBeInTheDocument();
    });

    it("deve exibir '1 UE selecionada' quando uma UE está selecionada", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, ues: ["ue-1"] }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("1 UE selecionada")).toBeInTheDocument();
    });

    it("deve exibir 'N UEs selecionadas' quando múltiplas UEs estão selecionadas", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, ues: ["ue-1", "ue-2"] }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("2 UEs selecionadas")).toBeInTheDocument();
    });

    it("deve exibir o gênero selecionado", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, genero: "masculino" }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("Masculino")).toBeInTheDocument();
    });

    it("deve exibir o gênero feminino quando selecionado", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, genero: "feminino" }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("Feminino")).toBeInTheDocument();
    });

    it("deve exibir 'Todos' para gênero não mapeado", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, genero: "nao_mapeado" }}
                images={mockImages}
            />,
        );
        const generoLabel = screen.getByText("Gênero:");
        expect(generoLabel.nextElementSibling).toHaveTextContent("Todos");
    });

    it("deve exibir o valor da etapa quando apenas uma está selecionada", () => {
        render(
            <ExportacaoPDF
                filterState={{
                    ...baseFilterState,
                    etapas: ["Educação Infantil"],
                }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("Educação Infantil")).toBeInTheDocument();
    });

    it("deve exibir a contagem de etapas quando múltiplas estão selecionadas", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, etapas: ["E1", "E2"] }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("2 selecionadas")).toBeInTheDocument();
    });

    it("deve exibir 'N anos' para idade em anos", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, idade: "5" }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("5 anos")).toBeInTheDocument();
    });

    it("deve exibir '1 ano' no singular para idade igual a 1", () => {
        render(
            <ExportacaoPDF
                filterState={{ ...baseFilterState, idade: "1" }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("1 ano")).toBeInTheDocument();
    });

    it("deve exibir 'N meses' para idade em meses com menosDeUmAno ativo", () => {
        render(
            <ExportacaoPDF
                filterState={{
                    ...baseFilterState,
                    idade: "3",
                    menosDeUmAno: true,
                }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("3 meses")).toBeInTheDocument();
    });

    it("deve exibir '1 mês' no singular para idade igual a 1 com menosDeUmAno ativo", () => {
        render(
            <ExportacaoPDF
                filterState={{
                    ...baseFilterState,
                    idade: "1",
                    menosDeUmAno: true,
                }}
                images={mockImages}
            />,
        );
        expect(screen.getByText("1 mês")).toBeInTheDocument();
    });

    it("deve renderizar os números das quatro páginas", () => {
        render(
            <ExportacaoPDF filterState={baseFilterState} images={mockImages} />,
        );
        expect(screen.getByText("1/4")).toBeInTheDocument();
        expect(screen.getByText("2/4")).toBeInTheDocument();
        expect(screen.getByText("3/4")).toBeInTheDocument();
        expect(screen.getByText("4/4")).toBeInTheDocument();
    });

    it("deve renderizar o título da seção de tipos de intercorrências", () => {
        render(
            <ExportacaoPDF filterState={baseFilterState} images={mockImages} />,
        );
        expect(
            screen.getByText("Gráfico por tipo de intercorrências"),
        ).toBeInTheDocument();
    });

    it("deve renderizar o título da seção de motivações", () => {
        render(
            <ExportacaoPDF filterState={baseFilterState} images={mockImages} />,
        );
        expect(screen.getByText("Gráfico por motivação")).toBeInTheDocument();
    });

    it("deve renderizar os labels dos cards do dashboard analítico", () => {
        render(
            <ExportacaoPDF filterState={baseFilterState} images={mockImages} />,
        );
        expect(
            screen.getByText("Total de intercorrências:"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Intercorrências patrimoniais:"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Intercorrências interpessoais:"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Média de registros por mês:"),
        ).toBeInTheDocument();
    });

    it("deve renderizar as imagens dos gráficos com os src corretos", () => {
        render(
            <ExportacaoPDF filterState={baseFilterState} images={mockImages} />,
        );
        const imgs = document.querySelectorAll("img");
        const srcs = Array.from(imgs).map((img) => img.getAttribute("src"));
        expect(srcs).toContain("data:image/png;base64,dre");
        expect(srcs).toContain("data:image/png;base64,statusUE");
        expect(srcs).toContain("data:image/png;base64,evolucaoMensal");
        expect(srcs).toContain("data:image/png;base64,tiposPatrimonial");
        expect(srcs).toContain("data:image/png;base64,tiposInterpessoal");
        expect(srcs).toContain("data:image/png;base64,motivacoes");
    });
});
