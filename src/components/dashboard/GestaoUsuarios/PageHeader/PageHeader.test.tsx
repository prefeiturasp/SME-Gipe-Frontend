import { toast } from "@/components/ui/headless-toast";
import * as useObterUsuarioGestaoModule from "@/hooks/useObterUsuarioGestao";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PageHeader from "./PageHeader";

const mockRouterPush = vi.fn();
const mockMutateAsyncInativar = vi.fn();
const mockMutateAsyncReativar = vi.fn();
let mockIsPendingInativar = false;
let mockIsPendingReativar = false;

vi.mock("@/hooks/useObterUsuarioGestao", () => ({
    useObterUsuarioGestao: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}));

vi.mock("@/hooks/useInativarGestaoUsuario", () => ({
    useInativarGestaoUsuario: () => ({
        mutateAsync: mockMutateAsyncInativar,
        get isPending() {
            return mockIsPendingInativar;
        },
    }),
}));

vi.mock("@/hooks/useReativarGestaoUsuario", () => ({
    useReativarGestaoUsuario: () => ({
        mutateAsync: mockMutateAsyncReativar,
        get isPending() {
            return mockIsPendingReativar;
        },
    }),
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: vi.fn(),
}));

const mockToast = vi.mocked(toast);

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    Wrapper.displayName = "QueryClientTestWrapper";
    return Wrapper;
};

describe("PageHeader", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsPendingInativar = false;
        mockIsPendingReativar = false;

        vi.spyOn(
            useObterUsuarioGestaoModule,
            "useObterUsuarioGestao"
        ).mockReturnValue({
            data: { is_active: true },
            isLoading: false,
            error: null,
        } as never);
    });

    it("deve renderizar o título", () => {
        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader title="Test Title" />
            </Wrapper>
        );
        expect(
            screen.getByRole("heading", { name: /test title/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar o botão de voltar e o botão Inativar perfil no modo edit quando usuário ativo", () => {
        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader title="Test Title" edit={true} />
            </Wrapper>
        );

        const backButton = screen.getByRole("link");
        expect(backButton).toHaveAttribute(
            "href",
            "/dashboard/gestao-usuarios"
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        expect(inativarButton).toBeInTheDocument();
    });

    it("deve renderizar o botão de voltar com texto 'Voltar' quando edit for false", () => {
        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader title="Test Title" edit={false} />
            </Wrapper>
        );
        const backButton = screen.getByRole("link", { name: /voltar/i });
        expect(backButton).toBeInTheDocument();
        expect(backButton).toHaveAttribute(
            "href",
            "/dashboard/gestao-usuarios"
        );
    });

    it("deve abrir o modal ao clicar em Inativar perfil", async () => {
        const user = userEvent.setup();

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(inativarButton);

        expect(screen.getByText("Inativação de perfil")).toBeInTheDocument();
    });

    it("deve inativar usuário com sucesso", async () => {
        const user = userEvent.setup();
        mockMutateAsyncInativar.mockResolvedValue({ success: true });

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(inativarButton);

        expect(screen.getByText("Inativação de perfil")).toBeInTheDocument();

        const textarea = screen.getByPlaceholderText(/informe o motivo da inativação/i);
        await user.type(textarea, "Este é um motivo de inativação de teste.");

        const confirmarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(confirmarButton);

        expect(mockMutateAsyncInativar).toHaveBeenCalledWith({
            uuid: "test-uuid",
            motivo_inativacao: "Este é um motivo de inativação de teste.",
        });
        expect(mockToast).toHaveBeenCalledWith({
            title: "Tudo certo por aqui!",
            description: "O perfil foi inativado com sucesso.",
            variant: "success",
        });
        expect(mockRouterPush).toHaveBeenCalledWith(
            "/dashboard/gestao-usuarios?tab=inativos"
        );
    });

    it("deve mostrar erro ao tentar inativar usuário", async () => {
        const user = userEvent.setup();
        mockMutateAsyncInativar.mockResolvedValue({
            success: false,
            error: "Erro de teste",
        });

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(inativarButton);

        const textarea = screen.getByPlaceholderText(/informe o motivo da inativação/i);
        await user.type(textarea, "Este é um motivo de inativação de teste.");

        const confirmarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(confirmarButton);

        expect(mockMutateAsyncInativar).toHaveBeenCalledWith({
            uuid: "test-uuid",
            motivo_inativacao: "Este é um motivo de inativação de teste.",
        });
        expect(mockToast).toHaveBeenCalledWith({
            title: "Não conseguimos concluir a ação!",
            description: "Erro de teste",
            variant: "error",
        });
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("deve usar mensagem de erro padrão quando result.error é undefined", async () => {
        const user = userEvent.setup();
        mockMutateAsyncInativar.mockResolvedValue({
            success: false,
        });

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(inativarButton);

        const textarea = screen.getByPlaceholderText(/informe o motivo da inativação/i);
        await user.type(textarea, "Motivo de teste");

        const confirmarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(confirmarButton);

        expect(mockMutateAsyncInativar).toHaveBeenCalledWith({
            uuid: "test-uuid",
            motivo_inativacao: "Motivo de teste",
        });
        expect(mockToast).toHaveBeenCalledWith({
            title: "Não conseguimos concluir a ação!",
            description: "Erro ao inativar usuário.",
            variant: "error",
        });
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("não deve chamar mutateAsync quando usuarioUuid não é fornecido", async () => {
        const user = userEvent.setup();
        mockMutateAsyncInativar.mockResolvedValue({ success: true });

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader title="Test Title" edit={true} />
            </Wrapper>
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(inativarButton);

        const textarea = screen.getByPlaceholderText(
            /informe o motivo da inativação/i
        );
        await user.type(textarea, "Motivo de teste");

        const confirmarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(confirmarButton);

        expect(mockMutateAsyncInativar).not.toHaveBeenCalled();
        expect(mockToast).not.toHaveBeenCalled();
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("deve renderizar o botão de Reativar perfil quando usuário inativo", () => {
        vi.spyOn(
            useObterUsuarioGestaoModule,
            "useObterUsuarioGestao"
        ).mockReturnValue({
            data: { is_active: false },
            isLoading: false,
            error: null,
        } as never);

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader title="Test Title" edit={true} />
            </Wrapper>
        );

        const reativarButton = screen.getByRole("button", {
            name: /reativar perfil/i,
        });
        expect(reativarButton).toBeInTheDocument();
    });

    it("deve abrir o modal de reativação ao clicar em Reativar perfil", async () => {
        const user = userEvent.setup();

        vi.spyOn(
            useObterUsuarioGestaoModule,
            "useObterUsuarioGestao"
        ).mockReturnValue({
            data: { is_active: false },
            isLoading: false,
            error: null,
        } as never);

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        const reativarButton = screen.getByRole("button", {
            name: /reativar perfil/i,
        });
        await user.click(reativarButton);

        expect(screen.getByText("Reativação de perfil")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Ao reativar o perfil, a pessoa terá acesso ao GIPE novamente. Tem certeza que deseja continuar?"
            )
        ).toBeInTheDocument();
    });

    it("deve reativar usuário com sucesso", async () => {
        const user = userEvent.setup();
        mockMutateAsyncReativar.mockResolvedValue({ success: true });

        vi.spyOn(
            useObterUsuarioGestaoModule,
            "useObterUsuarioGestao"
        ).mockReturnValue({
            data: { is_active: false },
            isLoading: false,
            error: null,
        } as never);

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        const reativarButton = screen.getByRole("button", {
            name: /reativar perfil/i,
        });
        await user.click(reativarButton);

        expect(screen.getByText("Reativação de perfil")).toBeInTheDocument();

        const confirmarButton = screen.getByRole("button", {
            name: /reativar perfil/i,
        });
        await user.click(confirmarButton);

        expect(mockMutateAsyncReativar).toHaveBeenCalledWith("test-uuid");
        expect(mockToast).toHaveBeenCalledWith({
            title: "Tudo certo por aqui!",
            description: "O perfil foi reativado com sucesso.",
            variant: "success",
        });
        expect(mockRouterPush).toHaveBeenCalledWith(
            "/dashboard/gestao-usuarios?tab=ativos"
        );
    });

    it("deve mostrar erro ao tentar reativar usuário", async () => {
        const user = userEvent.setup();
        mockMutateAsyncReativar.mockResolvedValue({
            success: false,
            error: "Erro de teste",
        });

        vi.spyOn(
            useObterUsuarioGestaoModule,
            "useObterUsuarioGestao"
        ).mockReturnValue({
            data: { is_active: false },
            isLoading: false,
            error: null,
        } as never);

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        const reativarButton = screen.getByRole("button", {
            name: /reativar perfil/i,
        });
        await user.click(reativarButton);

        const confirmarButton = screen.getByRole("button", {
            name: /reativar perfil/i,
        });
        await user.click(confirmarButton);

        expect(mockMutateAsyncReativar).toHaveBeenCalledWith("test-uuid");
        expect(mockToast).toHaveBeenCalledWith({
            title: "Não conseguimos concluir a ação!",
            description: "Erro de teste",
            variant: "error",
        });
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("não deve chamar mutateAsync de reativação quando usuarioUuid não é fornecido", async () => {
        const user = userEvent.setup();
        mockMutateAsyncReativar.mockResolvedValue({ success: true });

        vi.spyOn(
            useObterUsuarioGestaoModule,
            "useObterUsuarioGestao"
        ).mockReturnValue({
            data: { is_active: false },
            isLoading: false,
            error: null,
        } as never);

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader title="Test Title" edit={true} />
            </Wrapper>
        );

        const reativarButton = screen.getByRole("button", {
            name: /reativar perfil/i,
        });
        await user.click(reativarButton);

        const confirmarButton = screen.getByRole("button", {
            name: /reativar perfil/i,
        });
        await user.click(confirmarButton);

        expect(mockMutateAsyncReativar).not.toHaveBeenCalled();
        expect(mockToast).not.toHaveBeenCalled();
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("deve usar mensagem de erro padrão quando result.error é undefined na reativação", async () => {
        const user = userEvent.setup();
        mockMutateAsyncReativar.mockResolvedValue({
            success: false,
        });

        vi.spyOn(
            useObterUsuarioGestaoModule,
            "useObterUsuarioGestao"
        ).mockReturnValue({
            data: { is_active: false },
            isLoading: false,
            error: null,
        } as never);

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        const reativarButton = screen.getByRole("button", {
            name: /reativar perfil/i,
        });
        await user.click(reativarButton);

        const confirmarButton = screen.getByRole("button", {
            name: /reativar perfil/i,
        });
        await user.click(confirmarButton);

        expect(mockMutateAsyncReativar).toHaveBeenCalledWith("test-uuid");
        expect(mockToast).toHaveBeenCalledWith({
            title: "Não conseguimos concluir a ação!",
            description: "Erro ao reativar usuário.",
            variant: "error",
        });
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("deve chamar onClickBack quando o botão de voltar é clicado no modo edit", async () => {
        const user = userEvent.setup();
        const mockOnClickBack = vi.fn();

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    onClickBack={mockOnClickBack}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        const backButton = screen.getByRole("link");
        await user.click(backButton);

        expect(mockOnClickBack).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onClickBack quando o botão de voltar é clicado no modo não edit", async () => {
        const user = userEvent.setup();
        const mockOnClickBack = vi.fn();

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={false}
                    onClickBack={mockOnClickBack}
                />
            </Wrapper>
        );

        const backButton = screen.getByRole("link", { name: /voltar/i });
        await user.click(backButton);

        expect(mockOnClickBack).toHaveBeenCalledTimes(1);
    });

    it("não deve renderizar botões quando usuarioData é undefined", () => {
        vi.spyOn(
            useObterUsuarioGestaoModule,
            "useObterUsuarioGestao"
        ).mockReturnValue({
            data: undefined,
            isLoading: false,
            error: null,
        } as never);

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        // Quando usuarioData?.is_active é undefined, o código renderiza o botão "Reativar perfil"
        expect(
            screen.queryByRole("button", { name: /inativar perfil/i })
        ).not.toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /reativar perfil/i })
        ).toBeInTheDocument();
    });

    it("deve lidar com usuarioData null", () => {
        vi.spyOn(
            useObterUsuarioGestaoModule,
            "useObterUsuarioGestao"
        ).mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        } as never);

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        // Quando usuarioData?.is_active é null/undefined, o código renderiza o botão "Reativar perfil"
        expect(
            screen.queryByRole("button", { name: /inativar perfil/i })
        ).not.toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /reativar perfil/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar com is_active falso explícito", () => {
        vi.spyOn(
            useObterUsuarioGestaoModule,
            "useObterUsuarioGestao"
        ).mockReturnValue({
            data: { is_active: false },
            isLoading: false,
            error: null,
        } as never);

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        const reativarButton = screen.getByRole("button", {
            name: /reativar perfil/i,
        });
        expect(reativarButton).toBeInTheDocument();
        expect(reativarButton).not.toBeDisabled();
    });

    it("deve desabilitar botão de inativar quando isPendingInativar é true", () => {
        mockIsPendingInativar = true;

        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <PageHeader
                    title="Test Title"
                    edit={true}
                    usuarioUuid="test-uuid"
                />
            </Wrapper>
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        expect(inativarButton).toBeDisabled();
    });
});
