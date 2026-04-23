import * as useCategoriasDisponiveisGipeModule from "@/hooks/useCategoriasDisponiveisGipe";
import * as useTiposOcorrenciaModule from "@/hooks/useTiposOcorrencia";
import * as useOcorrenciaFormStoreModule from "@/stores/useOcorrenciaFormStore";
import * as useUserStoreModule from "@/stores/useUserStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DetalhamentoGipe } from "./index";

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

const mockAtualizarOcorrenciaGipe = vi.fn();
vi.mock("@/hooks/useAtualizarOcorrenciaGipe", () => ({
    useAtualizarOcorrenciaGipe: () => ({
        mutate: mockAtualizarOcorrenciaGipe,
    }),
}));

const mockSetFormData = vi.fn();
const mockFormData = {
    unidadeEducacional: "123456",
    dre: "654321",
};

vi.mock("@/stores/useOcorrenciaFormStore", () => ({
    useOcorrenciaFormStore: () => ({
        formData: mockFormData,
        setFormData: mockSetFormData,
        ocorrenciaUuid: "test-uuid-gipe-123",
    }),
}));

const mockUser = {
    perfil_acesso: {
        nome: "GIPE",
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

const mockCategoriasGipe = {
    envolve_arma_ou_ataque: [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" },
    ],
    ameaca_foi_realizada_de_qual_maneira: [
        { value: "presencialmente", label: "Presencialmente" },
        { value: "virtualmente", label: "Virtualmente" },
    ],
};

const mockTiposOcorrencia = [
    { uuid: "tipo1", nome: "Tipo A" },
    { uuid: "tipo2", nome: "Tipo B" },
    { uuid: "tipo3", nome: "Tipo C" },
];

vi.mock("@/hooks/useCategoriasDisponiveisGipe", () => ({
    useCategoriasDisponiveisGipe: () => ({
        data: mockCategoriasGipe,
        isLoading: false,
    }),
}));

vi.mock("@/hooks/useTiposOcorrencia", () => ({
    useTiposOcorrencia: () => ({
        data: mockTiposOcorrencia,
        isLoading: false,
    }),
}));

describe("DetalhamentoGipe", () => {
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
                <DetalhamentoGipe onPrevious={onPrevious} />
            </QueryClientProvider>,
        );

    it("deve renderizar o título 'Continuação da ocorrência'", () => {
        renderComponent();

        expect(
            screen.getByRole("heading", { name: /continuação da ocorrência/i }),
        ).toBeInTheDocument();
    });

    it("deve renderizar o componente Anexos", () => {
        renderComponent();

        expect(screen.getByTestId("mock-anexos")).toBeInTheDocument();
    });

    it("deve renderizar os botões Anterior e Finalizar", () => {
        renderComponent();

        expect(
            screen.getByRole("button", { name: /anterior/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Finalizar/i }),
        ).toBeInTheDocument();
    });

    it("deve ter o botão Finalizar desabilitado inicialmente", () => {
        renderComponent();

        const botaoSalvar = screen.getByRole("button", {
            name: /Finalizar/i,
        });
        expect(botaoSalvar).toBeDisabled();
    });

    it("deve chamar onPrevious ao clicar no botão Anterior", async () => {
        const user = userEvent.setup();
        const mockOnPrevious = vi.fn();

        renderComponent(mockOnPrevious);

        const botaoAnterior = screen.getByRole("button", { name: /anterior/i });
        await user.click(botaoAnterior);

        expect(mockOnPrevious).toHaveBeenCalledTimes(1);
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

    it("deve exibir texto descritivo sob o campo Encaminhamentos", () => {
        renderComponent();

        expect(
            screen.getByText(/são informações após a análise feita pelo gipe/i),
        ).toBeInTheDocument();
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

    it("deve permitir preencher campos de radio", async () => {
        const user = userEvent.setup();
        renderComponent();

        const radios = screen.getAllByRole("radio");

        await user.click(radios[0]);
        expect(radios[0]).toHaveAttribute("aria-checked", "true");

        await user.click(radios[2]);
        expect(radios[2]).toHaveAttribute("aria-checked", "true");
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
            screen.getByRole("button", { name: /Finalizar/i }),
        ).toBeInTheDocument();
    });

    it("deve marcar todos os campos obrigatórios com asterisco", () => {
        renderComponent();

        expect(
            screen.getByText(/envolve arma ou ataque\?\*/i),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/ameaça foi realizada de qual maneira\?\*/i),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/qual o tipo da ocorrência\?\*/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/encaminhamentos\*/i)).toBeInTheDocument();
    });

    it("deve renderizar 2 QuadroBrancos distintos", () => {
        renderComponent();

        expect(
            screen.getByText(/envolve arma ou ataque\?/i),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/qual o tipo da ocorrência\?/i),
        ).toBeInTheDocument();
    });

    it("deve ter botão Finalizar com onClick definido", () => {
        renderComponent();

        const botaoSalvar = screen.getByRole("button", {
            name: /Finalizar/i,
        });

        expect(botaoSalvar).toBeInTheDocument();
        expect(botaoSalvar).toHaveAttribute("type", "submit");
    });

    it("deve usar 'diretor' como perfil padrão quando user é null", () => {
        vi.spyOn(useUserStoreModule, "useUserStore").mockReturnValue({
            user: null,
        } as never);

        renderComponent();

        expect(
            screen.getByRole("button", { name: /Finalizar/i }),
        ).toBeInTheDocument();
    });

    it("deve usar perfil 'gipe' quando user.perfil_acesso.nome é GIPE", () => {
        const mockGipeUser = {
            perfil_acesso: { nome: "GIPE" },
        };

        vi.spyOn(useUserStoreModule, "useUserStore").mockReturnValue({
            user: mockGipeUser,
        } as never);

        renderComponent();

        expect(
            screen.getByRole("button", { name: /Finalizar/i }),
        ).toBeInTheDocument();
    });

    it("deve retornar array vazio para tiposOcorrenciaOptions quando tiposOcorrencia é undefined", () => {
        vi.spyOn(
            useTiposOcorrenciaModule,
            "useTiposOcorrencia",
        ).mockReturnValue({
            data: undefined,
            isLoading: false,
        } as never);

        renderComponent();

        expect(
            screen.getByText(/qual o tipo da ocorrência\?/i),
        ).toBeInTheDocument();
    });

    it("deve chamar a mutation corretamente quando os callbacks são executados", () => {
        mockAtualizarOcorrenciaGipe.mockImplementation((params, options) => {
            expect(params.uuid).toBe("test-uuid-gipe-123");
            expect(params.body).toHaveProperty("unidade_codigo_eol", "123456");
            expect(params.body).toHaveProperty("dre_codigo_eol", "654321");
            expect(params.body).toHaveProperty("envolve_arma_ataque");
            expect(params.body).toHaveProperty("ameaca_realizada_qual_maneira");
            expect(params.body).toHaveProperty("tipos_ocorrencia");
            expect(params.body).toHaveProperty("encaminhamentos_gipe");

            options.onSuccess({ success: true });
        });

        renderComponent();

        expect(
            screen.getByRole("button", { name: /Finalizar/i }),
        ).toBeInTheDocument();
    });

    it("deve exibir toast de erro quando a API retorna sucesso falso", () => {
        let capturedOnSuccess:
            | ((response: { success: boolean; error?: string }) => void)
            | undefined;

        mockAtualizarOcorrenciaGipe.mockImplementation((params, options) => {
            capturedOnSuccess = options.onSuccess;
        });

        renderComponent();

        expect(
            screen.getByRole("button", { name: /Finalizar/i }),
        ).toBeInTheDocument();

        if (capturedOnSuccess) {
            capturedOnSuccess({
                success: false,
                error: "Erro ao processar dados GIPE",
            });

            expect(mockToast).toHaveBeenCalledWith({
                title: "Erro ao atualizar ocorrência GIPE",
                description: "Erro ao processar dados GIPE",
                variant: "error",
            });
        }
    });

    it("deve exibir toast de erro quando a mutation falha", () => {
        let capturedOnError: (() => void) | undefined;

        mockAtualizarOcorrenciaGipe.mockImplementation((params, options) => {
            capturedOnError = options.onError;
        });

        renderComponent();

        expect(
            screen.getByRole("button", { name: /Finalizar/i }),
        ).toBeInTheDocument();

        if (capturedOnError) {
            capturedOnError();

            expect(mockToast).toHaveBeenCalledWith({
                title: "Erro ao atualizar ocorrência GIPE",
                description:
                    "Não foi possível atualizar os dados. Tente novamente.",
                variant: "error",
            });
        }
    });

    it("deve chamar setFormData quando há sucesso na mutation", () => {
        let capturedOnSuccess:
            | ((response: { success: boolean }) => void)
            | undefined;

        mockAtualizarOcorrenciaGipe.mockImplementation((params, options) => {
            capturedOnSuccess = options.onSuccess;
        });

        renderComponent();

        expect(
            screen.getByRole("button", { name: /Finalizar/i }),
        ).toBeInTheDocument();

        if (capturedOnSuccess) {
            capturedOnSuccess({ success: true });

            expect(mockSetFormData).toHaveBeenCalled();
        }
    });

    it("deve chamar handleSubmit ao clicar no botão Finalizar quando o formulário está válido", async () => {
        const user = userEvent.setup();

        const formDataValido = {
            ...mockFormData,
            envolveArmaOuAtaque: "sim",
            ameacaRealizada: "presencialmente",
            tiposOcorrencia: ["tipo1"],
            encaminhamentos: "Encaminhamentos do GIPE",
        };

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore",
        ).mockReturnValue({
            formData: formDataValido,
            setFormData: mockSetFormData,
            ocorrenciaUuid: "test-uuid-gipe-123",
        } as never);

        mockAtualizarOcorrenciaGipe.mockImplementation((params, options) => {
            options.onSuccess({ success: true });
        });

        renderComponent();

        const botaoSalvar = screen.getByRole("button", {
            name: /Finalizar/i,
        });

        await waitFor(() => {
            expect(botaoSalvar).not.toBeDisabled();
        });

        await user.click(botaoSalvar);

        await waitFor(() => {
            expect(mockAtualizarOcorrenciaGipe).toHaveBeenCalled();
        });

        expect(mockSetFormData).toHaveBeenCalled();
    });

    it("deve exibir toast de erro quando response.success é false", async () => {
        const user = userEvent.setup();

        const formDataValido = {
            ...mockFormData,
            envolveArmaOuAtaque: "sim",
            ameacaRealizada: "presencialmente",
            tiposOcorrencia: ["tipo1"],
            encaminhamentos: "Encaminhamentos do GIPE",
        };

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore",
        ).mockReturnValue({
            formData: formDataValido,
            setFormData: mockSetFormData,
            ocorrenciaUuid: "test-uuid-gipe-123",
        } as never);

        mockAtualizarOcorrenciaGipe.mockImplementation((params, options) => {
            options.onSuccess({ success: false, error: "Erro ao processar" });
        });

        renderComponent();

        const botaoSalvar = screen.getByRole("button", {
            name: /Finalizar/i,
        });

        await waitFor(() => {
            expect(botaoSalvar).not.toBeDisabled();
        });

        await user.click(botaoSalvar);

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: "Erro ao atualizar ocorrência GIPE",
                description: "Erro ao processar",
                variant: "error",
            });
        });
    });

    it("deve exibir toast de erro quando a mutation falha (onError)", async () => {
        const user = userEvent.setup();

        const formDataValido = {
            ...mockFormData,
            envolveArmaOuAtaque: "sim",
            ameacaRealizada: "presencialmente",
            tiposOcorrencia: ["tipo1"],
            encaminhamentos: "Encaminhamentos do GIPE",
        };

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore",
        ).mockReturnValue({
            formData: formDataValido,
            setFormData: mockSetFormData,
            ocorrenciaUuid: "test-uuid-gipe-123",
        } as never);

        mockAtualizarOcorrenciaGipe.mockImplementation((params, options) => {
            options.onError();
        });

        renderComponent();

        const botaoSalvar = screen.getByRole("button", {
            name: /Finalizar/i,
        });

        await waitFor(() => {
            expect(botaoSalvar).not.toBeDisabled();
        });

        await user.click(botaoSalvar);

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: "Erro ao atualizar ocorrência GIPE",
                description:
                    "Não foi possível atualizar os dados. Tente novamente.",
                variant: "error",
            });
        });
    });

    it("deve redirecionar para dashboard quando ocorrência está finalizada", async () => {
        const user = userEvent.setup();

        const formDataFinalizado = {
            ...mockFormData,
            status: "finalizada",
            envolveArmaOuAtaque: "sim",
            ameacaRealizada: "presencialmente",
            tiposOcorrencia: ["tipo1"],
            encaminhamentos: "Encaminhamentos do GIPE",
        };

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore",
        ).mockReturnValue({
            formData: formDataFinalizado,
            setFormData: mockSetFormData,
            ocorrenciaUuid: "test-uuid-gipe-123",
        } as never);

        mockAtualizarOcorrenciaGipe.mockImplementation((params, options) => {
            options.onSuccess({ success: true });
        });

        renderComponent();

        const botaoSalvar = screen.getByRole("button", {
            name: /Finalizar/i,
        });

        await waitFor(() => {
            expect(botaoSalvar).not.toBeDisabled();
        });

        await user.click(botaoSalvar);

        await waitFor(() => {
            expect(mockAtualizarOcorrenciaGipe).toHaveBeenCalled();
        });

        expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");

        expect(mockSetFormData).toHaveBeenCalled();
    });

    it("deve exibir 'Finalizar e enviar' quando status é enviado_para_gipe", () => {
        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore",
        ).mockReturnValue({
            formData: { ...mockFormData, status: "enviado_para_gipe" },
            setFormData: mockSetFormData,
            ocorrenciaUuid: "test-uuid-gipe-123",
        } as never);

        renderComponent();

        expect(
            screen.getByRole("button", { name: /finalizar e enviar/i }),
        ).toBeInTheDocument();
    });

    it("deve exibir 'Finalizar' quando status não é enviado_para_gipe", () => {
        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore",
        ).mockReturnValue({
            formData: { ...mockFormData, status: "rascunho" },
            setFormData: mockSetFormData,
            ocorrenciaUuid: "test-uuid-gipe-123",
        } as never);

        renderComponent();

        const botao = screen.getByRole("button", { name: /finalizar/i });
        expect(botao).toBeInTheDocument();
        expect(botao).not.toHaveTextContent("Finalizar e enviar");
    });

    it("deve exibir 'Finalizar' quando status é undefined", () => {
        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore",
        ).mockReturnValue({
            formData: { ...mockFormData },
            setFormData: mockSetFormData,
            ocorrenciaUuid: "test-uuid-gipe-123",
        } as never);

        renderComponent();

        const botao = screen.getByRole("button", { name: /finalizar/i });
        expect(botao).toBeInTheDocument();
        expect(botao).not.toHaveTextContent("Finalizar e enviar");
    });

    it("deve usar tipoFormulario 'PATRIMONIAL' quando tipoOcorrencia é 'Sim'", () => {
        const spyTiposOcorrencia = vi
            .spyOn(useTiposOcorrenciaModule, "useTiposOcorrencia")
            .mockReturnValue({
                data: mockTiposOcorrencia,
                isLoading: false,
            } as never);

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore",
        ).mockReturnValue({
            formData: { ...mockFormData, tipoOcorrencia: "Sim" },
            setFormData: mockSetFormData,
            ocorrenciaUuid: "test-uuid-gipe-123",
        } as never);

        renderComponent();

        expect(spyTiposOcorrencia).toHaveBeenCalledWith("PATRIMONIAL");
    });

    it("deve limpar tiposOcorrencia no formulário quando tipoFormulario muda", () => {
        const localSetFormData = vi.fn();
        const storeSpy = vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore",
        );

        storeSpy.mockReturnValue({
            formData: {
                ...mockFormData,
                tipoOcorrencia: "Sim",
                tiposOcorrencia: ["tipo1"],
            },
            setFormData: localSetFormData,
            ocorrenciaUuid: "test-uuid-gipe-123",
        } as never);

        const { rerender } = render(
            <QueryClientProvider client={queryClient}>
                <DetalhamentoGipe />
            </QueryClientProvider>,
        );

        storeSpy.mockReturnValue({
            formData: {
                ...mockFormData,
                tipoOcorrencia: "Não",
                tiposOcorrencia: ["tipo1"],
            },
            setFormData: localSetFormData,
            ocorrenciaUuid: "test-uuid-gipe-123",
        } as never);

        rerender(
            <QueryClientProvider client={queryClient}>
                <DetalhamentoGipe />
            </QueryClientProvider>,
        );

        const tiposOcorrenciaCheckboxes = screen.queryAllByRole("option");
        const hasChecked = tiposOcorrenciaCheckboxes.some(
            (el) => el.getAttribute("aria-selected") === "true",
        );
        expect(hasChecked).toBe(false);
        expect(localSetFormData).toHaveBeenCalledWith({ tiposOcorrencia: [] });
    });

    it("deve remover UUIDs inválidos de tiposOcorrencia ao montar o componente", async () => {
        const user = userEvent.setup();
        const mockOnPrevious = vi.fn();

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore",
        ).mockReturnValue({
            formData: {
                ...mockFormData,
                tipoOcorrencia: "Não",
                tiposOcorrencia: ["tipo1", "uuid-invalido-de-outro-tipo"],
            },
            setFormData: mockSetFormData,
            ocorrenciaUuid: "test-uuid-gipe-123",
        } as never);

        vi.spyOn(
            useTiposOcorrenciaModule,
            "useTiposOcorrencia",
        ).mockReturnValue({
            data: mockTiposOcorrencia,
            isLoading: false,
        } as never);

        renderComponent(mockOnPrevious);

        const anteriorBtn = screen.getByRole("button", { name: /anterior/i });
        await user.click(anteriorBtn);

        expect(mockSetFormData).toHaveBeenCalledWith(
            expect.objectContaining({
                tiposOcorrencia: ["tipo1"],
            }),
        );
    });

    describe("Alert de ajuda e modal de tipos de ocorrência", () => {
        it("deve renderizar o alert de ajuda abaixo do campo de tipos de ocorrência", () => {
            renderComponent();
            expect(
                screen.getByText(
                    /Precisa de ajuda para entender os tipos de ocorrência\?/i,
                ),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /clique aqui/i }),
            ).toBeInTheDocument();
        });

        it("deve abrir o modal ao clicar em 'Clique aqui'", async () => {
            renderComponent();
            await userEvent.click(
                screen.getByRole("button", { name: /clique aqui/i }),
            );
            expect(screen.getByText("Tipos de ocorrência")).toBeInTheDocument();
        });

        it("deve fechar o modal ao clicar no botão Fechar", async () => {
            renderComponent();
            await userEvent.click(
                screen.getByRole("button", { name: /clique aqui/i }),
            );
            expect(screen.getByText("Tipos de ocorrência")).toBeInTheDocument();
            await userEvent.click(
                screen.getByRole("button", { name: /^fechar$/i }),
            );
            await waitFor(() => {
                expect(
                    screen.queryByText("Tipos de ocorrência"),
                ).not.toBeInTheDocument();
            });
        });
    });

    it("deve usar array vazio para envolveArmaOuAtaqueOptions quando categoriasGipe é undefined", () => {
        vi.spyOn(
            useCategoriasDisponiveisGipeModule,
            "useCategoriasDisponiveisGipe",
        ).mockReturnValue({
            data: undefined,
            isLoading: false,
        } as never);

        renderComponent();

        expect(
            screen.getByText(/envolve arma ou ataque\?\*/i),
        ).toBeInTheDocument();
        expect(screen.queryAllByRole("radio")).toHaveLength(0);
    });

    it("deve usar array vazio para ameacaRealizadaOptions quando categoriasGipe é undefined", () => {
        vi.spyOn(
            useCategoriasDisponiveisGipeModule,
            "useCategoriasDisponiveisGipe",
        ).mockReturnValue({
            data: undefined,
            isLoading: false,
        } as never);

        renderComponent();

        expect(
            screen.getByText(/ameaça foi realizada de qual maneira\?\*/i),
        ).toBeInTheDocument();
        expect(screen.queryAllByRole("radio")).toHaveLength(0);
    });

    describe("numeração de perguntas", () => {
        it("deve exibir prefixo '16.' no campo arma/ataque quando startingQuestionNumber=16", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <DetalhamentoGipe startingQuestionNumber={16} />
                </QueryClientProvider>,
            );

            expect(
                screen.getByText(/^16\. Envolve arma ou ataque\?\*/),
            ).toBeInTheDocument();
        });

        it("deve exibir prefixo '17.' no campo ameaça quando startingQuestionNumber=16", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <DetalhamentoGipe startingQuestionNumber={16} />
                </QueryClientProvider>,
            );

            expect(
                screen.getByText(
                    /^17\. Ameaça foi realizada de qual maneira\?\*/,
                ),
            ).toBeInTheDocument();
        });

        it("deve exibir prefixo '18.' no campo tipo da ocorrência quando startingQuestionNumber=16", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <DetalhamentoGipe startingQuestionNumber={16} />
                </QueryClientProvider>,
            );

            expect(
                screen.getByText(/^18\. Qual o tipo da ocorrência\?\*/),
            ).toBeInTheDocument();
        });

        it("deve exibir prefixo '19.' no campo encaminhamentos quando startingQuestionNumber=16", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <DetalhamentoGipe startingQuestionNumber={16} />
                </QueryClientProvider>,
            );

            expect(
                screen.getByText(/^19\. Encaminhamentos\*/),
            ).toBeInTheDocument();
        });

        it("não deve exibir prefixos quando startingQuestionNumber não é fornecido", () => {
            renderComponent();

            expect(
                screen.queryByText(/^\d+\. Envolve arma ou ataque/),
            ).not.toBeInTheDocument();
        });
    });
});
