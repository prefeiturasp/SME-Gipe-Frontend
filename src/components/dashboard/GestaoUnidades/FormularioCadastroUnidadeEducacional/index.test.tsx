import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach } from "vitest";
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

vi.mock("@/hooks/useUnidades", () => ({
    useFetchDREs: () => ({
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

    describe("Renderização inicial", () => {
        it("deve renderizar o formulário com todos os campos iniciais", () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            expect(
                screen.getByText(
                    "Cadastre as informações da Unidade Educacional."
                )
            ).toBeInTheDocument();
            expect(screen.getByText("Tipo*")).toBeInTheDocument();
            expect(
                screen.getByText("Nome da Unidade Educacional*")
            ).toBeInTheDocument();
            expect(screen.getByText("Rede*")).toBeInTheDocument();
            expect(screen.getByText("Código EOL*")).toBeInTheDocument();
        });

        it("deve renderizar os campos de DRE e Sigla por padrão", () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            expect(screen.getByText("Diretoria Regional*")).toBeInTheDocument();
            expect(
                screen.getByText("Sigla da DRE (opcional)")
            ).toBeInTheDocument();
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
    });

    describe("Campo Tipo", () => {
        it("deve exibir todas as opções de tipo ao clicar no select", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const tipoSelect = getSelectByLabel("Tipo*");
            fireEvent.click(tipoSelect);

            await waitFor(() => {
                expect(screen.getAllByText("ADM").length).toBeGreaterThan(0);
                expect(screen.getAllByText("DRE").length).toBeGreaterThan(0);
                expect(screen.getAllByText("EMEF").length).toBeGreaterThan(0);
                expect(screen.getAllByText("EMEI").length).toBeGreaterThan(0);
                expect(screen.getAllByText("CEU").length).toBeGreaterThan(0);
                expect(screen.getAllByText("CEI").length).toBeGreaterThan(0);
            });
        });

        it("deve permitir selecionar um tipo", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const tipoSelect = getSelectByLabel("Tipo*");
            fireEvent.click(tipoSelect);

            await waitFor(() => {
                const emefOptions = screen.getAllByText("EMEF");
                fireEvent.click(emefOptions[emefOptions.length - 1]);
            });

            await waitFor(() => {
                expect(tipoSelect).toHaveTextContent("EMEF");
            });
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

            const redeSelect = getSelectByLabel("Rede*");
            fireEvent.click(redeSelect);

            await waitFor(() => {
                expect(screen.getAllByText("Direta").length).toBeGreaterThan(0);
                expect(screen.getAllByText("Indireta").length).toBeGreaterThan(
                    0
                );
            });
        });

        it("deve permitir selecionar uma rede", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const redeSelect = getSelectByLabel("Rede*");
            fireEvent.click(redeSelect);

            await waitFor(() => {
                const diretaOptions = screen.getAllByText("Direta");
                fireEvent.click(diretaOptions[diretaOptions.length - 1]);
            });

            await waitFor(() => {
                expect(redeSelect).toHaveTextContent("Direta");
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
                fireEvent.click(dreOptions[dreOptions.length - 1]);
            });

            await waitFor(() => {
                expect(dreSelect).toHaveTextContent("DRE - Butantã");
            });
        });
    });

    describe("Campo Sigla da DRE", () => {
        it("deve permitir digitar a sigla da DRE", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const siglaInput = screen.getByPlaceholderText(/Digite\.\.\./i);
            fireEvent.change(siglaInput, { target: { value: "BT" } });

            await waitFor(() => {
                expect(siglaInput).toHaveValue("BT");
            });
        });

        it("deve ser opcional (não exibir erro se vazio)", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const siglaInput = screen.getByPlaceholderText(/Digite\.\.\./);
            fireEvent.blur(siglaInput);

            await waitFor(() => {
                expect(siglaInput).toHaveValue("");
            });
        });
    });

    describe("Comportamento ao selecionar tipo DRE", () => {
        it("deve ocultar campos de Diretoria Regional e Sigla da DRE quando tipo for DRE", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const tipoSelect = getSelectByLabel("Tipo*");
            fireEvent.click(tipoSelect);

            await waitFor(() => {
                const dreOptions = screen.getAllByText("DRE");
                fireEvent.click(dreOptions[dreOptions.length - 1]);
            });

            await waitFor(() => {
                expect(
                    screen.queryByLabelText(/Diretoria Regional\*/i)
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByLabelText(/Sigla da DRE \(opcional\)/i)
                ).not.toBeInTheDocument();
            });
        });

        it("deve exibir campos de Diretoria Regional e Sigla quando tipo não for DRE", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const tipoSelect = getSelectByLabel("Tipo*");
            fireEvent.click(tipoSelect);

            await waitFor(() => {
                const emefOptions = screen.getAllByText("EMEF");
                fireEvent.click(emefOptions[emefOptions.length - 1]);
            });

            await waitFor(() => {
                expect(
                    getSelectByLabel("Diretoria Regional*")
                ).toBeInTheDocument();
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
        it("deve habilitar o botão de cadastrar quando todos os campos obrigatórios forem preenchidos", async () => {
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const tipoSelect = getSelectByLabel("Tipo*");
            fireEvent.click(tipoSelect);
            await waitFor(() => {
                const options = screen.getAllByText("EMEF");
                fireEvent.click(options[options.length - 1]);
            });

            const nomeInput = screen.getByPlaceholderText(
                /Exemplo: EMEF João da Silva/i
            );
            fireEvent.change(nomeInput, { target: { value: "EMEF Teste" } });

            const redeSelect = getSelectByLabel("Rede*");
            fireEvent.click(redeSelect);
            await waitFor(() => {
                const options = screen.getAllByText("Direta");
                fireEvent.click(options[options.length - 1]);
            });

            const codigoInput =
                screen.getByPlaceholderText(/Exemplo: 1234567/i);
            fireEvent.change(codigoInput, { target: { value: "123456" } });

            const dreSelect = getSelectByLabel("Diretoria Regional*");
            fireEvent.click(dreSelect);
            await waitFor(() => {
                const dreOptions = screen.getAllByText("DRE - Butantã");
                fireEvent.click(dreOptions[dreOptions.length - 1]);
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

            const tipoSelect = getSelectByLabel("Tipo*");
            fireEvent.click(tipoSelect);
            await waitFor(() => {
                const options = screen.getAllByText("DRE");
                fireEvent.click(options[options.length - 1]);
            });

            const nomeInput = screen.getByPlaceholderText(
                /Exemplo: EMEF João da Silva/i
            );
            fireEvent.change(nomeInput, {
                target: { value: "DRE Butantã" },
            });

            const redeSelect = getSelectByLabel("Rede*");
            fireEvent.click(redeSelect);
            await waitFor(() => {
                const options = screen.getAllByText("Direta");
                fireEvent.click(options[options.length - 1]);
            });

            const codigoInput =
                screen.getByPlaceholderText(/Exemplo: 1234567/i);
            fireEvent.change(codigoInput, { target: { value: "123456" } });

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

        it("deve chamar onSubmit ao clicar em Cadastrar UE com formulário válido", async () => {
            const consoleSpy = vi
                .spyOn(console, "log")
                .mockImplementation(() => {});
            render(<FormularioCadastroUnidadeEducacional />, { wrapper });

            const tipoSelect = getSelectByLabel("Tipo*");
            fireEvent.click(tipoSelect);
            await waitFor(() => {
                const options = screen.getAllByText("EMEF");
                fireEvent.click(options[options.length - 1]);
            });

            const nomeInput = screen.getByPlaceholderText(
                /Exemplo: EMEF João da Silva/i
            );
            fireEvent.change(nomeInput, { target: { value: "EMEF Teste" } });

            const redeSelect = getSelectByLabel("Rede*");
            fireEvent.click(redeSelect);
            await waitFor(() => {
                const options = screen.getAllByText("Direta");
                fireEvent.click(options[options.length - 1]);
            });

            const codigoInput =
                screen.getByPlaceholderText(/Exemplo: 1234567/i);
            fireEvent.change(codigoInput, { target: { value: "123456" } });

            const dreSelect = getSelectByLabel("Diretoria Regional*");
            fireEvent.click(dreSelect);
            await waitFor(() => {
                const options = screen.getAllByText("DRE - Butantã");
                fireEvent.click(options[options.length - 1]);
            });

            const cadastrarButton = screen.getByRole("button", {
                name: /Cadastrar UE/i,
            });

            await waitFor(() => {
                expect(cadastrarButton).not.toBeDisabled();
            });

            fireEvent.click(cadastrarButton);

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalled();
            });

            consoleSpy.mockRestore();
        });
    });
});
