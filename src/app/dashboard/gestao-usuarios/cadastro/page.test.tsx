import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import Page from "./page";

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
    "@/components/dashboard/Gestao/PessoaUsuaria/FormularioCadastro",
    () => ({
        __esModule: true,
        default: () => (
            <div data-testid="formulario-cadastro">Formulário Cadastro</div>
        ),
    })
);

describe("Página de cadastro de pessoa usuária", () => {
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
            screen.getByText("Cadastrar pessoa usuária")
        ).toBeInTheDocument();
    });

    it("renderiza a descrição corretamente", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Page />
            </QueryClientProvider>
        );

        expect(
            screen.getByText(/Preencha os dados abaixo para cadastrar/i)
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
