import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AlterarSenha from "./index";

const mutateAsyncMock = vi.fn();
vi.mock("@/hooks/useRedefinirSenha", () => ({
    __esModule: true,
    default: () => ({
        mutateAsync: mutateAsyncMock,
        isPending: false,
    }),
}));

describe("AlterarSenha", () => {
    const defaultProps = { code: "uid123", token: "token123" };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza campos e botão desabilitado inicialmente", () => {
        render(<AlterarSenha {...defaultProps} />);
        expect(screen.getByTestId("input-password")).toBeInTheDocument();
        expect(
            screen.getByTestId("input-confirm-password")
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /salvar senha/i })
        ).toBeDisabled();
    });

    it("habilita o botão quando senha e confirmação são válidas", async () => {
        render(<AlterarSenha {...defaultProps} />);
        const user = userEvent.setup();
        const senhaInput = screen.getByTestId("input-password");
        const confirmarInput = screen.getByTestId("input-confirm-password");
        await user.type(senhaInput, "Senha@123");
        await user.type(confirmarInput, "Senha@123");
        expect(
            screen.getByRole("button", { name: /salvar senha/i })
        ).toBeEnabled();
    });

    it("exibe mensagem de sucesso ao redefinir senha", async () => {
        mutateAsyncMock.mockResolvedValueOnce({ success: true });
        render(<AlterarSenha {...defaultProps} />);
        const user = userEvent.setup();
        const senhaInput = screen.getByTestId("input-password");
        const confirmarInput = screen.getByTestId("input-confirm-password");
        await user.type(senhaInput, "Senha@123");
        await user.type(confirmarInput, "Senha@123");
        fireEvent.click(screen.getByRole("button", { name: /salvar senha/i }));
        await waitFor(() => {
            expect(
                screen.getByText(/senha criada com sucesso/i)
            ).toBeInTheDocument();
            expect(screen.getByText(/acessar agora/i)).toBeInTheDocument();
        });
    });

    it("exibe mensagem de erro ao falhar na redefinição", async () => {
        mutateAsyncMock.mockResolvedValueOnce({
            success: false,
            error: "Token expirado",
        });
        render(<AlterarSenha {...defaultProps} />);
        const user = userEvent.setup();
        const senhaInput = screen.getByTestId("input-password");
        const confirmarInput = screen.getByTestId("input-confirm-password");
        await user.type(senhaInput, "Senha@123");
        await user.type(confirmarInput, "Senha@123");
        fireEvent.click(screen.getByRole("button", { name: /salvar senha/i }));
        await waitFor(() => {
            expect(
                screen.getByText(/o link está expirado/i)
            ).toBeInTheDocument();
            expect(
                screen.getByText(/solicitar novo link/i)
            ).toBeInTheDocument();
        });
    });
});
