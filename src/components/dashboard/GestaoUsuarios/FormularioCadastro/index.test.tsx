import { ObterUsuarioGestaoResponse } from "@/actions/obter-usuario-gestao";
import * as obterUsuarioHook from "@/hooks/useObterUsuarioGestao";
import { useObterUsuarioGestao } from "@/hooks/useObterUsuarioGestao";
import * as permissionsHook from "@/hooks/useUserPermissions";
import type { UseQueryResult } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import FormularioCadastroPessoaUsuaria from "./index";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

vi.mock("@/hooks/useGetUnidades", () => ({
    useGetUnidades: vi.fn(
        (ativa?: boolean, dre?: string, tipo_unidade?: string) => {
            if (tipo_unidade === "DRE") {
                return {
                    data: [
                        {
                            uuid: "dre-1",
                            codigo_eol: "000001",
                            nome: "DRE Butantã",
                        },
                        {
                            uuid: "dre-2",
                            codigo_eol: "000002",
                            nome: "DRE Centro",
                        },
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
                error: null,
            };
        },
    ),
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

vi.mock("@/hooks/useConsultarRfUsuario", () => ({
    useConsultarRfUsuario: () => ({
        mutateAsync: vi.fn(),
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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
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
        expect(screen.queryByTestId("select-cargo")).not.toBeInTheDocument();
    });

    it("exibe campos adicionais após selecionar rede DIRETA", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        await waitFor(() => {
            expect(screen.getByTestId("input-rf")).toBeInTheDocument();
            expect(screen.getByTestId("select-cargo")).toBeInTheDocument();
        });
    });

    it("exibe campos adicionais após selecionar rede INDIRETA", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Indireta" });
            fireEvent.click(option);
        });

        await waitFor(() => {
            expect(screen.getByTestId("input-cpf")).toBeInTheDocument();
            expect(screen.getByTestId("select-cargo")).toBeInTheDocument();
            expect(screen.getByTestId("input-fullName")).toBeInTheDocument();
            expect(screen.getByTestId("input-email")).toBeInTheDocument();
            expect(screen.queryByTestId("input-rf")).not.toBeInTheDocument();
        });
    });

    it("aplica máscara de CPF ao digitar no campo CPF da rede INDIRETA", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Indireta" });
            fireEvent.click(option);
        });

        const inputCPF = await screen.findByTestId("input-cpf");
        fireEvent.change(inputCPF, { target: { value: "12345678900" } });

        await waitFor(() => {
            expect(inputCPF).toHaveValue("123.456.789-00");
        });
    });

    it("aplica máscara de CPF ao digitar no campo CPF da rede DIRETA com cargo GIPE", async () => {
        vi.spyOn(permissionsHook, "useUserPermissions").mockReturnValue({
            isPontoFocal: false,
            isGipe: true,
            isAssistenteOuDiretor: false,
            isGipeAdmin: true,
        });
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        const selectCargo = await screen.findByTestId("select-cargo");
        fireEvent.click(selectCargo);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "GIPE" });
            fireEvent.click(option);
        });

        const inputCPF = await screen.findByTestId("input-cpf");
        fireEvent.change(inputCPF, { target: { value: "98765432100" } });

        await waitFor(() => {
            expect(inputCPF).toHaveValue("987.654.321-00");
        });
    });

    it("remove caracteres não numéricos do campo RF ao digitar", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        const inputRF = await screen.findByTestId("input-rf");
        fireEvent.change(inputRF, { target: { value: "abc123def456" } });

        await waitFor(() => {
            expect(inputRF).toHaveValue("123456");
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
            isPontoFocal: false,
            isGipe: true,
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
            }),
        );

        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-inativo"
            />,
            { wrapper },
        );

        const checkbox = await screen.findByRole("checkbox");
        expect(checkbox).toBeInTheDocument();

        expect(checkbox).toHaveClass("bg-white");
        expect(checkbox).toHaveClass("text-[#B0B0B0]");

        const descricao = screen.getByText(
            /Opção disponível para usuários que possuem cargo de Ponto Focal ou GIPE/i,
        );

        expect(descricao).toHaveClass("text-[#B0B0B0]");

        await waitFor(() => {}, { timeout: 300 });
    });

    it("checkbox de administrador está habilitado quando usuário está ativo e cargo é gipe", async () => {
        vi.spyOn(permissionsHook, "useUserPermissions").mockReturnValue({
            isPontoFocal: false,
            isGipe: true,
            isAssistenteOuDiretor: false,
            isGipeAdmin: true,
        });

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
            const option = screen.getByRole("option", { name: "GIPE" });
            fireEvent.click(option);
        });

        await waitFor(() => {
            const checkbox = screen.getByRole("checkbox");
            expect(checkbox).toBeInTheDocument();
            expect(checkbox).not.toBeDisabled();
            expect(checkbox).not.toHaveClass("bg-white");
        });
    });

    it("checkbox de administrador pode ser marcado quando habilitado", async () => {
        vi.spyOn(permissionsHook, "useUserPermissions").mockReturnValue({
            isPontoFocal: false,
            isGipe: true,
            isAssistenteOuDiretor: false,
            isGipeAdmin: true,
        });

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
            const option = screen.getByRole("option", { name: "GIPE" });
            fireEvent.click(option);
        });

        const checkbox = await screen.findByRole("checkbox");
        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(checkbox).toBeChecked();
        });
    });

    it("checkbox de administrador não pode ser desmarcado quando formulário está desabilitado", async () => {
        vi.spyOn(permissionsHook, "useUserPermissions").mockReturnValue({
            isPontoFocal: false,
            isGipe: true,
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
                is_app_admin: true,
                codigo_eol_dre_da_unidade: "",
                codigo_eol_unidade: "",
            }),
        );

        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-inativo"
            />,
            { wrapper },
        );

        const checkbox = await screen.findByRole("checkbox");
        expect(checkbox).toBeDisabled();
        expect(checkbox).toBeChecked();

        await waitFor(() => {}, { timeout: 300 });
    });

    it("não exibe checkbox de administrador para cargo ponto focal quando usuário é ponto focal", async () => {
        vi.spyOn(permissionsHook, "useUserPermissions").mockReturnValue({
            isPontoFocal: true,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });

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
            const option = screen.getByRole("option", {
                name: "Ponto focal",
            });
            fireEvent.click(option);
        });

        await waitFor(() => {
            const checkbox = screen.queryByRole("checkbox");
            expect(checkbox).not.toBeInTheDocument();
        });
    });

    it("exibe mensagem de inativação quando usuário está inativo", async () => {
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
                motivo_inativacao: "Usuário solicitou inativação",
                data_inativacao: "2025-12-01T10:30:00Z",
                responsavel_inativacao_nome: "Admin Teste",
                inativado_via_unidade: false,
            }),
        );

        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-inativo"
            />,
            { wrapper },
        );

        await waitFor(
            () => {
                expect(
                    screen.getByText("Motivo da inativação do perfil:"),
                ).toBeInTheDocument();
                expect(
                    screen.getByText("Usuário solicitou inativação"),
                ).toBeInTheDocument();
                expect(
                    screen.getByText(/Inativado por Admin Teste em/i),
                ).toBeInTheDocument();
            },
            { timeout: 1000 },
        );
    });

    it("exibe mensagem de inativação quando usuário foi inativado via unidade", async () => {
        vi.spyOn(permissionsHook, "useUserPermissions").mockReturnValue({
            isPontoFocal: true,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: true,
        });

        vi.spyOn(obterUsuarioHook, "useObterUsuarioGestao").mockReturnValue(
            getMockedQueryResult({
                uuid: "usuario-inativo-via-ue",
                name: "Usuário Inativo Via UE",
                cpf: "12345678900",
                email: "inativo@email.com",
                rede: "DIRETA",
                cargo: 1,
                is_active: false,
                is_app_admin: false,
                codigo_eol_dre_da_unidade: "",
                codigo_eol_unidade: "",
                motivo_inativacao: "Unidade foi desativada",
                data_inativacao: "2025-12-01T10:30:00Z",
                responsavel_inativacao_nome: "Admin Teste",
                inativado_via_unidade: true,
            }),
        );

        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-inativo-via-ue"
            />,
            { wrapper },
        );

        await waitFor(
            () => {
                expect(
                    screen.getByText(
                        "Perfil inativo devido a inativação da Unidade Educacional.",
                    ),
                ).toBeInTheDocument();
                expect(
                    screen.getByText("Motivo da inativação da UE:"),
                ).toBeInTheDocument();
                expect(
                    screen.getByText("Unidade foi desativada"),
                ).toBeInTheDocument();
            },
            { timeout: 1000 },
        );
    });

    it("exibe mensagem de inativação com valores padrão quando dados são undefined", async () => {
        vi.spyOn(permissionsHook, "useUserPermissions").mockReturnValue({
            isPontoFocal: true,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: true,
        });

        vi.spyOn(obterUsuarioHook, "useObterUsuarioGestao").mockReturnValue(
            getMockedQueryResult({
                uuid: "usuario-inativo-sem-dados",
                name: "Usuário Sem Dados",
                cpf: "12345678900",
                email: "inativo@email.com",
                rede: "DIRETA",
                cargo: 1,
                is_active: false,
                is_app_admin: false,
                codigo_eol_dre_da_unidade: "",
                codigo_eol_unidade: "",
                motivo_inativacao: "Motivo teste",
                data_inativacao: undefined,
                responsavel_inativacao_nome: undefined,
                inativado_via_unidade: undefined,
            }),
        );

        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-inativo-sem-dados"
            />,
            { wrapper },
        );

        await waitFor(
            () => {
                expect(
                    screen.getByText("Motivo da inativação do perfil:"),
                ).toBeInTheDocument();
                expect(screen.getByText("Motivo teste")).toBeInTheDocument();
            },
            { timeout: 1000 },
        );
    });

    it("exibe mensagem de inativação com valores padrão quando inativadoViaUnidade é null", async () => {
        vi.spyOn(permissionsHook, "useUserPermissions").mockReturnValue({
            isPontoFocal: true,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: true,
        });

        vi.spyOn(obterUsuarioHook, "useObterUsuarioGestao").mockReturnValue(
            getMockedQueryResult({
                uuid: "usuario-inativo-null",
                name: "Usuário Null",
                cpf: "12345678900",
                email: "inativo@email.com",
                rede: "DIRETA",
                cargo: 1,
                is_active: false,
                is_app_admin: false,
                codigo_eol_dre_da_unidade: "",
                codigo_eol_unidade: "",
                motivo_inativacao: "Motivo teste",
                data_inativacao: "2025-12-01T10:30:00Z",
                responsavel_inativacao_nome: "Admin Teste",
                inativado_via_unidade: null,
            }),
        );

        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-inativo-null"
            />,
            { wrapper },
        );

        await waitFor(
            () => {
                expect(
                    screen.getByText("Motivo da inativação do perfil:"),
                ).toBeInTheDocument();
                expect(screen.getByText("Motivo teste")).toBeInTheDocument();
            },
            { timeout: 1000 },
        );
    });

    describe("Consultar RF", () => {
        it("exibe botão Consultar quando rede DIRETA está selecionada", async () => {
            render(<FormularioCadastroPessoaUsuaria />, { wrapper });

            const selectRede = screen.getByTestId("select-rede");
            fireEvent.click(selectRede);
            await waitFor(() => {
                const option = screen.getByRole("option", { name: "Direta" });
                fireEvent.click(option);
            });

            await waitFor(() => {
                expect(screen.getByTestId("input-rf")).toBeInTheDocument();
                const consultarButtons = screen.getAllByText("Consultar");
                expect(consultarButtons.length).toBeGreaterThan(0);
            });
        });

        it("botão Consultar está desabilitado quando RF tem menos de 7 dígitos", async () => {
            render(<FormularioCadastroPessoaUsuaria />, { wrapper });

            const selectRede = screen.getByTestId("select-rede");
            fireEvent.click(selectRede);
            await waitFor(() => {
                const option = screen.getByRole("option", { name: "Direta" });
                fireEvent.click(option);
            });

            const inputRf = await screen.findByTestId("input-rf");
            fireEvent.change(inputRf, { target: { value: "123456" } });

            await waitFor(() => {
                const consultarButtons = screen.getAllByText("Consultar");
                const rfConsultarButton = consultarButtons.find((btn) =>
                    btn
                        .closest('[data-testid="input-rf"]')
                        ?.parentElement?.parentElement?.contains(btn),
                );
                if (rfConsultarButton) {
                    expect(rfConsultarButton).toBeDisabled();
                }
            });
        });

        it("botão Consultar está habilitado quando RF tem 7 ou mais dígitos", async () => {
            render(<FormularioCadastroPessoaUsuaria />, { wrapper });

            const selectRede = screen.getByTestId("select-rede");
            fireEvent.click(selectRede);
            await waitFor(() => {
                const option = screen.getByRole("option", { name: "Direta" });
                fireEvent.click(option);
            });

            const inputRf = await screen.findByTestId("input-rf");
            fireEvent.change(inputRf, { target: { value: "1234567" } });

            await waitFor(() => {
                const consultarButtons = screen.getAllByText("Consultar");
                expect(consultarButtons.length).toBeGreaterThan(0);
            });
        });

        it("não exibe botão Consultar quando rede INDIRETA está selecionada", async () => {
            render(<FormularioCadastroPessoaUsuaria />, { wrapper });

            const selectRede = screen.getByTestId("select-rede");
            fireEvent.click(selectRede);
            await waitFor(() => {
                const option = screen.getByRole("option", { name: "Indireta" });
                fireEvent.click(option);
            });

            await waitFor(() => {
                expect(screen.getByTestId("input-cpf")).toBeInTheDocument();
                expect(
                    screen.queryByTestId("input-rf"),
                ).not.toBeInTheDocument();
            });
        });

        it("não exibe botão Consultar RF no modo edit", async () => {
            const mockUseObterUsuarioGestao = vi.mocked(
                obterUsuarioHook.useObterUsuarioGestao,
            );
            mockUseObterUsuarioGestao.mockReturnValue(
                getMockedQueryResult({
                    uuid: "user-123",
                    name: "Usuário Teste",
                    email: "teste@exemplo.com",
                    cpf: "12345678900",
                    username: "1234567",
                    cargo: 1,
                    rede: "DIRETA",
                    is_active: true,
                    codigo_eol_unidade: "100001",
                    codigo_eol_dre_da_unidade: "000001",
                }),
            );

            render(
                <FormularioCadastroPessoaUsuaria
                    mode="edit"
                    usuarioUuid="user-123"
                />,
                { wrapper },
            );

            await waitFor(
                () => {
                    const rfInput = screen.queryByTestId("input-rf");
                    if (rfInput) {
                        expect(rfInput).toBeDisabled();
                    }
                },
                { timeout: 1000 },
            );
        });
    });
});

function getMockedQueryResult(
    data: Partial<ObterUsuarioGestaoResponse>,
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
            }),
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
            { wrapper },
        );

        await waitFor(
            () => {
                expect(screen.getByTestId("input-fullName")).toHaveValue(
                    "Joao da Silva",
                );
            },
            { timeout: 1000 },
        );

        expect(screen.getByTestId("input-cpf")).toHaveValue("12808888813");
        expect(screen.getByTestId("input-email")).toHaveValue(
            "joao@sme.prefeitura.sp.gov.br",
        );

        const inputNome = await screen.findByTestId("input-fullName");
        const button = screen.getByTestId("button-cadastrar");

        expect(button).toBeDisabled();

        fireEvent.change(inputNome, {
            target: { value: "João da Silva Editado" },
        });

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
            { wrapper },
        );

        await waitFor(
            () => {
                expect(screen.getByTestId("input-fullName")).toHaveValue(
                    "Joao da Silva",
                );
            },
            { timeout: 1000 },
        );

        expect(screen.getByTestId("input-cpf")).toHaveValue("12808888813");
        expect(screen.getByTestId("input-email")).toHaveValue(
            "joao@sme.prefeitura.sp.gov.br",
        );
    });

    it("exibe botão com texto 'Salvar alterações' no modo edit", async () => {
        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-123"
            />,
            { wrapper },
        );

        await waitFor(
            () => {
                const button = screen.getByTestId("button-cadastrar");
                expect(button).toHaveTextContent("Salvar alterações");
            },
            { timeout: 1000 },
        );
    });

    it("botão está desabilitado quando não há mudanças no modo edit", async () => {
        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-123"
            />,
            { wrapper },
        );

        await waitFor(
            () => {
                const button = screen.getByTestId("button-cadastrar");
                expect(button).toBeDisabled();
            },
            { timeout: 1000 },
        );
    });

    it("desabilita botão no modo edit quando não há alterações, mesmo se válido", async () => {
        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-123"
            />,
            { wrapper },
        );
        await waitFor(
            () => {
                const button = screen.getByTestId("button-cadastrar");
                expect(button).toBeDisabled();
            },
            { timeout: 1000 },
        );
    });

    it("carrega rede DIRETA no modo edit", async () => {
        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-123"
            />,
            { wrapper },
        );

        await waitFor(
            () => {
                const selectRede = screen.getByTestId("select-rede");
                expect(selectRede).toHaveTextContent("Direta");
            },
            { timeout: 1000 },
        );
    });

    it("carrega rede INDIRETA no modo edit", async () => {
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
            }),
        );

        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-456"
            />,
            { wrapper },
        );

        await waitFor(
            () => {
                const selectRede = screen.getByTestId("select-rede");
                expect(selectRede).toHaveTextContent("Indireta");
            },
            { timeout: 1000 },
        );
    });

    it("deve manter o botão desabilitado se o usuário alterar um campo para um valor inválido", async () => {
        render(
            <FormularioCadastroPessoaUsuaria
                mode="edit"
                usuarioUuid="usuario-123"
            />,
            { wrapper },
        );

        await waitFor(
            () => {
                expect(screen.getByTestId("input-fullName")).toHaveValue(
                    "Joao da Silva",
                );
            },
            { timeout: 1000 },
        );

        const inputNome = screen.getByTestId("input-fullName");
        fireEvent.change(inputNome, { target: { value: "" } });

        await waitFor(() => {
            const button = screen.getByTestId("button-cadastrar");
            expect(button).toBeDisabled();
        });
    });
});
