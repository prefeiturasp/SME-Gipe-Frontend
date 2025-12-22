import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import FormularioCadastroPessoaUsuaria from "./index";
import { useObterUsuarioGestao } from "@/hooks/useObterUsuarioGestao";

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

vi.mock("@/hooks/useAtualizarGestaoUsuario", () => ({
    useAtualizarGestaoUsuario: () => ({
        mutate: vi.fn(),
        isPending: false,
    }),
}));

vi.mock("@/hooks/useObterUsuarioGestao", () => ({
    useObterUsuarioGestao: vi.fn(() => ({
        data: null,
    })),
}));

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: () => ({
        user: null,
    }),
}));

vi.mock("@/hooks/useUserPermissions", () => ({
    useUserPermissions: () => ({
        isPontoFocal: false,
        isGipe: false,
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

        expect(mockPush).toHaveBeenCalledWith("/dashboard/gestao-usuarios");
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

describe("FormularioCadastroPessoaUsuaria - Modo Edit", () => {
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

        vi.mocked(useObterUsuarioGestao).mockReturnValue({
            data: {
                uuid: "2492498294284-928w98",
                username: "7284273",
                name: "Joao da Silva",
                email: "joao@sme.prefeitura.sp.gov.br",
                cpf: "12808888813",
                cargo: 0,
                rede: "DIRETA",
                unidades: [],
                is_validado: true,
                is_app_admin: true,
                is_core_sso: true,
                is_active: true,
                codigo_eol_unidade: null,
                codigo_eol_dre_da_unidade: null,
            },
            isLoading: false,
            error: null,
            refetch: vi.fn(),
        } as any);
    });

    beforeAll(() => {
        globalThis.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

    it("deve habilitar o botão se o usuário alterar um campo para um valor válido no modo edit", async () => {
        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-123"
            />,
            { wrapper }
        );

        await waitFor(() => {
            expect(screen.getByTestId("input-fullName")).toHaveValue(
                "Joao da Silva"
            );
        });

        expect(screen.getByTestId("input-cpf")).toHaveValue("12808888813");
        expect(screen.getByTestId("input-email")).toHaveValue(
            "joao@sme.prefeitura.sp.gov.br"
        );

        // Aguarda o campo ser preenchido com o valor inicial
        const inputNome = await screen.findByTestId("input-fullName");
        const button = screen.getByTestId("button-cadastrar");

        // Inicialmente desabilitado (sem alterações)
        expect(button).toBeDisabled();

        // Altera para um valor válido
        fireEvent.change(inputNome, {
            target: { value: "João da Silva Editado" },
        });

        // Agora deve estar habilitado
        await waitFor(() => {
            expect(button).not.toBeDisabled();
        });
    });

    it("renderiza o formulário no modo edit com dados carregados", async () => {
        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-123"
            />,
            { wrapper }
        );

        await waitFor(() => {
            expect(screen.getByTestId("input-fullName")).toHaveValue(
                "Joao da Silva"
            );
        });

        expect(screen.getByTestId("input-cpf")).toHaveValue("12808888813");
        expect(screen.getByTestId("input-email")).toHaveValue(
            "joao@sme.prefeitura.sp.gov.br"
        );
    });

    it("exibe botão com texto 'Salvar alterações' no modo edit", async () => {
        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-123"
            />,
            { wrapper }
        );

        await waitFor(() => {
            const button = screen.getByTestId("button-cadastrar");
            expect(button).toHaveTextContent("Salvar alterações");
        });
    });

    it("botão está desabilitado quando não há mudanças no modo edit", async () => {
        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-123"
            />,
            { wrapper }
        );

        await waitFor(() => {
            const button = screen.getByTestId("button-cadastrar");
            expect(button).toBeDisabled();
        });
    });

    it("desabilita botão no modo edit quando não há alterações, mesmo se válido", async () => {
        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-123"
            />,
            { wrapper }
        );
        await waitFor(() => {
            const button = screen.getByTestId("button-cadastrar");
            expect(button).toBeDisabled();
        });
    });

    it("carrega rede DIRETA no modo edit", async () => {
        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-123"
            />,
            { wrapper }
        );

        await waitFor(() => {
            const selectRede = screen.getByTestId("select-rede");
            expect(selectRede).toHaveTextContent("Direta");
        });
    });

    it("carrega rede INDIRETA no modo edit", async () => {
        vi.mocked(useObterUsuarioGestao).mockReturnValue({
            data: {
                uuid: "usuario-456",
                name: "Maria das Dores",
                username: "",
                cpf: "98765432100",
                email: "maria@email.com",
                rede: "INDIRETA",
                cargo: 2,
                codigo_eol_dre_da_unidade: "000002",
                codigo_eol_unidade: "100002",
                is_app_admin: false,
            },
            isLoading: false,
            error: null,
            refetch: vi.fn(),
        } as any);

        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-456"
            />,
            { wrapper }
        );

        await waitFor(() => {
            const selectRede = screen.getByTestId("select-rede");
            expect(selectRede).toHaveTextContent("Indireta");
        });
    });

    it("deve manter o botão desabilitado se o usuário alterar um campo para um valor inválido", async () => {
        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-123"
            />,
            { wrapper }
        );

        // Espera carregar os dados
        await waitFor(() => {
            expect(screen.getByTestId("input-fullName")).toHaveValue(
                "Joao da Silva"
            );
        });

        // Altera para um valor inválido (vazio)
        const inputNome = screen.getByTestId("input-fullName");
        fireEvent.change(inputNome, { target: { value: "" } });

        const button = screen.getByTestId("button-cadastrar");
        expect(button).toBeDisabled();
    });
});
