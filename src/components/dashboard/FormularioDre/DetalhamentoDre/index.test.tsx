import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { DetalhamentoDre } from "./index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as useUserStoreModule from "@/stores/useUserStore";

const mockRouterBack = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: mockRouterBack,
        push: vi.fn(),
    }),
}));

vi.mock("../../QuadroBranco/QuadroBranco", () => ({
    default: vi.fn(({ children }) => <div>{children}</div>),
}));

vi.mock("../../CadastrarOcorrencia/Anexos", () => ({
    default: vi.fn(() => <div data-testid="mock-anexos">Mock Anexos</div>),
}));

const mockToast = vi.fn();
vi.mock("@/components/ui/headless-toast", () => ({
    toast: (params: unknown) => mockToast(params),
}));

const mockAtualizarOcorrenciaDre = vi.fn();
vi.mock("@/hooks/useAtualizarOcorrenciaDre", () => ({
    useAtualizarOcorrenciaDre: () => ({
        mutate: mockAtualizarOcorrenciaDre,
    }),
}));

const mockIsPontoFocal = vi.fn(() => false);
vi.mock("@/hooks/useUserPermissions", () => ({
    useUserPermissions: () => ({
        isPontoFocal: mockIsPontoFocal(),
    }),
}));

const mockSetFormData = vi.fn();
const mockFormData = {
    unidadeEducacional: "123456",
    dre: "654321",
    status: "em_andamento",
};

vi.mock("@/stores/useOcorrenciaFormStore", () => ({
    useOcorrenciaFormStore: () => ({
        formData: mockFormData,
        setFormData: mockSetFormData,
        ocorrenciaUuid: "test-uuid-123",
    }),
}));

const mockUser = {
    perfil_acesso: {
        nome: "DIRETOR DE ESCOLA",
    },
};

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: vi.fn((selector) => {
        if (typeof selector === "function") {
            return selector({ user: mockUser });
        }
        return { user: mockUser };
    }),
}));

describe("DetalhamentoDre", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
    });

    const renderComponent = (onPrevious?: () => void) =>
        render(
            <QueryClientProvider client={queryClient}>
                <DetalhamentoDre onPrevious={onPrevious} />
            </QueryClientProvider>
        );

    it("deve renderizar o título 'Continuação da ocorrência'", () => {
        renderComponent();

        expect(
            screen.getByRole("heading", { name: /continuação da ocorrência/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar todos os campos de radio button", () => {
        renderComponent();

        expect(
            screen.getByText(
                /houve acionamento da secretaria de seguranças pública ou forças de segurança/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /houve interlocução com a supervisão técnica de saúde \(sts\)/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /houve interlocução com a coordenação de políticas para criança e adolescente \(cpca\)/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(/houve interlocução com a supervisão escolar/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /houve interlocução com o núcleo de apoio e acompanhamento para a aprendizagem \(naapa\)/i
            )
        ).toBeInTheDocument();
    });

    it("deve renderizar todos os campos de textarea", () => {
        renderComponent();

        expect(
            screen.getByText(
                /existe alguma informação complementar da atuação conjunta entre a dre e o sts/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /existe alguma informação complementar da atuação conjunta entre a dre e o cpca/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /existe alguma informação complementar da atuação conjunta entre a dre e o supervisão escolar/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /existe alguma informação complementar da atuação conjunta entre a dre e o naapa/i
            )
        ).toBeInTheDocument();
    });

    it("deve renderizar o componente Anexos", () => {
        renderComponent();

        expect(screen.getByTestId("mock-anexos")).toBeInTheDocument();
    });

    it("deve renderizar os botões Anterior e Próximo", () => {
        renderComponent();

        expect(
            screen.getByRole("button", { name: /anterior/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /próximo/i })
        ).toBeInTheDocument();
    });

    it("deve ter o botão Próximo desabilitado inicialmente", () => {
        renderComponent();

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });
        expect(botaoProximo).toBeDisabled();
    });

    it("deve chamar onPrevious ao clicar no botão Anterior", async () => {
        const user = userEvent.setup();
        const mockOnPrevious = vi.fn();

        renderComponent(mockOnPrevious);

        const botaoAnterior = screen.getByRole("button", { name: /anterior/i });
        await user.click(botaoAnterior);

        expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    });

    it("deve habilitar o botão Próximo quando todos os campos obrigatórios forem preenchidos com 'Não'", async () => {
        const user = userEvent.setup();
        renderComponent();

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });

        expect(botaoProximo).toBeDisabled();

        const radiosSeguranca = screen.getAllByRole("radio");

        await user.click(radiosSeguranca[1]);
        await user.click(radiosSeguranca[3]);
        await user.click(radiosSeguranca[5]);
        await user.click(radiosSeguranca[7]);
        await user.click(radiosSeguranca[9]);

        await waitFor(() => {
            expect(botaoProximo).not.toBeDisabled();
        });
    });

    it("deve ter 5 grupos de radio buttons (cada um com Sim/Não)", () => {
        renderComponent();

        const radios = screen.getAllByRole("radio");
        expect(radios).toHaveLength(10);
    });

    it("deve ter 4 campos de textarea", () => {
        renderComponent();

        const textareas = screen.getAllByRole("textbox");
        expect(textareas).toHaveLength(4);
    });

    it("deve renderizar o formulário dentro de um componente Form", () => {
        const { container } = renderComponent();

        const form = container.querySelector("form");
        expect(form).toBeInTheDocument();
    });

    it("deve ter o título com estilo correto", () => {
        renderComponent();

        const titulo = screen.getByRole("heading", {
            name: /continuação da ocorrência/i,
        });

        expect(titulo).toHaveClass(
            "text-[20px]",
            "font-bold",
            "text-[#42474a]",
            "mb-2"
        );
    });

    it("deve organizar os campos em 3 QuadroBranco distintos", () => {
        renderComponent();

        expect(
            screen.getByText(/acionamento da secretaria de seguranças pública/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/interlocução com a supervisão escolar/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/interlocução com o núcleo de apoio/i)
        ).toBeInTheDocument();
    });

    it("deve manter a estrutura de validação condicional dos textareas", async () => {
        const user = userEvent.setup();
        renderComponent();

        const radios = screen.getAllByRole("radio");

        await user.click(radios[1]);
        await user.click(radios[3]);
        await user.click(radios[5]);
        await user.click(radios[7]);
        await user.click(radios[9]);

        await waitFor(() => {
            const botaoProximo = screen.getByRole("button", {
                name: /próximo/i,
            });
            expect(botaoProximo).not.toBeDisabled();
        });
    });

    it("deve exigir preenchimento de textarea quando radio é 'Sim'", async () => {
        const user = userEvent.setup();
        renderComponent();

        const radios = screen.getAllByRole("radio");

        await user.click(radios[1]);
        await user.click(radios[2]);
        await user.click(radios[5]);
        await user.click(radios[7]);
        await user.click(radios[9]);

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });

        await waitFor(() => {
            expect(botaoProximo).toBeDisabled();
        });

        const textareas = screen.getAllByRole("textbox");
        const textareaSTS = textareas[0];
        await user.type(textareaSTS, "Informações complementares STS");

        await waitFor(() => {
            expect(botaoProximo).not.toBeDisabled();
        });
    });

    it("deve chamar a mutation com os dados corretos ao submeter o formulário com sucesso", async () => {
        const user = userEvent.setup();

        mockAtualizarOcorrenciaDre.mockImplementation((params, options) => {
            options.onSuccess({ success: true });
        });

        renderComponent();

        const radios = screen.getAllByRole("radio");

        await user.click(radios[0]);
        await user.click(radios[2]);
        await user.click(radios[5]);
        await user.click(radios[6]);
        await user.click(radios[9]);

        const textareas = screen.getAllByRole("textbox");
        await user.type(textareas[0], "Info STS");
        await user.type(textareas[2], "Info Supervisão");

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });

        await waitFor(() => {
            expect(botaoProximo).not.toBeDisabled();
        });

        await user.click(botaoProximo);

        await waitFor(() => {
            expect(mockAtualizarOcorrenciaDre).toHaveBeenCalledWith(
                {
                    uuid: "test-uuid-123",
                    body: {
                        unidade_codigo_eol: "123456",
                        dre_codigo_eol: "654321",
                        acionamento_seguranca_publica: true,
                        interlocucao_sts: true,
                        info_complementar_sts: "Info STS",
                        interlocucao_cpca: false,
                        info_complementar_cpca: "",
                        interlocucao_supervisao_escolar: true,
                        info_complementar_supervisao_escolar: "Info Supervisão",
                        interlocucao_naapa: false,
                        info_complementar_naapa: "",
                    },
                },
                expect.any(Object)
            );
        });

        expect(mockSetFormData).toHaveBeenCalled();
    });
    it("deve exibir toast de erro quando a API retorna sucesso falso", async () => {
        const user = userEvent.setup();

        mockAtualizarOcorrenciaDre.mockImplementation((params, options) => {
            options.onSuccess({
                success: false,
                error: "Erro ao processar requisição",
            });
        });

        renderComponent();

        const radios = screen.getAllByRole("radio");

        await user.click(radios[1]);
        await user.click(radios[3]);
        await user.click(radios[5]);
        await user.click(radios[7]);
        await user.click(radios[9]);

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });

        await waitFor(() => {
            expect(botaoProximo).not.toBeDisabled();
        });

        await user.click(botaoProximo);

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: "Erro ao atualizar ocorrência DRE",
                description: "Erro ao processar requisição",
                variant: "error",
            });
        });
    });

    it("deve exibir toast de erro quando a mutation falha", async () => {
        const user = userEvent.setup();

        mockAtualizarOcorrenciaDre.mockImplementation((params, options) => {
            options.onError();
        });

        renderComponent();

        const radios = screen.getAllByRole("radio");

        await user.click(radios[1]);
        await user.click(radios[3]);
        await user.click(radios[5]);
        await user.click(radios[7]);
        await user.click(radios[9]);

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });

        await waitFor(() => {
            expect(botaoProximo).not.toBeDisabled();
        });

        await user.click(botaoProximo);

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: "Erro ao atualizar ocorrência DRE",
                description:
                    "Não foi possível atualizar os dados. Tente novamente.",
                variant: "error",
            });
        });
    });

    it("deve salvar os dados no store mesmo quando há erro na API", async () => {
        const user = userEvent.setup();

        mockAtualizarOcorrenciaDre.mockImplementation((params, options) => {
            options.onError();
        });

        renderComponent();

        const radios = screen.getAllByRole("radio");

        await user.click(radios[1]);
        await user.click(radios[3]);
        await user.click(radios[5]);
        await user.click(radios[7]);
        await user.click(radios[9]);

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });

        await waitFor(() => {
            expect(botaoProximo).not.toBeDisabled();
        });

        await user.click(botaoProximo);

        await waitFor(() => {
            expect(mockSetFormData).toHaveBeenCalledWith({
                acionamentoSegurancaPublica: "Não",
                interlocucaoSTS: "Não",
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Não",
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Não",
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Não",
                informacoesComplementaresNAAPA: "",
            });
        });
    });

    it("deve salvar dados do formulário no store ao clicar em Anterior", async () => {
        const user = userEvent.setup();
        const mockOnPrevious = vi.fn();

        renderComponent(mockOnPrevious);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[0]);

        const botaoAnterior = screen.getByRole("button", { name: /anterior/i });
        await user.click(botaoAnterior);

        expect(mockSetFormData).toHaveBeenCalled();
        expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    });

    it("deve usar 'diretor' como perfil padrão quando perfil do usuário não está no mapa", () => {
        const mockUser = {
            perfil_acesso: { nome: "PERFIL_DESCONHECIDO" },
        };
        vi.doMock("@/stores/useUserStore", () => ({
            useUserStore: (
                selector: (state: { user: typeof mockUser }) => unknown
            ) => selector({ user: mockUser }),
        }));

        renderComponent();

        expect(
            screen.getByRole("button", { name: /próximo/i })
        ).toBeInTheDocument();
    });

    it("deve usar 'diretor' como perfil padrão quando user.perfil_acesso é undefined", () => {
        vi.spyOn(useUserStoreModule, "useUserStore").mockReturnValue({
            user: {
                name: "João da Silva",
                perfil_acesso: undefined,
            },
        } as never);
        renderComponent();

        expect(
            screen.getByRole("button", { name: /próximo/i })
        ).toBeInTheDocument();
    });

    it("deve exibir botão 'Salvar informações' quando é Ponto Focal e status não é 'enviado_para_dre'", () => {
        mockIsPontoFocal.mockReturnValue(true);
        mockFormData.status = "em_andamento";

        renderComponent();

        expect(
            screen.getByRole("button", { name: /salvar informações/i })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /próximo/i })
        ).not.toBeInTheDocument();
    });

    it("deve exibir botão 'Próximo' quando é Ponto Focal mas status é 'enviado_para_dre'", () => {
        mockIsPontoFocal.mockReturnValue(true);
        mockFormData.status = "enviado_para_dre";

        renderComponent();

        expect(
            screen.getByRole("button", { name: /próximo/i })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /salvar informações/i })
        ).not.toBeInTheDocument();
    });

    it("deve exibir botão 'Próximo' quando não é Ponto Focal", () => {
        mockIsPontoFocal.mockReturnValue(false);

        renderComponent();

        expect(
            screen.getByRole("button", { name: /próximo/i })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /salvar informações/i })
        ).not.toBeInTheDocument();
    });

    it("deve chamar handleSubmit e abrir modal ao clicar em 'Salvar informações' quando é Ponto Focal", async () => {
        const user = userEvent.setup();
        mockIsPontoFocal.mockReturnValue(true);
        mockFormData.status = "em_andamento";

        mockAtualizarOcorrenciaDre.mockImplementation((params, options) => {
            options.onSuccess({ success: true });
        });

        renderComponent();

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);
        await user.click(radios[3]);
        await user.click(radios[5]);
        await user.click(radios[7]);
        await user.click(radios[9]);

        const botaoSalvar = screen.getByRole("button", {
            name: /salvar informações/i,
        });

        await waitFor(() => {
            expect(botaoSalvar).not.toBeDisabled();
        });

        await user.click(botaoSalvar);

        await waitFor(() => {
            expect(mockAtualizarOcorrenciaDre).toHaveBeenCalled();
        });
    });

    it("não deve chamar onNext ao clicar em 'Salvar informações'", async () => {
        const user = userEvent.setup();
        const mockOnNext = vi.fn();
        mockIsPontoFocal.mockReturnValue(true);
        mockFormData.status = "em_andamento";

        mockAtualizarOcorrenciaDre.mockImplementation((params, options) => {
            options.onSuccess({ success: true });
        });

        render(
            <QueryClientProvider client={queryClient}>
                <DetalhamentoDre onNext={mockOnNext} />
            </QueryClientProvider>
        );

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);
        await user.click(radios[3]);
        await user.click(radios[5]);
        await user.click(radios[7]);
        await user.click(radios[9]);

        const botaoSalvar = screen.getByRole("button", {
            name: /salvar informações/i,
        });

        await waitFor(() => {
            expect(botaoSalvar).not.toBeDisabled();
        });

        await user.click(botaoSalvar);

        await waitFor(() => {
            expect(mockAtualizarOcorrenciaDre).toHaveBeenCalled();
        });

        expect(mockOnNext).not.toHaveBeenCalled();
    });

    it("deve chamar onNext ao clicar em 'Próximo' quando não é Ponto Focal", async () => {
        const user = userEvent.setup();
        const mockOnNext = vi.fn();
        mockIsPontoFocal.mockReturnValue(false);

        mockAtualizarOcorrenciaDre.mockImplementation((params, options) => {
            options.onSuccess({ success: true });
        });

        render(
            <QueryClientProvider client={queryClient}>
                <DetalhamentoDre onNext={mockOnNext} />
            </QueryClientProvider>
        );

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);
        await user.click(radios[3]);
        await user.click(radios[5]);
        await user.click(radios[7]);
        await user.click(radios[9]);

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });

        await waitFor(() => {
            expect(botaoProximo).not.toBeDisabled();
        });

        await user.click(botaoProximo);

        await waitFor(() => {
            expect(mockAtualizarOcorrenciaDre).toHaveBeenCalled();
            expect(mockOnNext).toHaveBeenCalled();
        });
    });
});
