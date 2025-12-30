import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditarPessoaUsuaria from "./page";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

vi.mock("@/hooks/useInativarGestaoUsuario", () => ({
    useInativarGestaoUsuario: () => ({
        mutateAsync: vi.fn(),
        isPending: false,
    }),
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: vi.fn(),
}));

vi.mock("@/components/dashboard/QuadroBranco/QuadroBranco", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="quadro-branco">{children}</div>
    ),
}));

vi.mock("@/components/dashboard/GestaoUsuarios/PageHeader/PageHeader", () => ({
    default: ({ title }: { title: string }) => (
        <div data-testid="page-header">{title}</div>
    ),
}));

vi.mock("@/components/dashboard/GestaoUsuarios/FormularioCadastro", () => ({
    default: ({
        mode,
        usuarioUuid,
    }: {
        mode?: string;
        usuarioUuid?: string;
    }) => (
        <div data-testid="formulario-cadastro">
            <span data-testid="mode">{mode}</span>
            <span data-testid="usuario-uuid">{usuarioUuid}</span>
        </div>
    ),
}));

describe("EditarPessoaUsuaria", () => {
    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });
        const Wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
        Wrapper.displayName = "QueryClientWrapper";
        return Wrapper;
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve renderizar o título 'Editar perfil'", () => {
        const params = { uuid: "test-uuid-123" };
        render(<EditarPessoaUsuaria params={params} />, {
            wrapper: createWrapper(),
        });

        expect(screen.getByText("Editar perfil")).toBeInTheDocument();
    });

    it("deve renderizar o QuadroBranco", () => {
        const params = { uuid: "test-uuid-123" };
        render(<EditarPessoaUsuaria params={params} />, {
            wrapper: createWrapper(),
        });

        expect(screen.getByTestId("quadro-branco")).toBeInTheDocument();
    });

    it("deve renderizar o FormularioCadastroPessoaUsuaria com mode='edit'", () => {
        const params = { uuid: "test-uuid-123" };
        render(<EditarPessoaUsuaria params={params} />, {
            wrapper: createWrapper(),
        });

        expect(screen.getByTestId("formulario-cadastro")).toBeInTheDocument();
        expect(screen.getByTestId("mode")).toHaveTextContent("edit");
    });

    it("deve passar o uuid correto para o FormularioCadastroPessoaUsuaria", () => {
        const params = { uuid: "test-uuid-456" };
        render(<EditarPessoaUsuaria params={params} />, {
            wrapper: createWrapper(),
        });

        expect(screen.getByTestId("usuario-uuid")).toHaveTextContent(
            "test-uuid-456"
        );
    });
});
