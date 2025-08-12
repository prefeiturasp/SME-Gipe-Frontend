import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

// Mock do useRouter do Next.js (next/navigation)
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

describe("FormRecuperarSenha", () => {
    let queryClient: QueryClient;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
    });

    it("renderiza o campo de RF/CPF e botão Continuar", async () => {
        render(<LoginForm />, { wrapper });
        expect(
            await screen.findByPlaceholderText("Digite um RF ou CPF")
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /continuar/i })
        ).toBeInTheDocument();
    });

    it("exibe mensagem de sucesso ao submeter o formulário", async () => {
        render(<LoginForm />, { wrapper });
        fireEvent.input(screen.getByPlaceholderText("Digite um RF ou CPF"), {
            target: { value: "47198005055" },
        });
        fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
        await waitFor(() => {
            expect(
                screen.getByText(
                    /Seu link de recuperação de senha foi enviado/i
                )
            ).toBeInTheDocument();
        });
    });

    it("exibe o ícone de sucesso ao submeter com sucesso", async () => {
        render(<LoginForm />, { wrapper });
        fireEvent.input(screen.getByPlaceholderText("Digite um RF ou CPF"), {
            target: { value: "1234567" },
        });
        fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
        await waitFor(() => {
            expect(screen.getByTestId("check-icon")).toBeInTheDocument();
        });
    });

    it("redireciona ao clicar em Voltar", async () => {
        render(<LoginForm />, { wrapper });
        fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
        expect(pushMock).toHaveBeenCalledWith("/");
    });
});
