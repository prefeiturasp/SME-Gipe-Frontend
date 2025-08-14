/* eslint-disable @next/next/no-img-element */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./index";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock do hook useLogin
const mutateAsyncMock = vi.fn();
const onSuccessMock = vi.fn();
vi.mock("@/hooks/useLogin", () => ({
    __esModule: true,
    default: () => ({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        options: { onSuccess: onSuccessMock },
    }),
}));

// Mock do useRouter do Next.js (next/navigation)
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

describe("LoginForm", () => {
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

    it("renderiza os campos de RF/CPF e senha", async () => {
        render(<LoginForm />, { wrapper });

        expect(
            await screen.findByPlaceholderText("Digite um RF ou CPF")
        ).toBeInTheDocument();
        expect(
            await screen.findByPlaceholderText("Digite sua senha")
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("button", { name: "Acessar" })
        ).toBeInTheDocument();
    });

    it("exibe mensagem de erro ao submeter com credenciais inválidas", async () => {
        mutateAsyncMock.mockResolvedValueOnce({
            success: false,
            error: "Erro ao autenticar",
        });

        render(<LoginForm />, { wrapper });

        fireEvent.input(screen.getByPlaceholderText("Digite um RF ou CPF"), {
            target: { value: "1234567" },
        });
        fireEvent.input(screen.getByPlaceholderText("Digite sua senha"), {
            target: { value: "senhaerrada" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Acessar" }));

        await waitFor(() => {
            expect(screen.getByText("Erro ao autenticar")).toBeInTheDocument();
        });
    });

    it("redireciona se o login for bem-sucedido", async () => {
        mutateAsyncMock.mockImplementationOnce(async () => {
            pushMock("/dashboard");
            return {};
        });

        render(<LoginForm />, { wrapper });

        fireEvent.input(screen.getByPlaceholderText("Digite um RF ou CPF"), {
            target: { value: "1234567" },
        });
        fireEvent.input(screen.getByPlaceholderText("Digite sua senha"), {
            target: { value: "senha123" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Acessar" }));

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith("/dashboard");
        });
    });

    it("alterna visibilidade da senha ao clicar no botão", async () => {
        render(<LoginForm />, { wrapper });

        const passwordInput = await screen.findByPlaceholderText(
            "Digite sua senha"
        );
        const toggleButton = screen.getByRole("button", {
            name: /senha visível|senha invisível/i,
        });

        expect(passwordInput).toHaveAttribute("type", "password");

        fireEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute("type", "text");

        fireEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("exibe mensagem de erro customizada quando o erro possui 'detail'", async () => {
        mutateAsyncMock.mockResolvedValueOnce({
            success: false,
            error: "Mensagem detalhada de erro",
        });

        render(<LoginForm />, { wrapper });

        fireEvent.input(screen.getByPlaceholderText("Digite um RF ou CPF"), {
            target: { value: "1234567" },
        });

        fireEvent.input(screen.getByPlaceholderText("Digite sua senha"), {
            target: { value: "senhaerrada" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Acessar" }));

        await waitFor(() => {
            expect(
                screen.getByText("Mensagem detalhada de erro")
            ).toBeInTheDocument();
        });
    });

    it("exibe mensagem de erro ao submeter CPF inválido", async () => {
        render(<LoginForm />, { wrapper });

        fireEvent.input(screen.getByPlaceholderText("Digite um RF ou CPF"), {
            target: { value: "12345678900" },
        });
        fireEvent.input(screen.getByPlaceholderText("Digite sua senha"), {
            target: { value: "senha123" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Acessar" }));

        await waitFor(() => {
            expect(screen.getByText("CPF inválido")).toBeInTheDocument();
        });
    });

    it("exibe mensagem padrão de erro ao autenticar", async () => {
        mutateAsyncMock.mockResolvedValueOnce({
            success: false,
            error: "Erro ao autenticar",
        });

        render(<LoginForm />, { wrapper });

        fireEvent.input(screen.getByPlaceholderText("Digite um RF ou CPF"), {
            target: { value: "1234567" },
        });
        fireEvent.input(screen.getByPlaceholderText("Digite sua senha"), {
            target: { value: "senhaerrada" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Acessar" }));

        await waitFor(() => {
            expect(screen.getByText("Erro ao autenticar")).toBeInTheDocument();
        });
    });

    it("chama router.push ao clicar em Cadastre-se", async () => {
        render(<LoginForm />);

        const cadastreSeButton = screen.getByRole("button", {
            name: "Cadastre-se",
        });
        fireEvent.click(cadastreSeButton);
        expect(pushMock).toHaveBeenCalledWith("/cadastro");
    });

    it("chama router.push ao clicar em Esqueci minha senha", async () => {
        render(<LoginForm />);

        const esqueciSenhaButton = screen.getByRole("button", {
            name: /esqueci minha senha/i,
        });
        fireEvent.click(esqueciSenhaButton);
        expect(pushMock).toHaveBeenCalledWith("/recuperar-senha");
    });
});
