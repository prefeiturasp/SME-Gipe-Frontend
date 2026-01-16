const mockTipoOptions = [
    { id: "ADM", label: "ADM" },
    { id: "DRE", label: "DRE" },
    { id: "EMEF", label: "EMEF" },
    { id: "EMEI", label: "EMEI" },
    { id: "CEU", label: "CEU" },
    { id: "CEI", label: "CEI" },
];
vi.mock("@/hooks/useTiposUnidade", () => ({
    useTiposUnidade: () => ({
        data: mockTipoOptions,
        isLoading: false,
    }),
}));

const mockCadastrarUnidade = vi.fn();
vi.mock("@/hooks/useCadastrarUnidade", () => ({
    useCadastrarUnidade: () => ({
        mutateAsync: mockCadastrarUnidade,
        isPending: false,
    }),
}));

const mockAtualizarUnidade = vi.fn();
vi.mock("@/hooks/useAtualizarUnidade", () => ({
    useAtualizarUnidade: () => ({
        mutateAsync: mockAtualizarUnidade,
        isPending: false,
    }),
}));

const mockObterUnidade = vi.fn();
vi.mock("@/hooks/useObterUnidadeGestao", () => ({
    useObterUnidadeGestao: (props: { uuid: string; enabled: boolean }) => {
        const result = mockObterUnidade(props);
        return result || { data: undefined, isLoading: false };
    },
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: vi.fn(),
}));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FormularioCadastroUnidadeEducacional from "./index";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

const mockDreOptions = [
    { uuid: "dre-1", codigo_eol: "000001", nome: "DRE - Butantã" },
    { uuid: "dre-2", codigo_eol: "000002", nome: "DRE - Centro" },
    { uuid: "dre-3", codigo_eol: "000003", nome: "DRE - Capela do Socorro" },
];

vi.mock("@/hooks/useGetUnidades", () => ({
    useGetUnidades: () => ({
        data: mockDreOptions,
    }),
}));

const mockUser = {
    username: "12345678900",
    name: "Usuário Teste",
    email: "teste@example.com",
    cpf: "12345678900",
    rede: "DIRETA",
    is_core_sso: false,
    is_validado: true,
    is_app_admin: false,
    perfil_acesso: {
        codigo: 1,
        nome: "Ponto Focal",
    },
    unidades: [
        {
            ue: {
                ue_uuid: null,
                codigo_eol: null,
                nome: null,
                sigla: null,
            },
            dre: {
                dre_uuid: "dre-1",
                codigo_eol: "000001",
                nome: "DRE - Butantã",
                sigla: "BT",
            },
        },
    ],
};

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: vi.fn((selector) => {
        const state = { user: null };
        return selector ? selector(state) : state;
    }),
}));

vi.mock("@/hooks/useUserPermissions", () => ({
    useUserPermissions: vi.fn(() => ({
        isPontoFocal: false,
        isGipe: false,
        isAssistenteOuDiretor: false,
        isGipeAdmin: false,
    })),
}));

describe("FormularioCadastroUnidadeEducacional", () => {
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

    const getSelectByLabel = (labelText: string) => {
        const label = screen.getByText(labelText);
        const container = label.closest(".space-y-2");
        return container?.querySelector(
            'button[role="combobox"]'
        ) as HTMLElement;
    };

    it("deve renderizar o formulário com todos os campos iniciais", () => {
        render(<FormularioCadastroUnidadeEducacional />, { wrapper });

        expect(
            screen.getByText("Cadastre as informações da Unidade Educacional.")
        ).toBeInTheDocument();
        expect(screen.getByText("Etapa/modalidade*")).toBeInTheDocument();
        expect(
            screen.getByText("Nome da Unidade Educacional*")
        ).toBeInTheDocument();
        expect(screen.getByText("Tipo*")).toBeInTheDocument();
        expect(screen.getByText("Código EOL*")).toBeInTheDocument();
    });

    it("deve renderizar o campo de DRE por padrão", () => {
        render(<FormularioCadastroUnidadeEducacional />, { wrapper });

        expect(screen.getByText("Diretoria Regional*")).toBeInTheDocument();
    });

    it("deve renderizar os botões Cancelar e Cadastrar UE", () => {
        render(<FormularioCadastroUnidadeEducacional />, { wrapper });

        expect(
            screen.getByRole("button", { name: /Cancelar/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Cadastrar UE/i })
        ).toBeInTheDocument();
    });

    it("deve desabilitar o botão de cadastrar inicialmente", () => {
        render(<FormularioCadastroUnidadeEducacional />, { wrapper });

        const cadastrarButton = screen.getByRole("button", {
            name: /Cadastrar UE/i,
        });
        expect(cadastrarButton).toBeDisabled();
    });

    const openetapaModalidadeSelect = () => {
        const etapaModalidadeSelect = getSelectByLabel("Etapa/modalidade*");
        fireEvent.click(etapaModalidadeSelect);
        return etapaModalidadeSelect;
    };

    const selectTipoOption = async (optionLabel: string) => {
        await waitFor(() => {
            const options = screen.getAllByText(optionLabel);
            fireEvent.click(options.at(-1)!);
        });
    };

    it("deve exibir todas as opções de tipo vindas do backend ao clicar no select", async () => {
        render(<FormularioCadastroUnidadeEducacional />, { wrapper });

        openetapaModalidadeSelect();

        await waitFor(() => {
            mockTipoOptions.forEach((opt) => {
                expect(screen.getAllByText(opt.label).length).toBeGreaterThan(
                    0
                );
            });
        });
    });

    it("deve permitir selecionar um tipo", async () => {
        render(<FormularioCadastroUnidadeEducacional />, { wrapper });

        const etapaModalidadeSelect = openetapaModalidadeSelect();
        await selectTipoOption("EMEF");

        await waitFor(() => {
            expect(etapaModalidadeSelect).toHaveTextContent("EMEF");
        });
    });

    describe("Campo Nome da Unidade Educacional", () => {
        it("deve permitir digitar o nome da UE", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const nomeInput = screen.getByPlaceholderText(
                /Exemplo: EMEF João da Silva/i
            );
            fireEvent.change(nomeInput, {
                target: { value: "EMEF Maria Clara" },
            });

            await waitFor(() => {
                expect(nomeInput).toHaveValue("EMEF Maria Clara");
            });
        });

        it("deve exibir erro se o nome da UE tiver menos de 3 caracteres", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const nomeInput = screen.getByPlaceholderText(
                /Exemplo: EMEF João da Silva/i
            );
            fireEvent.change(nomeInput, { target: { value: "AB" } });
            fireEvent.blur(nomeInput);

            await waitFor(() => {
                expect(
                    screen.getByText(/Campo obrigatório/i)
                ).toBeInTheDocument();
            });
        });
    });

    describe("Campo Rede", () => {
        it("deve exibir as opções Direta e Indireta", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const tipoSelect = getSelectByLabel("Tipo*");
            fireEvent.click(tipoSelect);

            await waitFor(() => {
                expect(screen.getAllByText("Direta").length).toBeGreaterThan(0);
                expect(screen.getAllByText("Indireta").length).toBeGreaterThan(
                    0
                );
            });
        });

        it("deve permitir selecionar uma rede", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const tipoSelect = getSelectByLabel("Tipo*");
            fireEvent.click(tipoSelect);

            await waitFor(() => {
                const diretaOptions = screen.getAllByText("Direta");
                fireEvent.click(diretaOptions.at(-1)!);
            });

            await waitFor(() => {
                expect(tipoSelect).toHaveTextContent("Direta");
            });
        });
    });

    describe("Campo Código EOL", () => {
        it("deve permitir digitar apenas números", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const codigoInput =
                screen.getByPlaceholderText(/Exemplo: 1234567/i);
            fireEvent.change(codigoInput, { target: { value: "123456" } });

            await waitFor(() => {
                expect(codigoInput).toHaveValue(123456);
            });
        });
    });

    describe("Campo Diretoria Regional", () => {
        it("deve exibir as opções de DRE do hook useFetchDREs", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const dreSelect = getSelectByLabel("Diretoria Regional*");
            fireEvent.click(dreSelect);

            await waitFor(() => {
                expect(
                    screen.getAllByText("DRE - Butantã").length
                ).toBeGreaterThan(0);
                expect(
                    screen.getAllByText("DRE - Centro").length
                ).toBeGreaterThan(0);
                expect(
                    screen.getAllByText("DRE - Capela do Socorro").length
                ).toBeGreaterThan(0);
            });
        });

        it("deve permitir selecionar uma DRE", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const dreSelect = getSelectByLabel("Diretoria Regional*");
            fireEvent.click(dreSelect);

            await waitFor(() => {
                const dreOptions = screen.getAllByText("DRE - Butantã");
                fireEvent.click(dreOptions.at(-1)!);
            });

            await waitFor(() => {
                expect(dreSelect).toHaveTextContent("DRE - Butantã");
            });
        });
    });

    describe("Comportamento ao selecionar tipo DRE", () => {
        const selectTipoAndWait = async (tipo: string) => {
            const etapaModalidadeSelect = getSelectByLabel("Etapa/modalidade*");
            fireEvent.click(etapaModalidadeSelect);
            await waitFor(() => {
                const options = screen.getAllByText(tipo);
                fireEvent.click(options.at(-1)!);
            });
        };

        it("deve ocultar campos de Diretoria Regional quando tipo for DRE", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            await selectTipoAndWait("DRE");

            await waitFor(() => {
                expect(
                    screen.queryByLabelText(/Diretoria Regional\*/i)
                ).not.toBeInTheDocument();
            });
        });

        it("deve exibir campo de Diretoria Regional quando tipo não for DRE", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            await selectTipoAndWait("EMEF");

            await waitFor(() => {
                expect(
                    getSelectByLabel("Diretoria Regional*")
                ).toBeInTheDocument();
            });
        });

        it("deve exibir campo Sigla for selecionar tipo DRE", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            await selectTipoAndWait("DRE");
            await waitFor(() => {
                expect(
                    screen.getByText("Sigla da DRE (opcional)")
                ).toBeInTheDocument();
            });
        });
    });

    describe("Usuário Ponto Focal", () => {
        beforeEach(async () => {
            const useUserStoreModule = await import("@/stores/useUserStore");
            const useUserPermissionsModule = await import(
                "@/hooks/useUserPermissions"
            );
            const mockUseUserStore = vi.mocked(useUserStoreModule.useUserStore);

            mockUseUserStore.mockImplementation((selector: unknown) => {
                if (typeof selector === "function") {
                    return selector({ user: mockUser });
                }
                return { user: mockUser };
            });

            vi.mocked(
                useUserPermissionsModule.useUserPermissions
            ).mockReturnValue({
                isPontoFocal: true,
                isGipe: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            });
        });

        it("deve preencher automaticamente a DRE do usuário ponto focal", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            await waitFor(() => {
                const dreSelect = getSelectByLabel("Diretoria Regional*");
                expect(dreSelect).toHaveTextContent("DRE - Butantã");
            });
        });

        it("deve desabilitar o campo DRE para usuário ponto focal", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            await waitFor(() => {
                const dreSelect = getSelectByLabel("Diretoria Regional*");
                expect(dreSelect).toBeDisabled();
            });
        });
    });

    describe("Validação do formulário", () => {
        beforeEach(async () => {
            const useUserStoreModule = await import("@/stores/useUserStore");
            const useUserPermissionsModule = await import(
                "@/hooks/useUserPermissions"
            );
            const mockUseUserStore = vi.mocked(useUserStoreModule.useUserStore);

            mockUseUserStore.mockImplementation((selector: unknown) => {
                if (typeof selector === "function") {
                    return selector({ user: mockUser });
                }
                return { user: mockUser };
            });

            vi.mocked(
                useUserPermissionsModule.useUserPermissions
            ).mockReturnValue({
                isPontoFocal: false,
                isGipe: true,
                isAssistenteOuDiretor: false,
                isGipeAdmin: true,
            });
        });

        const preencherCamposObrigatorios = async ({
            tipo,
            nome,
            rede,
            codigo,
            dre,
        }: {
            tipo: string;
            nome: string;
            rede: string;
            codigo: string;
            dre?: string;
        }) => {
            const etapaModalidadeSelect = getSelectByLabel("Etapa/modalidade*");
            fireEvent.click(etapaModalidadeSelect);
            await waitFor(() => {
                const options = screen.getAllByText(tipo);
                fireEvent.click(options.at(-1)!);
            });

            const nomeInput = screen.getByPlaceholderText(
                /Exemplo: EMEF João da Silva/i
            );
            fireEvent.change(nomeInput, { target: { value: nome } });

            const tipoSelect = getSelectByLabel("Tipo*");
            fireEvent.click(tipoSelect);
            await waitFor(() => {
                const options = screen.getAllByText(rede);
                fireEvent.click(options.at(-1)!);
            });

            const codigoInput =
                screen.getByPlaceholderText(/Exemplo: 1234567/i);
            fireEvent.change(codigoInput, { target: { value: codigo } });

            if (dre) {
                const dreSelect = getSelectByLabel("Diretoria Regional*");
                fireEvent.click(dreSelect);
                await waitFor(() => {
                    const dreOptions = screen.getAllByText(dre);
                    fireEvent.click(dreOptions.at(-1)!);
                });
            }
        };

        it("deve habilitar o botão de cadastrar quando todos os campos obrigatórios forem preenchidos", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            await preencherCamposObrigatorios({
                tipo: "EMEF",
                nome: "EMEF Teste",
                rede: "Direta",
                codigo: "123456",
                dre: "DRE - Butantã",
            });

            await waitFor(() => {
                const cadastrarButton = screen.getByRole("button", {
                    name: /Cadastrar UE/i,
                });
                expect(cadastrarButton).not.toBeDisabled();
            });
        });

        it("deve habilitar o botão quando tipo for DRE e campos não-DRE estiverem preenchidos", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            await preencherCamposObrigatorios({
                tipo: "DRE",
                nome: "DRE Butantã",
                rede: "Direta",
                codigo: "123456",
            });

            await waitFor(() => {
                const cadastrarButton = screen.getByRole("button", {
                    name: /Cadastrar UE/i,
                });
                expect(cadastrarButton).not.toBeDisabled();
            });
        });
    });

    describe("Botões de ação", () => {
        it("deve redirecionar para a página de gestão ao clicar em Cancelar", () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const cancelarButton = screen.getByRole("button", {
                name: /Cancelar/i,
            });
            fireEvent.click(cancelarButton);

            expect(mockPush).toHaveBeenCalledWith(
                "/dashboard/gestao-unidades-educacionais"
            );
        });

        it("deve chamar o cadastro e exibir toast de sucesso ao submeter o formulário válido", async () => {
            const { toast } = await import("@/components/ui/headless-toast");
            mockCadastrarUnidade.mockResolvedValueOnce({ success: true });
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const etapaModalidadeSelect = getSelectByLabel("Etapa/modalidade*");
            fireEvent.click(etapaModalidadeSelect);
            await waitFor(() => {
                const options = screen.getAllByText("EMEF");
                fireEvent.click(options.at(-1)!);
            });

            const nomeInput = screen.getByPlaceholderText(
                /Exemplo: EMEF João da Silva/i
            );
            fireEvent.change(nomeInput, { target: { value: "EMEF Teste" } });

            const tipoSelect = getSelectByLabel("Tipo*");
            fireEvent.click(tipoSelect);
            await waitFor(() => {
                const options = screen.getAllByText("Direta");
                fireEvent.click(options.at(-1)!);
            });

            const codigoInput =
                screen.getByPlaceholderText(/Exemplo: 1234567/i);
            fireEvent.change(codigoInput, { target: { value: "123456" } });

            const dreSelect = getSelectByLabel("Diretoria Regional*");
            fireEvent.click(dreSelect);
            await waitFor(() => {
                const options = screen.getAllByText("DRE - Butantã");
                fireEvent.click(options.at(-1)!);
            });

            const cadastrarButton = screen.getByRole("button", {
                name: /Cadastrar UE/i,
            });

            await waitFor(() => {
                expect(cadastrarButton).not.toBeDisabled();
            });

            fireEvent.click(cadastrarButton);

            await waitFor(() => {
                expect(mockCadastrarUnidade).toHaveBeenCalled();
                expect(toast).toHaveBeenCalledWith(
                    expect.objectContaining({
                        title: expect.stringMatching(/sucesso|certo/i),
                        variant: "success",
                    })
                );
                expect(mockPush).toHaveBeenCalledWith(
                    "/dashboard/gestao-unidades-educacionais"
                );
            });
        });

        it("deve exibir toast de erro ao falhar o cadastro", async () => {
            const { toast } = await import("@/components/ui/headless-toast");
            mockCadastrarUnidade.mockResolvedValueOnce({
                success: false,
                error: "Erro ao cadastrar unidade",
            });
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const etapaModalidadeSelect = getSelectByLabel("Etapa/modalidade*");
            fireEvent.click(etapaModalidadeSelect);
            await waitFor(() => {
                const options = screen.getAllByText("EMEF");
                fireEvent.click(options.at(-1)!);
            });

            const nomeInput = screen.getByPlaceholderText(
                /Exemplo: EMEF João da Silva/i
            );
            fireEvent.change(nomeInput, { target: { value: "EMEF Teste" } });

            const tipoSelect = getSelectByLabel("Tipo*");
            fireEvent.click(tipoSelect);
            await waitFor(() => {
                const options = screen.getAllByText("Direta");
                fireEvent.click(options.at(-1)!);
            });

            const codigoInput =
                screen.getByPlaceholderText(/Exemplo: 1234567/i);
            fireEvent.change(codigoInput, { target: { value: "123456" } });

            const dreSelect = getSelectByLabel("Diretoria Regional*");
            fireEvent.click(dreSelect);
            await waitFor(() => {
                const options = screen.getAllByText("DRE - Butantã");
                fireEvent.click(options.at(-1)!);
            });

            const cadastrarButton = screen.getByRole("button", {
                name: /Cadastrar UE/i,
            });

            await waitFor(() => {
                expect(cadastrarButton).not.toBeDisabled();
            });

            fireEvent.click(cadastrarButton);

            await waitFor(() => {
                expect(mockCadastrarUnidade).toHaveBeenCalled();
                expect(toast).toHaveBeenCalledWith(
                    expect.objectContaining({
                        title: expect.stringMatching(/erro|ação/i),
                        variant: "error",
                    })
                );
            });
        });
    });

    describe("Modo de Edição", () => {
        const mockUnidadeData = {
            uuid: "unidade-123",
            nome: "EMEF João da Silva",
            codigo_eol: "123456",
            tipo_unidade: "EMEF",
            rede: "DIRETA",
            dre_uuid: "dre-1",
            sigla: "JDS",
            ativa: true,
        };

        beforeEach(() => {
            vi.clearAllMocks();
            mockObterUnidade.mockReturnValue({
                data: mockUnidadeData,
                isLoading: false,
            });
        });

        it("deve renderizar o formulário em modo de edição com dados carregados", async () => {
            render(
                <FormularioCadastroUnidadeEducacional
                    mode="edit"
                    unidadeUuid="unidade-123"
                />,
                { wrapper }
            );

            await waitFor(() => {
                const nomeInput = screen.getByPlaceholderText(
                    /Exemplo: EMEF João da Silva/i
                );
                expect(nomeInput).toHaveValue("EMEF João da Silva");
            });
        });

        it("deve preencher automaticamente todos os campos com os dados da unidade", async () => {
            render(
                <FormularioCadastroUnidadeEducacional
                    mode="edit"
                    unidadeUuid="unidade-123"
                />,
                { wrapper }
            );

            await waitFor(() => {
                const nomeInput = screen.getByPlaceholderText(
                    /Exemplo: EMEF João da Silva/i
                );
                expect(nomeInput).toHaveValue("EMEF João da Silva");

                const codigoInput =
                    screen.getByPlaceholderText(/Exemplo: 1234567/i);
                expect(codigoInput).toHaveValue(123456);

                const etapaModalidadeSelect =
                    getSelectByLabel("Etapa/modalidade*");
                expect(etapaModalidadeSelect).toHaveTextContent("EMEF");

                const tipoSelect = getSelectByLabel("Tipo*");
                expect(tipoSelect).toHaveTextContent("Direta");
            });
        });

        it("deve desabilitar os campos Rede e Código EOL no modo de edição", async () => {
            render(
                <FormularioCadastroUnidadeEducacional
                    mode="edit"
                    unidadeUuid="unidade-123"
                />,
                { wrapper }
            );

            await waitFor(() => {
                const tipoSelect = getSelectByLabel("Tipo*");
                expect(tipoSelect).toBeDisabled();

                const codigoInput =
                    screen.getByPlaceholderText(/Exemplo: 1234567/i);
                expect(codigoInput).toBeDisabled();
            });
        });

        it("deve exibir o botão 'Salvar alterações' em vez de 'Cadastrar UE'", async () => {
            render(
                <FormularioCadastroUnidadeEducacional
                    mode="edit"
                    unidadeUuid="unidade-123"
                />,
                { wrapper }
            );

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: /Salvar alterações/i })
                ).toBeInTheDocument();
                expect(
                    screen.queryByRole("button", { name: /Cadastrar UE/i })
                ).not.toBeInTheDocument();
            });
        });

        it("deve chamar atualizarUnidade ao submeter o formulário em modo de edição", async () => {
            const { toast } = await import("@/components/ui/headless-toast");
            mockAtualizarUnidade.mockResolvedValueOnce({ success: true });

            render(
                <FormularioCadastroUnidadeEducacional
                    mode="edit"
                    unidadeUuid="unidade-123"
                />,
                { wrapper }
            );

            await waitFor(() => {
                const nomeInput = screen.getByPlaceholderText(
                    /Exemplo: EMEF João da Silva/i
                );
                expect(nomeInput).toHaveValue("EMEF João da Silva");
            });

            const nomeInput = screen.getByPlaceholderText(
                /Exemplo: EMEF João da Silva/i
            );
            fireEvent.change(nomeInput, {
                target: { value: "EMEF João da Silva Atualizado" },
            });

            const salvarButton = screen.getByRole("button", {
                name: /Salvar alterações/i,
            });

            await waitFor(() => {
                expect(salvarButton).toBeEnabled();
            });

            fireEvent.click(salvarButton);

            await waitFor(() => {
                expect(mockAtualizarUnidade).toHaveBeenCalledWith({
                    nome: "EMEF João da Silva Atualizado",
                    codigo_eol: "123456",
                    tipo_unidade: "EMEF",
                    rede: "DIRETA",
                    sigla: "JDS",
                    ativa: true,
                    dre: "dre-1",
                });
                expect(toast).toHaveBeenCalledWith(
                    expect.objectContaining({
                        title: "Tudo certo por aqui!",
                        description: "As alterações foram salvas com sucesso!",
                        variant: "success",
                    })
                );
            });
        });

        it("deve exibir toast de erro ao falhar a atualização", async () => {
            const { toast } = await import("@/components/ui/headless-toast");
            mockAtualizarUnidade.mockResolvedValueOnce({
                success: false,
                error: "Erro ao atualizar unidade",
            });

            render(
                <FormularioCadastroUnidadeEducacional
                    mode="edit"
                    unidadeUuid="unidade-123"
                />,
                { wrapper }
            );

            await waitFor(() => {
                const nomeInput = screen.getByPlaceholderText(
                    /Exemplo: EMEF João da Silva/i
                );
                expect(nomeInput).toHaveValue("EMEF João da Silva");
            });

            const salvarButton = screen.getByRole("button", {
                name: /Salvar alterações/i,
            });

            fireEvent.click(salvarButton);

            await waitFor(() => {
                expect(mockAtualizarUnidade).toHaveBeenCalled();
                expect(toast).toHaveBeenCalledWith(
                    expect.objectContaining({
                        title: "Não conseguimos concluir a ação!",
                        description: "Erro ao atualizar unidade",
                        variant: "error",
                    })
                );
            });
        });

        it("deve invalidar o cache da unidade após atualização bem-sucedida", async () => {
            mockAtualizarUnidade.mockResolvedValueOnce({ success: true });

            render(
                <FormularioCadastroUnidadeEducacional
                    mode="edit"
                    unidadeUuid="unidade-123"
                />,
                { wrapper }
            );

            await waitFor(() => {
                const nomeInput = screen.getByPlaceholderText(
                    /Exemplo: EMEF João da Silva/i
                );
                expect(nomeInput).toHaveValue("EMEF João da Silva");
            });

            const nomeInput = screen.getByPlaceholderText(
                /Exemplo: EMEF João da Silva/i
            );
            fireEvent.change(nomeInput, {
                target: { value: "EMEF Novo Nome" },
            });

            const salvarButton = screen.getByRole("button", {
                name: /Salvar alterações/i,
            });

            await waitFor(() => {
                expect(salvarButton).toBeEnabled();
            });

            fireEvent.click(salvarButton);

            await waitFor(() => {
                expect(mockAtualizarUnidade).toHaveBeenCalled();
                expect(mockPush).toHaveBeenCalledWith(
                    "/dashboard/gestao-unidades-educacionais"
                );
            });
        });

        it("não deve chamar cadastrarUnidade no modo de edição", async () => {
            mockAtualizarUnidade.mockResolvedValueOnce({ success: true });

            render(
                <FormularioCadastroUnidadeEducacional
                    mode="edit"
                    unidadeUuid="unidade-123"
                />,
                { wrapper }
            );

            await waitFor(() => {
                const nomeInput = screen.getByPlaceholderText(
                    /Exemplo: EMEF João da Silva/i
                );
                expect(nomeInput).toHaveValue("EMEF João da Silva");
            });

            const salvarButton = screen.getByRole("button", {
                name: /Salvar alterações/i,
            });

            fireEvent.click(salvarButton);

            await waitFor(() => {
                expect(mockAtualizarUnidade).toHaveBeenCalled();
                expect(mockCadastrarUnidade).not.toHaveBeenCalled();
            });
        });
    });

    describe("Mensagem de inativação", () => {
        it("deve exibir motivo e dados de inativação quando a unidade estiver inativa", async () => {
            mockObterUnidade.mockReturnValue({
                data: {
                    uuid: "unidade-123",
                    nome: "EMEF João da Silva",
                    codigo_eol: "123456",
                    tipo_unidade: "EMEF",
                    rede: "DIRETA",
                    dre_uuid: "dre-1",
                    sigla: "JDS",
                    ativa: false,
                    motivo_inativacao: "Motivo de teste",
                    data_inativacao_formatada: "01/01/2024",
                    responsavel_inativacao_nome: "Maria Teste",
                },
                isLoading: false,
            });

            render(
                <FormularioCadastroUnidadeEducacional
                    mode="edit"
                    unidadeUuid="unidade-123"
                />,
                { wrapper }
            );

            await waitFor(() => {
                expect(
                    screen.getByText("Motivo da inativação UE:")
                ).toBeInTheDocument();
                expect(screen.getByText("Motivo de teste")).toBeInTheDocument();
                expect(
                    screen.getByText(
                        /Inativado por Maria Teste em 01\/01\/2024/i
                    )
                ).toBeInTheDocument();
            });
        });

        it("deve renderizar mensagem mesmo sem data e responsável informados", async () => {
            mockObterUnidade.mockReturnValue({
                data: {
                    uuid: "unidade-123",
                    nome: "EMEF João da Silva",
                    codigo_eol: "123456",
                    tipo_unidade: "EMEF",
                    rede: "DIRETA",
                    dre_uuid: "dre-1",
                    sigla: "JDS",
                    ativa: false,
                    motivo_inativacao: "Motivo de teste",
                    data_inativacao_formatada: undefined,
                    responsavel_inativacao_nome: undefined,
                },
                isLoading: false,
            });

            render(
                <FormularioCadastroUnidadeEducacional
                    mode="edit"
                    unidadeUuid="unidade-123"
                />,
                { wrapper }
            );

            await waitFor(() => {
                expect(screen.getByText("Motivo de teste")).toBeInTheDocument();
                expect(
                    screen.getByText("Inativado por em")
                ).toBeInTheDocument();
            });
        });
    });
});
