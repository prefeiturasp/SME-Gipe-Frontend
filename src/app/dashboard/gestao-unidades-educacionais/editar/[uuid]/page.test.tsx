import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditarUnidade from "./page";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

vi.mock("@/components/dashboard/QuadroBranco/QuadroBranco", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="quadro-branco">{children}</div>
    ),
}));

vi.mock("@/components/dashboard/GestaoUnidadesEducacionais/PageHeader", () => ({
    default: ({ title }: { title: string }) => (
        <div data-testid="page-header">{title}</div>
    ),
}));

vi.mock(
    "@/components/dashboard/GestaoUnidadesEducacionais/FormularioCadastroUnidadeEducacional",
    () => ({
        default: ({
            mode,
            unidadeUuid,
        }: {
            mode?: string;
            unidadeUuid?: string;
        }) => (
            <div data-testid="formulario-cadastro">
                <span data-testid="mode">{mode}</span>
                <span data-testid="unidade-uuid">{unidadeUuid}</span>
            </div>
        ),
    })
);

describe("EditarUnidade", () => {
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

    it("deve renderizar o título 'Editar Unidade Educacional'", () => {
        const params = { uuid: "test-uuid-123" };
        render(<EditarUnidade params={params} />, {
            wrapper: createWrapper(),
        });

        expect(
            screen.getByText("Editar Unidade Educacional")
        ).toBeInTheDocument();
    });

    it("deve renderizar o QuadroBranco", () => {
        const params = { uuid: "test-uuid-123" };
        render(<EditarUnidade params={params} />, {
            wrapper: createWrapper(),
        });

        expect(screen.getByTestId("quadro-branco")).toBeInTheDocument();
    });

    it("deve renderizar o FormularioCadastroUnidadeEducacional com mode='edit'", () => {
        const params = { uuid: "test-uuid-123" };
        render(<EditarUnidade params={params} />, {
            wrapper: createWrapper(),
        });

        expect(screen.getByTestId("formulario-cadastro")).toBeInTheDocument();
        expect(screen.getByTestId("mode")).toHaveTextContent("edit");
    });

    it("deve passar o uuid correto para o FormularioCadastroUnidadeEducacional", () => {
        const params = { uuid: "test-uuid-456" };
        render(<EditarUnidade params={params} />, {
            wrapper: createWrapper(),
        });

        expect(screen.getByTestId("unidade-uuid")).toHaveTextContent(
            "test-uuid-456"
        );
    });
});
