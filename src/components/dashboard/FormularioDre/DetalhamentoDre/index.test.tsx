import * as useUserStoreModule from "@/stores/useUserStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DetalhamentoDre } from "./index";

const mockRouterBack = vi.fn();
const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: mockRouterBack,
        push: mockRouterPush,
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
            </QueryClientProvider>,
        );

    it("deve renderizar o título 'Continuação da ocorrência'", () => {
        renderComponent();

        expect(
            screen.getByRole("heading", { name: /continuação da ocorrência/i }),
        ).toBeInTheDocument();
    });

    it("deve renderizar os campos de checkbox e radio button", () => {
        renderComponent();

        expect(
            screen.getByText(/quais órgãos foram acionados pela dre/i),
        ).toBeInTheDocument();

        expect(
            screen.getByText(/h\u00e1 um n\u00famero do processo sei/i),
        ).toBeInTheDocument();
    });

    it("deve renderizar o componente Anexos", () => {
        renderComponent();

        expect(screen.getByTestId("mock-anexos")).toBeInTheDocument();
    });

    it("deve renderizar os botões Anterior e Próximo", () => {
        renderComponent();

        expect(
            screen.getByRole("button", { name: /anterior/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /próximo/i }),
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

    it("deve habilitar o botão Próximo quando todos os campos obrigatórios forem preenchidos", async () => {
        const user = userEvent.setup();
        renderComponent();

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });

        expect(botaoProximo).toBeDisabled();

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);

        await waitFor(() => {
            expect(botaoProximo).not.toBeDisabled();
        });
    });

    it("deve ter 4 checkboxes de órgãos e 1 grupo de radio buttons (Sim/Não)", () => {
        renderComponent();

        const checkboxes = screen.getAllByRole("checkbox");
        expect(checkboxes).toHaveLength(4);

        const radios = screen.getAllByRole("radio");
        expect(radios).toHaveLength(2);
    });

    it("deve remover órgão ao desmarcar checkbox previamente marcado", async () => {
        const user = userEvent.setup();
        renderComponent();

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);
        await user.click(checkboxes[1]);

        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);

        mockAtualizarOcorrenciaDre.mockImplementation((params, options) => {
            options.onSuccess({ success: true });
        });

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });

        await waitFor(() => {
            expect(botaoProximo).not.toBeDisabled();
        });

        await user.click(botaoProximo);

        await waitFor(() => {
            expect(mockAtualizarOcorrenciaDre).toHaveBeenCalledWith(
                expect.objectContaining({
                    body: expect.objectContaining({
                        quais_orgaos_acionados_dre: [
                            "comunicacao_assistencia_social",
                        ],
                    }),
                }),
                expect.any(Object),
            );
        });
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
            "mb-2",
        );
    });

    it("deve organizar os campos com checkboxes de órgãos e radio de SEI", () => {
        renderComponent();

        expect(
            screen.getByText(/quais órgãos foram acionados pela dre/i),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/n\u00famero do processo sei/i),
        ).toBeInTheDocument();
    });

    it("deve manter a estrutura de validação condicional do campo SEI", async () => {
        const user = userEvent.setup();
        renderComponent();

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);

        await waitFor(() => {
            const botaoProximo = screen.getByRole("button", {
                name: /próximo/i,
            });
            expect(botaoProximo).not.toBeDisabled();
        });
    });

    it("deve exigir preenchimento do campo SEI quando radio é 'Sim'", async () => {
        const user = userEvent.setup();
        renderComponent();

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[0]);

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });

        await waitFor(() => {
            expect(botaoProximo).toBeDisabled();
        });

        const input = screen.getByPlaceholderText(/exemplo: 1234/i);
        await user.type(input, "1234.5678/9012345-6");

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

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);

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
                        quais_orgaos_acionados_dre: [
                            "comunicacao_supervisao_tecnica_saude",
                        ],
                        nr_processo_sei: "",
                    },
                },
                expect.any(Object),
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

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);

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

    it("deve enviar o nr_processo_sei preenchido quando numeroProcedimentoSEI é 'Sim'", async () => {
        const user = userEvent.setup();

        mockAtualizarOcorrenciaDre.mockImplementation((params, options) => {
            options.onSuccess({ success: true });
        });

        renderComponent();

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[0]);

        const input = screen.getByPlaceholderText(/exemplo: 1234/i);
        await user.type(input, "1234567890123456");

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });

        await waitFor(() => {
            expect(botaoProximo).not.toBeDisabled();
        });

        await user.click(botaoProximo);

        await waitFor(() => {
            expect(mockAtualizarOcorrenciaDre).toHaveBeenCalledWith(
                expect.objectContaining({
                    body: expect.objectContaining({
                        nr_processo_sei: expect.stringMatching(/\d/),
                    }),
                }),
                expect.any(Object),
            );
        });
    });

    it("deve exibir toast de erro quando a mutation falha", async () => {
        const user = userEvent.setup();

        mockAtualizarOcorrenciaDre.mockImplementation((params, options) => {
            options.onError();
        });

        renderComponent();

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);

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

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);

        const botaoProximo = screen.getByRole("button", {
            name: /próximo/i,
        });

        await waitFor(() => {
            expect(botaoProximo).not.toBeDisabled();
        });

        await user.click(botaoProximo);

        await waitFor(() => {
            expect(mockSetFormData).toHaveBeenCalledWith({
                quaisOrgaosAcionadosDre: [
                    "comunicacao_supervisao_tecnica_saude",
                ],
                numeroProcedimentoSEI: "Não",
                numeroProcedimentoSEITexto: "",
            });
        });
    });

    it("deve salvar dados do formulário no store ao clicar em Anterior", async () => {
        const user = userEvent.setup();
        const mockOnPrevious = vi.fn();

        renderComponent(mockOnPrevious);

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

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
                selector: (state: { user: typeof mockUser }) => unknown,
            ) => selector({ user: mockUser }),
        }));

        renderComponent();

        expect(
            screen.getByRole("button", { name: /próximo/i }),
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
            screen.getByRole("button", { name: /próximo/i }),
        ).toBeInTheDocument();
    });

    it("deve exibir botão 'Finalizar' quando é Ponto Focal e status não é 'enviado_para_dre'", () => {
        mockIsPontoFocal.mockReturnValue(true);
        mockFormData.status = "em_andamento";

        renderComponent();

        expect(
            screen.getByRole("button", { name: /finalizar/i }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /finalizar e enviar/i }),
        ).not.toBeInTheDocument();
    });

    it("deve exibir botão 'Finalizar e enviar' quando é Ponto Focal e status é 'enviado_para_dre'", () => {
        mockIsPontoFocal.mockReturnValue(true);
        mockFormData.status = "enviado_para_dre";

        renderComponent();

        expect(
            screen.getByRole("button", { name: /finalizar e enviar/i }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /próximo/i }),
        ).not.toBeInTheDocument();
    });

    it("deve exibir botão 'Próximo' quando não é Ponto Focal", () => {
        mockIsPontoFocal.mockReturnValue(false);

        renderComponent();

        expect(
            screen.getByRole("button", { name: /próximo/i }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /finalizar e enviar/i }),
        ).not.toBeInTheDocument();
    });

    it("deve chamar handleSubmit e abrir modal ao clicar em 'Finalizar e enviar' quando é Ponto Focal", async () => {
        const user = userEvent.setup();
        mockIsPontoFocal.mockReturnValue(true);
        mockFormData.status = "enviado_para_dre";

        mockAtualizarOcorrenciaDre.mockImplementation((params, options) => {
            options.onSuccess({ success: true });
        });

        renderComponent();

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);

        const botaoSalvar = screen.getByRole("button", {
            name: /finalizar e enviar/i,
        });

        await waitFor(() => {
            expect(botaoSalvar).not.toBeDisabled();
        });

        await user.click(botaoSalvar);

        await waitFor(() => {
            expect(mockAtualizarOcorrenciaDre).toHaveBeenCalled();
        });
    });

    it("não deve chamar onNext ao clicar em 'Finalizar e enviar'", async () => {
        const user = userEvent.setup();
        const mockOnNext = vi.fn();
        mockIsPontoFocal.mockReturnValue(true);
        mockFormData.status = "enviado_para_dre";

        mockAtualizarOcorrenciaDre.mockImplementation((params, options) => {
            options.onSuccess({ success: true });
        });

        render(
            <QueryClientProvider client={queryClient}>
                <DetalhamentoDre onNext={mockOnNext} />
            </QueryClientProvider>,
        );

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);

        const botaoSalvar = screen.getByRole("button", {
            name: /finalizar e enviar/i,
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
            </QueryClientProvider>,
        );

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);

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

    it("deve redirecionar para dashboard quando Ponto Focal clica em 'Finalizar' em status diferente de 'enviado_para_dre'", async () => {
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
            </QueryClientProvider>,
        );

        const checkboxes = screen.getAllByRole("checkbox");
        await user.click(checkboxes[0]);

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);

        const botaoFinalizar = screen.getByRole("button", {
            name: /finalizar/i,
        });

        await waitFor(() => {
            expect(botaoFinalizar).not.toBeDisabled();
        });

        await user.click(botaoFinalizar);

        await waitFor(() => {
            expect(mockAtualizarOcorrenciaDre).toHaveBeenCalled();
            expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
            expect(mockOnNext).not.toHaveBeenCalled();
        });
    });

    describe("numeração de perguntas", () => {
        it("deve exibir prefixo '12.' no campo órgãos acionados quando startingQuestionNumber=12", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <DetalhamentoDre startingQuestionNumber={12} />
                </QueryClientProvider>,
            );

            expect(
                screen.getByText(
                    /^12\. Quais órgãos foram acionados pela DRE\?\*/,
                ),
            ).toBeInTheDocument();
        });

        it("deve exibir prefixo '13.' no campo processo SEI quando startingQuestionNumber=12", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <DetalhamentoDre startingQuestionNumber={12} />
                </QueryClientProvider>,
            );

            expect(
                screen.getByText(/^13\. Há um número do processo SEI\?\*/),
            ).toBeInTheDocument();
        });

        it("não deve exibir prefixos quando startingQuestionNumber não é fornecido", () => {
            renderComponent();

            expect(
                screen.queryByText(/^\d+\. Quais órgãos foram acionados/),
            ).not.toBeInTheDocument();
        });
    });
});
