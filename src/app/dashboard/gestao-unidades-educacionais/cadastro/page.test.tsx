import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Page from "./page";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn(),
    }),
}));

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query");
    return {
        ...actual,
        useQueryClient: () => ({
            invalidateQueries: vi.fn(),
        }),
    };
});

vi.mock("@/hooks/useObterUnidadeGestao", () => ({
    useObterUnidadeGestao: () => ({
        data: null,
        isLoading: false,
    }),
}));

vi.mock("@/hooks/useInativarUnidadeGestao", () => ({
    useInativarUnidadeGestao: () => ({
        mutateAsync: vi.fn(),
        isPending: false,
    }),
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: vi.fn(),
}));

vi.mock("@/components/dashboard/PageHeader/PageHeader", () => ({
    __esModule: true,
    default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/components/dashboard/QuadroBranco/QuadroBranco", () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

vi.mock(
    "@/components/dashboard/GestaoUnidades/FormularioCadastroUnidadeEducacional",
    () => ({
        __esModule: true,
        default: () => (
            <div data-testid="formulario-cadastro">Formulário Cadastro</div>
        ),
    })
);

describe("Página de cadastro de unidade educacional", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
    });

    it("renderiza o PageHeader com título correto", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Page />
            </QueryClientProvider>
        );

        expect(
            screen.getByText("Cadastrar Unidade Educacional")
        ).toBeInTheDocument();
    });

    it("renderiza o formulário de cadastro", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Page />
            </QueryClientProvider>
        );

        expect(screen.getByTestId("formulario-cadastro")).toBeInTheDocument();
    });
});
