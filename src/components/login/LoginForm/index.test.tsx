/* eslint-disable @next/next/no-img-element */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./index";
import { vi } from "vitest";

// Mock da view.ts
// vi.mock("./view", () => ({
//     default: () => ({
//         onSubmit: mockOnSubmit,
//     }),
// }));

// Mock do hook useFakeLogin
const mockFakeLogin = vi.fn();
vi.mock("@/lib/fakeLogin", () => ({
    useFakeLogin: () => mockFakeLogin,
}));

vi.mock("next/image", () => ({
    default: (props: Record<string, unknown>) => {
        // eslint-disable-next-line @next/next/no-img-element, @typescript-eslint/no-unused-vars
        const { priority, ...rest } = props || {};
        return (
            <img alt={typeof rest.alt === "string" ? rest.alt : ""} {...rest} />
        );
    },
}));

describe("LoginForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza os campos de RF/CPF e senha", async () => {
        render(<LoginForm />);

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
        mockFakeLogin.mockReturnValue(false);

        render(<LoginForm />);

        fireEvent.input(screen.getByPlaceholderText("Digite um RF ou CPF"), {
            target: { value: "123456" },
        });

        fireEvent.input(screen.getByPlaceholderText("Digite sua senha"), {
            target: { value: "senhaerrada" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Acessar" }));

        await waitFor(() => {
            expect(
                screen.getByText("Credenciais inválidas")
            ).toBeInTheDocument();
        });
    });

    it("redireciona se o login for bem-sucedido", async () => {
        mockFakeLogin.mockReturnValue(true);

        Object.defineProperty(window, "location", {
            value: { href: "" },
            writable: true,
        });

        render(<LoginForm />);

        fireEvent.input(screen.getByPlaceholderText("Digite um RF ou CPF"), {
            target: { value: "123456" },
        });

        fireEvent.input(screen.getByPlaceholderText("Digite sua senha"), {
            target: { value: "senha123" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Acessar" }));

        await waitFor(() => {
            expect(window.location.href).toBe("/dashboard");
        });
    });

    it("alterna visibilidade da senha ao clicar no botão", async () => {
        render(<LoginForm />);

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
});
