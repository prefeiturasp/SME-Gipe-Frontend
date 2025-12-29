import { toast } from "@/components/ui/headless-toast";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PageHeader from "./PageHeader";

const mockRouterPush = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}));

vi.mock("@/hooks/useInativarGestaoUsuario", () => ({
    useInativarGestaoUsuario: () => ({
        mutateAsync: mockMutateAsync,
        isPending: false,
    }),
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: vi.fn(),
}));

const mockToast = vi.mocked(toast);

describe("PageHeader", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it("deve renderizar o título", () => {
        render(<PageHeader title="Test Title" />);
        expect(
            screen.getByRole("heading", { name: /test title/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar o botão de voltar e o botão Inativar perfil no modo edit", () => {
        render(<PageHeader title="Test Title" edit={true} />);
        const backButton = screen.getByRole("link");
        expect(backButton).toHaveAttribute(
            "href",
            "/dashboard/gestao-usuarios"
        );
        expect(
            screen.getByRole("button", { name: /inativar perfil/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar o botão de voltar com texto 'Voltar' quando edit for false", () => {
        render(<PageHeader title="Test Title" edit={false} />);
        const backButton = screen.getByRole("link", { name: /voltar/i });
        expect(backButton).toBeInTheDocument();
        expect(backButton).toHaveAttribute(
            "href",
            "/dashboard/gestao-usuarios"
        );
    });

    it("deve abrir o modal ao clicar em Inativar perfil", async () => {
        const user = userEvent.setup();

        render(
            <PageHeader
                title="Test Title"
                edit={true}
                usuarioUuid="test-uuid"
            />
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(inativarButton);

        // Verifica se o modal abriu
        expect(screen.getByText("Inativação de perfil")).toBeInTheDocument();
    });

    it("deve inativar usuário com sucesso", async () => {
        const user = userEvent.setup();
        mockMutateAsync.mockResolvedValue({ success: true });

        render(
            <PageHeader
                title="Test Title"
                edit={true}
                usuarioUuid="test-uuid"
            />
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(inativarButton);

        expect(screen.getByText("Inativação de perfil")).toBeInTheDocument();

        const confirmarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(confirmarButton);

        expect(mockMutateAsync).toHaveBeenCalledWith("test-uuid");
        expect(mockToast).toHaveBeenCalledWith({
            title: "Perfil inativado com sucesso.",
            description: "O usuário não terá mais acesso ao GIPE.",
            variant: "success",
        });
        expect(mockRouterPush).toHaveBeenCalledWith(
            "/dashboard/gestao-usuarios?tab=inativos"
        );
    });

    it("deve mostrar erro ao tentar inativar usuário", async () => {
        const user = userEvent.setup();
        mockMutateAsync.mockResolvedValue({
            success: false,
            error: "Erro de teste",
        });

        render(
            <PageHeader
                title="Test Title"
                edit={true}
                usuarioUuid="test-uuid"
            />
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(inativarButton);

        const confirmarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(confirmarButton);

        expect(mockMutateAsync).toHaveBeenCalledWith("test-uuid");
        expect(mockToast).toHaveBeenCalledWith({
            title: "Não conseguimos concluir a ação!",
            description: "Erro de teste",
            variant: "error",
        });
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("deve usar mensagem de erro padrão quando result.error é undefined", async () => {
        const user = userEvent.setup();
        mockMutateAsync.mockResolvedValue({
            success: false,
        });

        render(
            <PageHeader
                title="Test Title"
                edit={true}
                usuarioUuid="test-uuid"
            />
        );

        const inativarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(inativarButton);

        const confirmarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(confirmarButton);

        expect(mockMutateAsync).toHaveBeenCalledWith("test-uuid");
        expect(mockToast).toHaveBeenCalledWith({
            title: "Não conseguimos concluir a ação!",
            description: "Erro ao inativar usuário.",
            variant: "error",
        });
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("não deve chamar mutateAsync quando usuarioUuid não é fornecido", async () => {
        const user = userEvent.setup();
        mockMutateAsync.mockResolvedValue({ success: true });

        render(<PageHeader title="Test Title" edit={true} />);

        const inativarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(inativarButton);

        const confirmarButton = screen.getByRole("button", {
            name: /inativar perfil/i,
        });
        await user.click(confirmarButton);

        expect(mockMutateAsync).not.toHaveBeenCalled();
        expect(mockToast).not.toHaveBeenCalled();
        expect(mockRouterPush).not.toHaveBeenCalled();
    });
});
