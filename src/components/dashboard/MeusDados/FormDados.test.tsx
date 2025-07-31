import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const mockUser: MockUser = {
    nome: "João da Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    perfil_acesso: "Administrador",
    unidade: [{ nomeUnidade: "Escola XPTO" }],
};

interface MockUser {
    nome: string;
    perfil_acesso: string;
    cpf: string;
    unidade: { nomeUnidade: string }[];
    email: string;
}

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: (selector: (state: { user: MockUser }) => unknown) =>
        selector({
            user: mockUser,
        }),
}));
const pushSpy = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushSpy,
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
}));

import FormDados from "./FormDados";

describe("FormDados", () => {
    beforeEach(() => {
        pushSpy.mockClear();
    });

    it("renderiza os campos com valores do usuário", () => {
        render(<FormDados />);

        expect(screen.getByLabelText(/nome completo/i)).toHaveValue(
            mockUser.nome
        );
        expect(screen.getByLabelText(/e-mail/i)).toHaveValue(mockUser.email);
        expect(screen.getByLabelText(/cpf/i)).toHaveValue(mockUser.cpf);
        expect(screen.getByLabelText(/perfil de acesso/i)).toHaveValue(
            mockUser.perfil_acesso
        );
    });

    it("botão 'Salvar alterações' começa desabilitado", () => {
        render(<FormDados />);
        const btnSalvar = screen.getByRole("button", {
            name: /salvar alterações/i,
        });
        expect(btnSalvar).toBeDisabled();
    });

    it("habilita o botão 'Salvar alterações' ao alterar um campo", async () => {
        const user = userEvent.setup();
        render(<FormDados />);

        const inputNome = screen.getByLabelText(/nome completo/i);
        await user.clear(inputNome);
        await user.type(inputNome, "Novo Nome");

        const btnSalvar = screen.getByRole("button", {
            name: /salvar alterações/i,
        });
        expect(btnSalvar).toBeEnabled();
    });

    it("chama router.push('/dashboard') ao clicar em 'Cancelar'", async () => {
        const user = userEvent.setup();
        render(<FormDados />);

        const btnCancelar = screen.getByRole("button", { name: /cancelar/i });
        await user.click(btnCancelar);

        expect(pushSpy).toHaveBeenCalledWith("/dashboard");
    });

    it("mostra erro se nome tiver menos de 3 caracteres ao submeter", async () => {
        const user = userEvent.setup();
        render(<FormDados />);

        const inputNome = screen.getByLabelText(/nome completo/i);
        await user.clear(inputNome);
        await user.type(inputNome, "Jo");

        const btnSalvar = screen.getByRole("button", {
            name: /salvar alterações/i,
        });
        await user.click(btnSalvar);

        expect(
            await screen.findByText("Informe o nome completo")
        ).toBeInTheDocument();
    });

    it("mostra erro se nome tiver números ou caracteres especiais ao submeter", async () => {
        const user = userEvent.setup();
        render(<FormDados />);

        const inputNome = screen.getByLabelText(/nome completo/i);
        await user.clear(inputNome);
        await user.type(inputNome, "João123");

        const btnSalvar = screen.getByRole("button", {
            name: /salvar alterações/i,
        });
        await user.click(btnSalvar);

        expect(
            await screen.findByText(
                "O nome não pode conter números ou caracteres especiais"
            )
        ).toBeInTheDocument();
    });

    it("mostra erro se nome não tiver sobrenome (sem espaço) ao submeter", async () => {
        const user = userEvent.setup();
        render(<FormDados />);

        const inputNome = screen.getByLabelText(/nome completo/i);
        await user.clear(inputNome);
        await user.type(inputNome, "Joao");

        const btnSalvar = screen.getByRole("button", {
            name: /salvar alterações/i,
        });
        await user.click(btnSalvar);

        expect(
            await screen.findByText(
                "Informe o nome completo (nome e sobrenome)"
            )
        ).toBeInTheDocument();
    });
});
