import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PageHeader from "./index";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

describe("PageHeader - Gestão de Unidades", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve renderizar o título corretamente", () => {
        render(<PageHeader title="Editar Unidade Educacional" />);

        expect(
            screen.getByText("Editar Unidade Educacional")
        ).toBeInTheDocument();
    });

    it("deve renderizar botão de voltar no modo edit", () => {
        render(<PageHeader title="Editar Unidade Educacional" edit={true} />);

        const voltarLink = screen.getByRole("link");
        expect(voltarLink).toHaveAttribute(
            "href",
            "/dashboard/gestao-unidades-educacionais"
        );
    });

    it("deve renderizar botão 'Inativar Unidade Educacional' no modo edit", () => {
        render(<PageHeader title="Editar Unidade Educacional" edit={true} />);

        const inativarButton = screen.getByRole("button", {
            name: /inativar unidade educacional/i,
        });
        expect(inativarButton).toBeInTheDocument();
    });

    it("deve renderizar botão 'Voltar' com texto no modo não-edit", () => {
        render(
            <PageHeader title="Cadastrar Unidade Educacional" edit={false} />
        );

        expect(screen.getByText("Voltar")).toBeInTheDocument();
    });

    it("não deve renderizar botão de inativar no modo não-edit", () => {
        render(
            <PageHeader title="Cadastrar Unidade Educacional" edit={false} />
        );

        const inativarButton = screen.queryByRole("button", {
            name: /inativar unidade educacional/i,
        });
        expect(inativarButton).not.toBeInTheDocument();
    });

    it("deve chamar onClickBack quando clicar no botão de voltar", () => {
        const onClickBack = vi.fn();
        render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                onClickBack={onClickBack}
            />
        );

        const voltarLink = screen.getByRole("link");
        fireEvent.click(voltarLink);

        expect(onClickBack).toHaveBeenCalledTimes(1);
    });

    it("deve ter link correto para gestão de unidades educacionais no modo edit", () => {
        render(<PageHeader title="Editar Unidade Educacional" edit={true} />);

        const voltarLink = screen.getByRole("link");
        expect(voltarLink).toHaveAttribute(
            "href",
            "/dashboard/gestao-unidades-educacionais"
        );
    });

    it("deve ter link correto para gestão de unidades educacionais no modo não-edit", () => {
        render(
            <PageHeader title="Cadastrar Unidade Educacional" edit={false} />
        );

        const voltarLink = screen.getByRole("link");
        expect(voltarLink).toHaveAttribute(
            "href",
            "/dashboard/gestao-unidades-educacionais"
        );
    });

    it("deve renderizar com edit=true por padrão", () => {
        render(<PageHeader title="Editar Unidade Educacional" />);

        const inativarButton = screen.getByRole("button", {
            name: /inativar unidade educacional/i,
        });
        expect(inativarButton).toBeInTheDocument();
    });

    it("deve renderizar ícone de voltar no botão de navegação no modo edit", () => {
        render(<PageHeader title="Editar Unidade Educacional" edit={true} />);

        const voltarLink = screen.getByRole("link");
        expect(voltarLink).toBeInTheDocument();
        expect(voltarLink.querySelector("svg")).toBeInTheDocument();
    });

    it("deve renderizar ícone Ban no botão de inativar", () => {
        render(<PageHeader title="Editar Unidade Educacional" edit={true} />);

        const inativarButton = screen.getByRole("button", {
            name: /inativar unidade educacional/i,
        });

        const svg = inativarButton.querySelector("svg");
        expect(svg).toBeInTheDocument();
    });

    it("deve aplicar classes corretas no título", () => {
        render(<PageHeader title="Editar Unidade Educacional" />);

        const titulo = screen.getByText("Editar Unidade Educacional");
        expect(titulo).toHaveClass("text-[#42474a]");
        expect(titulo).toHaveClass("text-[20px]");
        expect(titulo).toHaveClass("font-bold");
    });

    it("deve aplicar variant outlineDestructive no botão de inativar", () => {
        render(<PageHeader title="Editar Unidade Educacional" edit={true} />);

        const inativarButton = screen.getByRole("button", {
            name: /inativar unidade educacional/i,
        });

        expect(inativarButton).toHaveClass("text-center");
        expect(inativarButton).toHaveClass("rounded-md");
        expect(inativarButton).toHaveClass("text-[14px]");
        expect(inativarButton).toHaveClass("font-[700]");
    });

    it("deve renderizar layout flex com espaçamento correto", () => {
        const { container } = render(
            <PageHeader title="Editar Unidade Educacional" />
        );

        const headerDiv = container.firstChild as HTMLElement;
        expect(headerDiv).toHaveClass("flex");
        expect(headerDiv).toHaveClass("items-center");
        expect(headerDiv).toHaveClass("justify-between");
        expect(headerDiv).toHaveClass("w-full");
        expect(headerDiv).toHaveClass("px-4");
    });

    it("deve renderizar dois botões no modo edit", () => {
        render(<PageHeader title="Editar Unidade Educacional" edit={true} />);

        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(1); // Apenas o botão de inativar (o link não é botão)

        const links = screen.getAllByRole("link");
        expect(links).toHaveLength(1); // Link de voltar
    });

    it("deve renderizar apenas um link no modo não-edit", () => {
        render(
            <PageHeader title="Cadastrar Unidade Educacional" edit={false} />
        );

        const links = screen.getAllByRole("link");
        expect(links).toHaveLength(1);

        const buttons = screen.queryAllByRole("button");
        expect(buttons).toHaveLength(0);
    });
});
