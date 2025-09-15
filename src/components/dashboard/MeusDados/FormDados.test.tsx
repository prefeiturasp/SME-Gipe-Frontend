import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import FormDados from "./FormDados";

interface MockUser {
    nome: string;
    perfil_acesso: string;
    cpf: string;
    unidade: { nomeUnidade: string }[];
    email: string;
}
const mockUser: MockUser = {
    nome: "João da Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    perfil_acesso: "Administrador",
    unidade: [{ nomeUnidade: "Escola XPTO" }],
};

const mutateAsyncMock = vi.fn();
const toastMock = vi.fn();

vi.mock("@/stores/useUserStore", () => {
  const mockUser = {
    nome: "João da Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    perfil_acesso: "Administrador",
    unidade: [{ nomeUnidade: "Escola XPTO" }],
  };

  const mockSetUser = vi.fn();

  const mockUserStore = {
    user: mockUser,
    setUser: mockSetUser,
  };

  const mockedHook = (selector: (state: typeof mockUserStore) => unknown) =>
    selector(mockUserStore);

  return {
    useUserStore: Object.assign(mockedHook, {
      getState: () => mockUserStore,
    }),
    // 👇 exporta se precisar usar nos expects
    __mockUser: mockUser,
    __mockSetUser: mockSetUser,
  };
});


vi.mock("@/hooks/useAtualizarNome", () => ({
    default: () => ({
        mutateAsync: mutateAsyncMock,
        isPending: false,
    }),
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: (args: any) => toastMock(args),
}));

const pushSpy = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushSpy,
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
}));

function renderWithQueryProvider(ui: React.ReactElement) {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
}

describe("FormDados", () => {
    beforeEach(() => {
        pushSpy.mockClear();
        mutateAsyncMock.mockReset();
        toastMock.mockReset();
    });

    it("renderiza os campos com valores do usuário", () => {
        renderWithQueryProvider(<FormDados />);

        expect(screen.getByLabelText(/nome completo/i)).toHaveValue(
            mockUser.nome
        );
        expect(screen.getByLabelText(/e-mail/i)).toHaveValue(mockUser.email);
        expect(screen.getByLabelText(/cpf/i)).toHaveValue(mockUser.cpf);
        expect(screen.getByLabelText(/perfil de acesso/i)).toHaveValue(
            mockUser.perfil_acesso
        );
    });

    it("mostra erro se nome tiver menos de 3 caracteres ao confirmar edição", async () => {
        const user = userEvent.setup();
        renderWithQueryProvider(<FormDados />);

        const inputNome = screen.getByLabelText(/nome completo/i);
        const btnAlterarNome = screen.getByRole("button", { name: /alterar nome/i });
        await user.click(btnAlterarNome);

        await user.clear(inputNome);
        await user.type(inputNome, "Jo");

        const btnConfirmar = screen.getByRole("button", { name: /confirmar/i });
        await user.click(btnConfirmar);

        expect(
            await screen.findByText("Informe o nome completo")
        ).toBeInTheDocument();
    });

    it("mostra erro se nome tiver números ou caracteres especiais ao confirmar edição", async () => {
        const user = userEvent.setup();
        renderWithQueryProvider(<FormDados />);

        const inputNome = screen.getByLabelText(/nome completo/i);
        const btnAlterarNome = screen.getByRole("button", { name: /alterar nome/i });
        await user.click(btnAlterarNome);

        await user.clear(inputNome);
        await user.type(inputNome, "João123");

        const btnConfirmar = screen.getByRole("button", { name: /confirmar/i });
        await user.click(btnConfirmar);

        expect(
            await screen.findByText(
                "O nome não pode conter números ou caracteres especiais"
            )
        ).toBeInTheDocument();
    });

    it("mostra erro se nome não tiver sobrenome (sem espaço) ao confirmar edição", async () => {
        const user = userEvent.setup();
        renderWithQueryProvider(<FormDados />);

        const inputNome = screen.getByLabelText(/nome completo/i);
        const btnAlterarNome = screen.getByRole("button", { name: /alterar nome/i });
        await user.click(btnAlterarNome);

        await user.clear(inputNome);
        await user.type(inputNome, "Joao");

        const btnConfirmar = screen.getByRole("button", { name: /confirmar/i });
        await user.click(btnConfirmar);

        expect(
            await screen.findByText(
                "Informe o nome completo (nome e sobrenome)"
            )
        ).toBeInTheDocument();
    });

    it("restaura o nome original ao clicar em Cancelar na edição", async () => {
        const user = userEvent.setup();
        renderWithQueryProvider(<FormDados />);

        const inputNome = screen.getByLabelText(/nome completo/i);
        const btnAlterarNome = screen.getByRole("button", { name: /alterar nome/i });
        await user.click(btnAlterarNome);

        await user.clear(inputNome);
        await user.type(inputNome, "Novo Nome");
        expect(inputNome).toHaveValue("Novo Nome");

        const btnCancelar = screen.getByRole("button", { name: /cancelar/i });
        await user.click(btnCancelar);

        expect(inputNome).toHaveValue(mockUser.nome);
    });

    it("atualiza o nome com sucesso ao confirmar edição", async () => {
        mutateAsyncMock.mockResolvedValue({ success: true });
        const user = userEvent.setup();
        renderWithQueryProvider(<FormDados />);

        const inputNome = screen.getByLabelText(/nome completo/i);
        const btnAlterarNome = screen.getByRole("button", { name: /alterar nome/i });
        await user.click(btnAlterarNome);

        await user.clear(inputNome);
        await user.type(inputNome, "Maria Souza");

        const btnConfirmar = screen.getByRole("button", { name: /confirmar/i });
        await user.click(btnConfirmar);

        expect(mutateAsyncMock).toHaveBeenCalledWith({ name: "Maria Souza" });
        expect(toastMock).toHaveBeenCalledWith(
            expect.objectContaining({
                variant: "success",
                title: expect.any(String),
            })
        );
    });

    it("mostra erro ao confirmar edição se mutateAsync falhar", async () => {
        mutateAsyncMock.mockResolvedValue({ success: false, error: "Erro fake" });
        const user = userEvent.setup();
        renderWithQueryProvider(<FormDados />);

        const inputNome = screen.getByLabelText(/nome completo/i);
        const btnAlterarNome = screen.getByRole("button", { name: /alterar nome/i });
        await user.click(btnAlterarNome);

        await user.clear(inputNome);
        await user.type(inputNome, "Maria Souza");

        const btnConfirmar = screen.getByRole("button", { name: /confirmar/i });
        await user.click(btnConfirmar);

        expect(mutateAsyncMock).toHaveBeenCalledWith({ name: "Maria Souza" });
        expect(toastMock).toHaveBeenCalledWith(
            expect.objectContaining({
                variant: "error",
                title: expect.any(String),
                description: "Erro fake",
            })
        );
    });

    it("abre o modal de nova senha ao clicar em 'Alterar senha'", async () => {
        const user = userEvent.setup();
        renderWithQueryProvider(<FormDados />);
        const btnAlterarSenha = screen.getByRole("button", {
            name: /alterar senha/i,
        });
        await user.click(btnAlterarSenha);
        expect(
            await screen.findByRole("heading", { name: /nova senha/i })
        ).toBeInTheDocument();
    });

    it("abre o modal de nova senha ao clicar em 'Alterar email'", async () => {
        const user = userEvent.setup();
        renderWithQueryProvider(<FormDados />);
        const btnAlterarEmail = screen.getByRole("button", {
            name: /alterar e-mail/i,
        });
        await user.click(btnAlterarEmail);
        expect(
            await screen.findByRole("heading", { name: /Alteração de e-mail/i })
        ).toBeInTheDocument();
    });
});
