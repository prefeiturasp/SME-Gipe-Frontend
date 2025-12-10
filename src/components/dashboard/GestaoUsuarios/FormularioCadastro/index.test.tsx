import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import FormularioCadastroPessoaUsuaria from "./index";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

vi.mock("@/hooks/useUnidades", () => ({
    useFetchDREs: () => ({
        data: [
            { uuid: "dre-1", codigo_eol: "000001", nome: "DRE Butantã" },
            { uuid: "dre-2", codigo_eol: "000002", nome: "DRE Centro" },
        ],
    }),
    useFetchUEs: vi.fn((dreUuid: string) => {
        if (dreUuid === "dre-1") {
            return {
                data: [
                    {
                        uuid: "ue-1",
                        codigo_eol: "100001",
                        nome: "EMEF João da Silva",
                    },
                    {
                        uuid: "ue-2",
                        codigo_eol: "100002",
                        nome: "EMEF Maria das Dores",
                    },
                ],
            };
        }
        return { data: [] };
    }),
}));

vi.mock("@/hooks/useCadastroGestaoUsuario", () => ({
    useCadastroGestaoUsuario: () => ({
        mutate: vi.fn(),
        isPending: false,
    }),
}));

describe("FormularioCadastroPessoaUsuaria - Testes de Integração", () => {
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

    beforeAll(() => {
        globalThis.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

    it("renderiza o formulário com campos iniciais", () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        expect(screen.getByTestId("select-rede")).toBeInTheDocument();
        expect(screen.getByTestId("select-cargo")).toBeInTheDocument();
    });

    it("exibe campos adicionais após selecionar rede DIRETA e cargo", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        const selectCargo = screen.getByTestId("select-cargo");
        fireEvent.click(selectCargo);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Diretor(a)" });
            fireEvent.click(option);
        });

        await waitFor(() => {
            expect(screen.getByTestId("input-fullName")).toBeInTheDocument();
            expect(screen.getByTestId("input-cpf")).toBeInTheDocument();
            expect(screen.getByTestId("input-rf")).toBeInTheDocument();
            expect(screen.getByTestId("input-email")).toBeInTheDocument();
        });
    });

    it("exibe campos adicionais após selecionar rede INDIRETA e cargo", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Indireta" });
            fireEvent.click(option);
        });

        const selectCargo = screen.getByTestId("select-cargo");
        fireEvent.click(selectCargo);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Diretor(a)" });
            fireEvent.click(option);
        });

        await waitFor(() => {
            expect(screen.getByTestId("input-fullName")).toBeInTheDocument();
            expect(screen.getByTestId("input-cpf")).toBeInTheDocument();
            expect(screen.queryByTestId("input-rf")).not.toBeInTheDocument();
            expect(screen.getByTestId("input-email")).toBeInTheDocument();
        });
    });

    it("botão cancelar redireciona para a página de gestão de pessoas", () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const cancelarButton = screen.getByRole("button", {
            name: "Cancelar",
        });
        fireEvent.click(cancelarButton);

        expect(mockPush).toHaveBeenCalledWith(
            "/dashboard/gestao/pessoa-usuaria"
        );
    });

    it("botão cadastrar está desabilitado quando formulário é inválido", () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const cadastrarButton = screen.getByTestId("button-cadastrar");
        expect(cadastrarButton).toBeDisabled();
    });

    it("exibe checkbox de admin apenas para Ponto Focal ou GIPE", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        expect(
            screen.queryByTestId("checkbox-isAdmin")
        ).not.toBeInTheDocument();

        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        const selectCargo = screen.getByTestId("select-cargo");
        fireEvent.click(selectCargo);
        await waitFor(() => {
            const option = screen.getByRole("option", {
                name: "Ponto focal",
            });
            fireEvent.click(option);
        });

        await waitFor(() => {
            expect(screen.getByTestId("checkbox-isAdmin")).toBeInTheDocument();
        });
    });
});
