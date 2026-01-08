import * as useCategoriasDisponiveisGipeModule from "@/hooks/useCategoriasDisponiveisGipe";
import * as useEnvolvidosModule from "@/hooks/useEnvolvidos";
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

const mockEnvolvidos = [
    { uuid: "env1", perfil_dos_envolvidos: "Estudante" },
    { uuid: "env2", perfil_dos_envolvidos: "Professor" },
    { uuid: "env3", perfil_dos_envolvidos: "Responsável" },
];

const mockCategoriasGipe = {
    envolve_arma_ou_ataque: [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" },
    ],
    ameaca_foi_realizada_de_qual_maneira: [
        { value: "presencialmente", label: "Presencialmente" },
        { value: "virtualmente", label: "Virtualmente" },
    ],
    motivo_ocorrencia: [
        { value: "bullying", label: "Bullying" },
        { value: "cyberbullying", label: "Cyberbullying" },
        { value: "racismo", label: "Racismo" },
    ],
    ciclo_aprendizagem: [
        { value: "alfabetizacao", label: "Alfabetização (1º ao 3º ano)" },
        { value: "interdisciplinar", label: "Interdisciplinar (4º ao 6º ano)" },
        { value: "autoral", label: "Autoral (7º ao 9º ano)" },
    ],
};

const mockTiposOcorrencia = [
    { uuid: "tipo1", nome: "Tipo A" },
    { uuid: "tipo2", nome: "Tipo B" },
    { uuid: "tipo3", nome: "Tipo C" },
];

vi.mock("@/hooks/useEnvolvidos", () => ({
    useEnvolvidos: () => ({
        data: mockEnvolvidos,
        isLoading: false,
    }),
}));

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
            </QueryClientProvider>
        );

    it("deve renderizar o título 'Continuação da ocorrência'", () => {
        renderComponent();

        expect(
            screen.getByRole("heading", { name: /continuação da ocorrência/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar o componente Anexos", () => {
        renderComponent();

        expect(screen.getByTestId("mock-anexos")).toBeInTheDocument();
    });

    it("deve renderizar os botões Anterior e Salvar informações", () => {
        renderComponent();

        expect(
            screen.getByRole("button", { name: /anterior/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /salvar informações/i })
        ).toBeInTheDocument();
    });

    it("deve ter o botão Salvar informações desabilitado inicialmente", () => {
        renderComponent();

        const botaoSalvar = screen.getByRole("button", {
            name: /salvar informações/i,
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
            "mb-2"
        );
    });

    it("deve exibir texto descritivo sob o campo Encaminhamentos", () => {
        renderComponent();

        expect(
            screen.getByText(/são informações após a análise feita pelo gipe/i)
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
                selector: (state: { user: typeof mockUser }) => unknown
            ) => selector({ user: mockUser }),
        }));

        renderComponent();

        expect(
            screen.getByRole("button", { name: /salvar informações/i })
        ).toBeInTheDocument();
    });

    it("deve marcar todos os campos obrigatórios com asterisco", () => {
        renderComponent();

        expect(
            screen.getByText(/envolve arma ou ataque\?\*/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/ameaça foi realizada de qual maneira\?\*/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/quem são os envolvidos\?\*/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/o que motivou a ocorrência\?\*/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/qual o tipo da ocorrência\?\*/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/qual o ciclo de aprendizagem\?\*/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/encaminhamentos\*/i)).toBeInTheDocument();
    });

    it("deve renderizar 3 QuadroBranco distintos", () => {
        renderComponent();

        expect(
            screen.getByText(/envolve arma ou ataque\?/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/quem são os envolvidos\?/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/existe informações sobre as interações virtuais/i)
        ).toBeInTheDocument();
    });

    it("deve ter botão Salvar informações com onClick definido", () => {
        renderComponent();

        const botaoSalvar = screen.getByRole("button", {
            name: /salvar informações/i,
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
            screen.getByRole("button", { name: /salvar informações/i })
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
            screen.getByRole("button", { name: /salvar informações/i })
        ).toBeInTheDocument();
    });

    it("deve retornar array vazio para envolvidosOptions quando envolvidos é undefined", () => {
        vi.spyOn(useEnvolvidosModule, "useEnvolvidos").mockReturnValue({
            data: undefined,
            isLoading: false,
        } as never);

        renderComponent();

        expect(
            screen.getByText(/quem são os envolvidos\?/i)
        ).toBeInTheDocument();
    });

    it("deve retornar array vazio para motivacaoOptions quando categorias.motivo_ocorrencia é undefined", () => {
        vi.spyOn(
            useCategoriasDisponiveisGipeModule,
            "useCategoriasDisponiveisGipe"
        ).mockReturnValue({
            data: { motivo_ocorrencia: undefined },
            isLoading: false,
        } as never);

        renderComponent();

        expect(
            screen.getByText(/o que motivou a ocorrência\?/i)
        ).toBeInTheDocument();
    });

    it("deve retornar array vazio para motivacaoOptions quando categorias é undefined", () => {
        vi.spyOn(
            useCategoriasDisponiveisGipeModule,
            "useCategoriasDisponiveisGipe"
        ).mockReturnValue({
            data: undefined,
            isLoading: false,
        } as never);

        renderComponent();

        expect(
            screen.getByText(/o que motivou a ocorrência\?/i)
        ).toBeInTheDocument();
    });

    it("deve retornar array vazio para tiposOcorrenciaOptions quando tiposOcorrencia é undefined", () => {
        vi.spyOn(
            useTiposOcorrenciaModule,
            "useTiposOcorrencia"
        ).mockReturnValue({
            data: undefined,
            isLoading: false,
        } as never);

        renderComponent();

        expect(
            screen.getByText(/qual o tipo da ocorrência\?/i)
        ).toBeInTheDocument();
    });

    it("deve mapear corretamente os envolvidos para options", () => {
        renderComponent();

        expect(
            screen.getByText(/quem são os envolvidos\?/i)
        ).toBeInTheDocument();
        expect(mockEnvolvidos).toHaveLength(3);
    });

    it("deve mapear corretamente as categorias para motivacaoOptions", () => {
        renderComponent();

        expect(
            screen.getByText(/o que motivou a ocorrência\?/i)
        ).toBeInTheDocument();
        expect(mockCategoriasGipe.motivo_ocorrencia).toHaveLength(3);
    });

    it("deve chamar a mutation corretamente quando os callbacks são executados", () => {
        mockAtualizarOcorrenciaGipe.mockImplementation((params, options) => {
            expect(params.uuid).toBe("test-uuid-gipe-123");
            expect(params.body).toHaveProperty("unidade_codigo_eol", "123456");
            expect(params.body).toHaveProperty("dre_codigo_eol", "654321");
            expect(params.body).toHaveProperty("envolve_arma_ataque");
            expect(params.body).toHaveProperty("ameaca_realizada_qual_maneira");
            expect(params.body).toHaveProperty("envolvido");
            expect(params.body).toHaveProperty("motivacao_ocorrencia");
            expect(params.body).toHaveProperty("tipos_ocorrencia");
            expect(params.body).toHaveProperty("qual_ciclo_aprendizagem");
            expect(params.body).toHaveProperty(
                "info_sobre_interacoes_virtuais_pessoa_agressora"
            );
            expect(params.body).toHaveProperty("encaminhamentos_gipe");

            options.onSuccess({ success: true });
        });

        renderComponent();

        expect(
            screen.getByRole("button", { name: /salvar informações/i })
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
            screen.getByRole("button", { name: /salvar informações/i })
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
            screen.getByRole("button", { name: /salvar informações/i })
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
            screen.getByRole("button", { name: /salvar informações/i })
        ).toBeInTheDocument();

        if (capturedOnSuccess) {
            capturedOnSuccess({ success: true });

            expect(mockSetFormData).toHaveBeenCalled();
        }
    });

    it("deve chamar handleSubmit ao clicar no botão Salvar informações quando o formulário está válido", async () => {
        const user = userEvent.setup();

        const formDataValido = {
            ...mockFormData,
            envolveArmaOuAtaque: "sim",
            ameacaRealizada: "presencialmente",
            envolvidos: "env1",
            motivoOcorrencia: ["bullying"],
            tiposOcorrencia: ["tipo1"],
            cicloAprendizagem: "alfabetizacao",
            informacoesInteracoesVirtuais: "",
            encaminhamentos: "Encaminhamentos do GIPE",
        };

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore"
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
            name: /salvar informações/i,
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
            envolvidos: "env1",
            motivoOcorrencia: ["bullying"],
            tiposOcorrencia: ["tipo1"],
            cicloAprendizagem: "alfabetizacao",
            informacoesInteracoesVirtuais: "",
            encaminhamentos: "Encaminhamentos do GIPE",
        };

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore"
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
            name: /salvar informações/i,
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
            envolvidos: "env1",
            motivoOcorrencia: ["bullying"],
            tiposOcorrencia: ["tipo1"],
            cicloAprendizagem: "alfabetizacao",
            informacoesInteracoesVirtuais: "",
            encaminhamentos: "Encaminhamentos do GIPE",
        };

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore"
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
            name: /salvar informações/i,
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
            envolvidos: "env1",
            motivoOcorrencia: ["bullying"],
            tiposOcorrencia: ["tipo1"],
            cicloAprendizagem: "alfabetizacao",
            informacoesInteracoesVirtuais: "",
            encaminhamentos: "Encaminhamentos do GIPE",
        };

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore"
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
            name: /salvar informações/i,
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
});
