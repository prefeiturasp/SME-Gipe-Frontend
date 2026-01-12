import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import FormularioCadastroPessoaUsuaria from "./index";
import { useObterUsuarioGestao } from "@/hooks/useObterUsuarioGestao";
import type { UseQueryResult } from "@tanstack/react-query";
import { ObterUsuarioGestaoResponse } from "@/actions/obter-usuario-gestao";
import * as permissionsHook from "@/hooks/useUserPermissions";
import * as obterUsuarioHook from "@/hooks/useObterUsuarioGestao";


const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

vi.mock("@/hooks/useGetUnidades", () => ({
    useGetUnidades: vi.fn((ativa?: boolean, dre?: string, tipo_unidade?: string) => {
        if (tipo_unidade === "DRE") {
            return {
                data: [
                    { uuid: "dre-1", codigo_eol: "000001", nome: "DRE Butantã" },
                    { uuid: "dre-2", codigo_eol: "000002", nome: "DRE Centro" },
                ],
                isLoading: false,
                error: null,
            };
        }
        if (dre === "dre-1") {
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
                isLoading: false,
                error: null,
            };
        }
        return {
            data: [],
            isLoading: false,
            error: null
        };
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

let queryClient: QueryClient;
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

describe("FormularioCadastroPessoaUsuaria - Testes de Integração", () => {


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

    it("aplica estilos desabilitados no checkbox de administrador quando usuário está inativo", async () => {
    vi.spyOn(permissionsHook, "useUserPermissions").mockReturnValue({
        isPontoFocal: true,
        isGipe: false,
        isAssistenteOuDiretor: false,
        isGipeAdmin: true,
    });

    vi.spyOn(obterUsuarioHook, "useObterUsuarioGestao").mockReturnValue(
        getMockedQueryResult({
            uuid: "usuario-inativo",
            name: "Usuário Inativo",
            cpf: "12345678900",
            email: "inativo@email.com",
            rede: "DIRETA",
            cargo: 1,
            is_active: false,
            is_app_admin: false,
            codigo_eol_dre_da_unidade: "",
            codigo_eol_unidade: "",
        })
    );

    render(
        <FormularioCadastroPessoaUsuaria
            mode="edit"
            usuarioUuid="usuario-inativo"
        />,
        { wrapper }
    );

    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox).toBeInTheDocument();

    expect(checkbox).toHaveClass("bg-white");
    expect(checkbox).toHaveClass("text-[#B0B0B0]");

    const descricao = screen.getByText(
        /Opção disponível para usuários que possuem cargo de Ponto Focal ou GIPE/i
    );

    expect(descricao).toHaveClass("text-[#B0B0B0]");
});

});

function getMockedQueryResult(
    data: Partial<ObterUsuarioGestaoResponse>
): UseQueryResult<ObterUsuarioGestaoResponse, Error> {
    return {
        data: data as ObterUsuarioGestaoResponse,
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
        status: "success",
        failureCount: 0,
        isFetched: true,
        isRefetching: false,
        isStale: false,
        isPaused: false,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        fetchStatus: "idle",
        isPlaceholderData: false,
        isPending: false,
        isLoadingError: false,
        isRefetchError: false,
        failureReason: null,
        errorUpdateCount: 0,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        promise: Promise.resolve(data as ObterUsuarioGestaoResponse),
    };
}

describe("FormularioCadastroPessoaUsuaria - Modo Edit", () => {

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        vi.mocked(useObterUsuarioGestao).mockReturnValue(
            getMockedQueryResult({
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
                codigo_eol_unidade: "",
                codigo_eol_dre_da_unidade: "",
            })
        );
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

    it("carrega rede INDIRETA no modo edit", () => {
        vi.mocked(useObterUsuarioGestao).mockReturnValue(
            getMockedQueryResult({
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
            })
        );

        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-456"
            />,
            { wrapper }
        );

        waitFor(() => {
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
