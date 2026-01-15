import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PageHeader from "./index";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

vi.mock("next/link", () => ({
    default: ({
        children,
        href,
        onClick,
    }: {
        children: React.ReactNode;
        href: string;
        onClick?: () => void;
    }) => (
        <a
            href={href}
            onClick={(e) => {
                e.preventDefault();
                onClick?.();
            }}
        >
            {children}
        </a>
    ),
}));

const mockInvalidateQueries = vi.fn();
vi.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({
        invalidateQueries: mockInvalidateQueries,
    }),
}));

const mockObterUnidade = vi.fn();
vi.mock("@/hooks/useObterUnidadeGestao", () => ({
    useObterUnidadeGestao: (props: { uuid: string }) => {
        return mockObterUnidade(props);
    },
}));

const mockInativarUnidade = vi.fn();
vi.mock("@/hooks/useInativarUnidadeGestao", () => ({
    useInativarUnidadeGestao: () => ({
        mutateAsync: mockInativarUnidade,
        isPending: false,
    }),
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: vi.fn(),
}));

vi.mock("../FormularioCadastroUnidadeEducacional/ModalInativacao", () => ({
    default: ({
        open,
        onOpenChange,
        onInativar,
    }: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        onInativar: (motivo: string) => void;
    }) => (
        <div data-testid="modal-inativacao" data-open={open}>
            <button onClick={() => onInativar("motivo teste")}>
                Confirmar Inativação
            </button>
            <button onClick={() => onOpenChange(false)}>Cancelar</button>
        </div>
    ),
}));

const mockUnidadeAtiva = {
    uuid: "unidade-123",
    nome: "EMEF Teste",
    rede: "INDIRETA",
    ativa: true,
};

const mockUnidadeInativa = {
    uuid: "unidade-123",
    nome: "EMEF Teste",
    rede: "INDIRETA",
    ativa: false,
};

const mockUnidadeDireta = {
    uuid: "unidade-456",
    nome: "EMEF Direta",
    rede: "DIRETA",
    ativa: true,
};

describe("PageHeader", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockObterUnidade.mockReturnValue({
            data: mockUnidadeAtiva,
            isLoading: false,
        });
    });

    it("deve renderizar o título corretamente", () => {
        render(<PageHeader title="Editar Unidade Educacional" />);

        expect(
            screen.getByText("Editar Unidade Educacional")
        ).toBeInTheDocument();
    });

    it("deve renderizar botão 'Inativar Unidade Educacional' para unidade ativa não-direta", () => {
        render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                unidadeUuid="unidade-123"
            />
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar unidade educacional/i,
        });
        expect(inativarButton).toBeInTheDocument();
    });

    it("deve renderizar botão 'Reativar Unidade Educacional' para unidade inativa", () => {
        mockObterUnidade.mockReturnValue({
            data: mockUnidadeInativa,
            isLoading: false,
        });

        render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                unidadeUuid="unidade-123"
            />
        );

        const reativarButton = screen.getByRole("button", {
            name: /reativar unidade educacional/i,
        });
        expect(reativarButton).toBeInTheDocument();
    });

    it("não deve renderizar botões de inativar/reativar para unidade de rede DIRETA", () => {
        mockObterUnidade.mockReturnValue({
            data: mockUnidadeDireta,
            isLoading: false,
        });

        render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                unidadeUuid="unidade-456"
            />
        );

        const inativarButton = screen.queryByRole("button", {
            name: /inativar unidade educacional/i,
        });
        const reativarButton = screen.queryByRole("button", {
            name: /reativar unidade educacional/i,
        });

        expect(inativarButton).not.toBeInTheDocument();
        expect(reativarButton).not.toBeInTheDocument();
    });

    it("deve abrir o modal ao clicar em inativar", async () => {
        render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                unidadeUuid="unidade-123"
            />
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar unidade educacional/i,
        });

        fireEvent.click(inativarButton);

        await waitFor(() => {
            const modal = screen.getByTestId("modal-inativacao");
            expect(modal).toHaveAttribute("data-open", "true");
        });
    });

    it("deve chamar a action de inativar e redirecionar ao confirmar", async () => {
        const { toast } = await import("@/components/ui/headless-toast");
        mockInativarUnidade.mockResolvedValueOnce({ success: true });

        render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                unidadeUuid="unidade-123"
            />
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar unidade educacional/i,
        });
        fireEvent.click(inativarButton);

        await waitFor(() => {
            const modal = screen.getByTestId("modal-inativacao");
            expect(modal).toHaveAttribute("data-open", "true");
        });

        const confirmarButton = screen.getByText("Confirmar Inativação");
        fireEvent.click(confirmarButton);

        await waitFor(() => {
            expect(mockInativarUnidade).toHaveBeenCalledWith({
                uuid: "unidade-123",
                motivo_inativacao: "motivo teste",
            });
            expect(toast).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Tudo certo por aqui!",
                    description:
                        "A unidade educacional foi inativada com sucesso.",
                    variant: "success",
                })
            );
            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ["unidade-gestao", "unidade-123"],
            });
            expect(mockPush).toHaveBeenCalledWith(
                "/dashboard/gestao-unidades-educacionais?tab=inativas"
            );
        });
    });

    it("deve exibir toast de erro ao falhar a inativação", async () => {
        const { toast } = await import("@/components/ui/headless-toast");
        mockInativarUnidade.mockResolvedValueOnce({
            success: false,
            error: "Erro ao inativar unidade",
        });

        render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                unidadeUuid="unidade-123"
            />
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar unidade educacional/i,
        });
        fireEvent.click(inativarButton);

        await waitFor(() => {
            const modal = screen.getByTestId("modal-inativacao");
            expect(modal).toHaveAttribute("data-open", "true");
        });

        const confirmarButton = screen.getByText("Confirmar Inativação");
        fireEvent.click(confirmarButton);

        await waitFor(() => {
            expect(mockInativarUnidade).toHaveBeenCalledWith({
                uuid: "unidade-123",
                motivo_inativacao: "motivo teste",
            });
            expect(toast).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Não conseguimos concluir a ação!",
                    description: "Erro ao inativar unidade",
                    variant: "error",
                })
            );
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    it("não deve chamar a action de inativar quando unidadeUuid não é fornecido", async () => {
        mockObterUnidade.mockReturnValue({
            data: { ...mockUnidadeAtiva, rede: "INDIRETA" },
            isLoading: false,
        });

        const { rerender } = render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                unidadeUuid="unidade-123"
            />
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar unidade educacional/i,
        });
        fireEvent.click(inativarButton);

        await waitFor(() => {
            const modal = screen.getByTestId("modal-inativacao");
            expect(modal).toHaveAttribute("data-open", "true");
        });

        rerender(<PageHeader title="Editar Unidade Educacional" edit={true} />);

        const confirmarButton = screen.getByText("Confirmar Inativação");
        fireEvent.click(confirmarButton);

        await waitFor(() => {
            expect(mockInativarUnidade).not.toHaveBeenCalled();
        });
    });

    it("deve renderizar botão de voltar no modo edit", () => {
        render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                unidadeUuid="unidade-123"
            />
        );

        const voltarLink = screen.getByRole("link");
        expect(voltarLink).toHaveAttribute(
            "href",
            "/dashboard/gestao-unidades-educacionais"
        );
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
                unidadeUuid="unidade-123"
            />
        );

        const voltarLink = screen.getByRole("link");
        fireEvent.click(voltarLink);

        expect(onClickBack).toHaveBeenCalledTimes(1);
    });

    it("deve ter link correto para gestão de unidades educacionais no modo edit", () => {
        render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                unidadeUuid="unidade-123"
            />
        );

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

    it("deve renderizar ícone de voltar no botão de navegação no modo edit", () => {
        render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                unidadeUuid="unidade-123"
            />
        );

        const voltarLink = screen.getByRole("link");
        expect(voltarLink).toBeInTheDocument();
        expect(voltarLink.querySelector("svg")).toBeInTheDocument();
    });

    it("deve renderizar ícone Ban no botão de inativar", () => {
        render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                unidadeUuid="unidade-123"
            />
        );

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
        render(
            <PageHeader
                title="Editar Unidade Educacional"
                edit={true}
                unidadeUuid="unidade-123"
            />
        );

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
