/* eslint-disable @next/next/no-img-element */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./index";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock do hook useLogin
const mutateAsyncMock = vi.fn();
vi.mock("@/hooks/useLogin", () => ({
    __esModule: true,
    default: () => ({ mutateAsync: mutateAsyncMock }),
}));

// Mock do Next.js Image
vi.mock("next/image", () => ({
    default: (props: Record<string, unknown>) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { priority, ...rest } = props || {};
        return (
            <img alt={typeof rest.alt === "string" ? rest.alt : ""} {...rest} />
        );
    },
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
        mutateAsyncMock.mockRejectedValueOnce(new Error("fail"));

        render(<LoginForm />, { wrapper });

        fireEvent.input(screen.getByPlaceholderText("Digite um RF ou CPF"), {
            target: { value: "123456" },
        });
        fireEvent.input(screen.getByPlaceholderText("Digite sua senha"), {
            target: { value: "senhaerrada" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Acessar" }));

        await waitFor(() => {
            expect(screen.getByText("fail")).toBeInTheDocument();
        });
    });

    it("redireciona se o login for bem-sucedido", async () => {
        mutateAsyncMock.mockResolvedValueOnce({});

        render(<LoginForm />, { wrapper });

        fireEvent.input(screen.getByPlaceholderText("Digite um RF ou CPF"), {
            target: { value: "123456" },
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
        // Simula o hook retornando um erro com a propriedade 'detail'
        mutateAsyncMock.mockRejectedValueOnce({
            detail: "Mensagem detalhada de erro",
        });

        render(<LoginForm />, { wrapper });

        fireEvent.input(screen.getByPlaceholderText("Digite um RF ou CPF"), {
            target: { value: "123456" },
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
});
