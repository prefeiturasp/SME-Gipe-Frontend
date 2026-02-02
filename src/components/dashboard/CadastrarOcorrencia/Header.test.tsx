import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "./Header";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    usePathname: () => "/",
}));

vi.mock("./ModalSemUnidade", () => ({
    default: ({
        open,
        onOpenChange,
    }: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
    }) => (
        <div data-testid="modal-sem-unidade" data-open={open}>
            <h1>Não encontramos a sua Unidade Educacional</h1>
            <button onClick={() => onOpenChange(false)}>Fechar</button>
        </div>
    ),
}));

interface MockUser {
    unidades?: { uuid: string; nome: string }[];
}

let mockUser: MockUser | null = null;

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: vi.fn(
        (selector: (state: { user: MockUser | null }) => unknown) => {
            const state = { user: mockUser };
            return selector ? selector(state) : state;
        },
    ),
}));

describe("Header - Nova Ocorrência", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUser = null;
    });

    it('deve renderizar a mensagem e o botão "Nova ocorrência"', () => {
        render(<Header />);

        expect(
            screen.getByText(
                /Para registrar uma nova intercorrência institucional, clique no botão "nova ocorrência"/i,
            ),
        ).toBeInTheDocument();

        const button = screen.getByRole("button", {
            name: /\+ nova ocorrência/i,
        });
        expect(button).toBeInTheDocument();
    });

    it("deve redirecionar para cadastrar-ocorrencia quando usuario tem unidades", async () => {
        mockUser = {
            unidades: [
                { uuid: "123", nome: "EMEF Teste" },
                { uuid: "456", nome: "EMEF Teste 2" },
            ],
        };

        render(<Header />);

        const button = screen.getByRole("button", {
            name: /\+ nova ocorrência/i,
        });

        fireEvent.click(button);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(
                "/dashboard/cadastrar-ocorrencia",
            );
        });
    });

    it("deve abrir o modal quando usuario não tem unidades", async () => {
        mockUser = {
            unidades: [],
        };

        render(<Header />);

        const button = screen.getByRole("button", {
            name: /\+ nova ocorrência/i,
        });

        fireEvent.click(button);

        await waitFor(() => {
            const modal = screen.getByTestId("modal-sem-unidade");
            expect(modal).toHaveAttribute("data-open", "true");
        });
    });

    it("não deve abrir o modal por padrão", () => {
        render(<Header />);

        const modal = screen.getByTestId("modal-sem-unidade");
        expect(modal).toHaveAttribute("data-open", "false");
    });

    it("não deve redirecionar quando hasUnidades=false", async () => {
        render(<Header />);

        const button = screen.getByRole("button", {
            name: /\+ nova ocorrência/i,
        });

        fireEvent.click(button);

        await waitFor(() => {
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    it("deve fechar o modal ao clicar no botão Fechar", async () => {
        render(<Header />);

        const button = screen.getByRole("button", {
            name: /\+ nova ocorrência/i,
        });

        fireEvent.click(button);

        await waitFor(() => {
            const modal = screen.getByTestId("modal-sem-unidade");
            expect(modal).toHaveAttribute("data-open", "true");
        });

        const fecharButton = screen.getByRole("button", {
            name: /fechar/i,
        });

        fireEvent.click(fecharButton);

        await waitFor(() => {
            const modal = screen.getByTestId("modal-sem-unidade");
            expect(modal).toHaveAttribute("data-open", "false");
        });
    });
});
