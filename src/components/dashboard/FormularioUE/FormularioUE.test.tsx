import { toast } from "@/components/ui/headless-toast";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forwardRef, useImperativeHandle } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithClient } from "../CadastrarOcorrencia/__tests__/helpers";
import { FormularioUE } from "./FormularioUE";

const mockSecaoInicialTrigger = vi.fn();
const mockSecaoInicialGetData = vi.fn();
const mockSecaoFurtoTrigger = vi.fn();
const mockSecaoFurtoGetData = vi.fn();
const mockSecaoNaoFurtoTrigger = vi.fn();
const mockSecaoNaoFurtoGetData = vi.fn();
const mockInfoAdicionaisTrigger = vi.fn();
const mockInfoAdicionaisGetData = vi.fn();
const mockSecaoFinalTrigger = vi.fn();
const mockSecaoFinalGetData = vi.fn();

let capturedSecaoInicialCallback:
    | ((data: { tipoOcorrencia?: string }) => void)
    | null = null;
let capturedSecaoNaoFurtoCallback:
    | ((data: {
          possuiInfoAgressorVitima?: string;
          tiposOcorrencia?: string[];
      }) => void)
    | null = null;
let capturedSecaoFurtoCallback:
    | ((data: { tiposOcorrencia?: string[] }) => void)
    | null = null;

const mockRouterPush = vi.fn();
const mockReset = vi.fn();
const mockInvalidateQueries = vi.fn();
const mockMutate = vi.fn();

const hookStates = {
    isPending: false,
    isAssistenteOuDiretor: false,
};

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockRouterPush,
        back: vi.fn(),
    }),
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: vi.fn(),
}));

vi.mock("@/hooks/useAtualizarFormularioCompletoUE", () => ({
    useAtualizarFormularioCompletoUE: () => ({
        mutate: mockMutate,
        isPending: hookStates.isPending,
    }),
}));

vi.mock("@/hooks/useUserPermissions", () => ({
    useUserPermissions: () => ({
        isAssistenteOuDiretor: hookStates.isAssistenteOuDiretor,
    }),
}));

vi.mock("@/hooks/useTiposOcorrencia", () => ({
    useTiposOcorrencia: () => ({
        data: [
            { uuid: "Furto", nome: "Furto" },
            { uuid: "Agressão", nome: "Agressão" },
        ],
        isLoading: false,
    }),
}));

const mockToast = vi.mocked(toast);

vi.mock("../CadastrarOcorrencia/SecaoInicial", () => {
    const Mock = forwardRef<
        unknown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { onFormChange?: (data: any) => void }
    >((props, ref) => {
        if (props.onFormChange) {
            capturedSecaoInicialCallback = props.onFormChange;
        }

        useImperativeHandle(ref, () => ({
            getFormInstance: () => ({
                trigger: mockSecaoInicialTrigger,
            }),
            getFormData: mockSecaoInicialGetData,
        }));

        return (
            <div
                ref={ref as React.Ref<HTMLDivElement>}
                data-testid="mock-secao-inicial"
            >
                Mock SecaoInicial
            </div>
        );
    });
    Mock.displayName = "SecaoInicial";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/SecaoFurtoERoubo", () => {
    const Mock = forwardRef<
        unknown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { onFormChange?: (data: any) => void }
    >((props, ref) => {
        if (props.onFormChange) {
            capturedSecaoFurtoCallback = props.onFormChange;
        }

        useImperativeHandle(ref, () => ({
            getFormInstance: () => ({
                trigger: mockSecaoFurtoTrigger,
            }),
            getFormData: mockSecaoFurtoGetData,
        }));

        return (
            <div
                ref={ref as React.Ref<HTMLDivElement>}
                data-testid="mock-secao-furto"
            >
                Mock SecaoFurtoERoubo
            </div>
        );
    });
    Mock.displayName = "SecaoFurtoERoubo";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/SecaoNaoFurtoERoubo", () => {
    const Mock = forwardRef<
        unknown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { onFormChange?: (data: any) => void }
    >((props, ref) => {
        if (props.onFormChange) {
            capturedSecaoNaoFurtoCallback = props.onFormChange;
        }

        useImperativeHandle(ref, () => ({
            getFormInstance: () => ({
                trigger: mockSecaoNaoFurtoTrigger,
            }),
            getFormData: mockSecaoNaoFurtoGetData,
        }));

        return (
            <div
                ref={ref as React.Ref<HTMLDivElement>}
                data-testid="mock-secao-nao-furto"
            >
                Mock SecaoNaoFurtoERoubo
            </div>
        );
    });
    Mock.displayName = "SecaoNaoFurtoERoubo";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/SecaoFinal", () => {
    const Mock = forwardRef<unknown>((_, ref) => {
        useImperativeHandle(ref, () => ({
            getFormInstance: () => ({
                trigger: mockSecaoFinalTrigger,
            }),
            getFormData: mockSecaoFinalGetData,
        }));

        return (
            <div ref={ref as React.Ref<HTMLDivElement>}>Mock SecaoFinal</div>
        );
    });
    Mock.displayName = "SecaoFinal";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/InformacoesAdicionais", () => {
    const Mock = forwardRef<unknown>((_, ref) => {
        useImperativeHandle(ref, () => ({
            getFormInstance: () => ({
                trigger: mockInfoAdicionaisTrigger,
            }),
            getFormData: mockInfoAdicionaisGetData,
        }));

        return (
            <div ref={ref as React.Ref<HTMLDivElement>}>
                Mock InformacoesAdicionais
            </div>
        );
    });
    Mock.displayName = "InformacoesAdicionais";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/Anexos", () => ({
    default: () => <div>Mock Anexos</div>,
}));

vi.mock("@/components/stepper/Stepper", () => ({
    Stepper: ({
        steps,
        currentStep,
    }: {
        steps: { label: string }[];
        currentStep: number;
    }) => (
        <div data-testid="mock-stepper">
            <span data-testid="current-step">{currentStep}</span>
            <span data-testid="total-steps">{steps.length}</span>
            {steps.map((step) => (
                <span key={step.label}>{step.label}</span>
            ))}
        </div>
    ),
}));

vi.mock("../PageHeader/PageHeader", () => ({
    default: ({
        onClickBack,
        title,
    }: {
        onClickBack: () => void;
        title: string;
    }) => (
        <div>
            <h1>{title}</h1>
            <button onClick={onClickBack}>Voltar</button>
        </div>
    ),
}));

vi.mock("../QuadroBranco/QuadroBranco", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="quadro-branco">{children}</div>
    ),
}));

const mockSetFormData = vi.fn();
const mockSetSavedFormData = vi.fn();

const mockStoreState: {
    formData: Record<string, unknown>;
    setFormData: typeof mockSetFormData;
    setSavedFormData: typeof mockSetSavedFormData;
    ocorrenciaUuid: string | null;
    reset: typeof mockReset;
} = {
    formData: {},
    setFormData: mockSetFormData,
    setSavedFormData: mockSetSavedFormData,
    ocorrenciaUuid: "test-uuid",
    reset: mockReset,
};

vi.mock("@/stores/useOcorrenciaFormStore", () => ({
    useOcorrenciaFormStore: vi.fn((selector) => {
        if (typeof selector === "function") {
            return selector(mockStoreState);
        }
        return mockStoreState;
    }),
}));

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual<
        typeof import("@tanstack/react-query")
    >("@tanstack/react-query");
    return {
        ...actual,
        useQueryClient: () => ({
            invalidateQueries: mockInvalidateQueries,
        }),
    };
});

describe("FormularioUE", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockStoreState.formData = {};
        mockStoreState.ocorrenciaUuid = "test-uuid";
        mockRouterPush.mockClear();
        mockReset.mockClear();
        mockInvalidateQueries.mockClear();
        mockToast.mockClear();
        mockMutate.mockClear();
        mockSetFormData.mockClear();
        mockSetSavedFormData.mockClear();
        capturedSecaoInicialCallback = null;
        capturedSecaoNaoFurtoCallback = null;
        capturedSecaoFurtoCallback = null;

        hookStates.isPending = false;
        hookStates.isAssistenteOuDiretor = false;

        mockSecaoInicialTrigger.mockResolvedValue(true);
        mockSecaoFurtoTrigger.mockResolvedValue(true);
        mockSecaoNaoFurtoTrigger.mockResolvedValue(true);
        mockInfoAdicionaisTrigger.mockResolvedValue(true);
        mockSecaoFinalTrigger.mockResolvedValue(true);

        mockSecaoInicialGetData.mockReturnValue({
            dataOcorrencia: "2024-01-01",
            horaOcorrencia: "10:00",
            unidadeEducacional: "123456",
            dre: "DRE-01",
            tipoOcorrencia: "Sim",
        });

        mockSecaoFurtoGetData.mockReturnValue({
            tiposOcorrencia: ["Furto"],
            descricao: "Descrição do furto",
            smartSampa: "monitorada",
        });

        mockSecaoNaoFurtoGetData.mockReturnValue({
            tiposOcorrencia: ["Agressão"],
            descricao: "Descrição da agressão",
            envolvido: ["uuid-alunos"],
            possuiInfoAgressorVitima: "Sim",
        });

        mockInfoAdicionaisGetData.mockReturnValue({
            pessoasAgressoras: [{ nome: "João", idade: "15" }],
            motivoOcorrencia: "Bullying",
            genero: "Masculino",
            grupoEtnicoRacial: "Branco",
            etapaEscolar: "Fundamental II",
            frequenciaEscolar: "Regular",
            interacaoAmbienteEscolar: "Boa",
            notificadoConselhoTutelar: "Sim",
            acompanhadoNAAPA: ["naapa"],
        });

        mockSecaoFinalGetData.mockReturnValue({
            declarante: "Diretor",
            comunicacaoSeguranca: "Sim",
            protocoloAcionado: "Ameaça",
        });
    });

    describe("Renderização básica", () => {
        it("deve renderizar o título 'Intercorrências Institucionais'", () => {
            renderWithClient(<FormularioUE />);
            expect(
                screen.getByText("Intercorrências Institucionais"),
            ).toBeInTheDocument();
        });

        it("deve renderizar o título 'Nova ocorrência'", () => {
            renderWithClient(<FormularioUE />);
            expect(screen.getByText("Nova ocorrência")).toBeInTheDocument();
        });

        it("deve renderizar o Stepper", () => {
            renderWithClient(<FormularioUE />);
            expect(screen.getByTestId("mock-stepper")).toBeInTheDocument();
        });

        it("deve renderizar SecaoInicial", () => {
            renderWithClient(<FormularioUE />);
            expect(
                screen.getByTestId("mock-secao-inicial"),
            ).toBeInTheDocument();
        });

        it("deve renderizar SecaoFinal", () => {
            renderWithClient(<FormularioUE />);
            expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
        });

        it("deve renderizar Anexos", () => {
            renderWithClient(<FormularioUE />);
            expect(screen.getByText("Mock Anexos")).toBeInTheDocument();
        });
    });

    describe("Renderização condicional", () => {
        it("deve renderizar SecaoFurtoERoubo quando tipoOcorrencia é 'Sim'", () => {
            mockStoreState.formData = { tipoOcorrencia: "Sim" };
            renderWithClient(<FormularioUE />);

            expect(
                screen.getByText("Mock SecaoFurtoERoubo"),
            ).toBeInTheDocument();
            expect(
                screen.queryByTestId("mock-secao-nao-furto"),
            ).not.toBeInTheDocument();
        });

        it("deve renderizar SecaoNaoFurtoERoubo quando tipoOcorrencia não é 'Sim'", () => {
            mockStoreState.formData = { tipoOcorrencia: "Não" };
            renderWithClient(<FormularioUE />);

            expect(
                screen.getByTestId("mock-secao-nao-furto"),
            ).toBeInTheDocument();
            expect(
                screen.queryByText("Mock SecaoFurtoERoubo"),
            ).not.toBeInTheDocument();
        });

        it("deve renderizar InformacoesAdicionais quando possuiInfoAgressorVitima é 'Sim' e não é furto/roubo", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Sim",
            };
            renderWithClient(<FormularioUE />);

            expect(
                screen.getByText("Mock InformacoesAdicionais"),
            ).toBeInTheDocument();
        });

        it("não deve renderizar InformacoesAdicionais quando possuiInfoAgressorVitima não é 'Sim'", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Não",
            };
            renderWithClient(<FormularioUE />);

            expect(
                screen.queryByText("Mock InformacoesAdicionais"),
            ).not.toBeInTheDocument();
        });

        it("não deve renderizar InformacoesAdicionais quando é furto/roubo", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Sim",
                possuiInfoAgressorVitima: "Sim",
            };
            renderWithClient(<FormularioUE />);

            expect(
                screen.queryByText("Mock InformacoesAdicionais"),
            ).not.toBeInTheDocument();
        });
    });

    describe("Stepper - Labels e Steps", () => {
        it("deve exibir 'Formulário patrimonial' quando é furto/roubo", () => {
            mockStoreState.formData = { tipoOcorrencia: "Sim" };
            renderWithClient(<FormularioUE />);

            expect(
                screen.getByText("Formulário patrimonial"),
            ).toBeInTheDocument();
        });

        it("deve exibir 'Formulário geral' quando não é furto/roubo", () => {
            mockStoreState.formData = { tipoOcorrencia: "Não" };
            renderWithClient(<FormularioUE />);

            expect(screen.getByText("Formulário geral")).toBeInTheDocument();
        });

        it("deve calcular corretamente o número total de steps para Furto/Roubo", () => {
            mockStoreState.formData = { tipoOcorrencia: "Sim" };
            renderWithClient(<FormularioUE />);

            const currentStep = screen.getByTestId("current-step");
            expect(currentStep).toHaveTextContent("5");
        });

        it("deve calcular corretamente o número total de steps para Não Furto/Roubo sem info agressor", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Não",
            };
            renderWithClient(<FormularioUE />);

            const currentStep = screen.getByTestId("current-step");
            expect(currentStep).toHaveTextContent("5");
        });

        it("deve calcular corretamente o número total de steps para Não Furto/Roubo com info agressor", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Sim",
            };
            renderWithClient(<FormularioUE />);

            const currentStep = screen.getByTestId("current-step");
            expect(currentStep).toHaveTextContent("6");
        });

        it("deve exibir 'Informações adicionais' no step 3 quando há info agressor", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Sim",
            };
            renderWithClient(<FormularioUE />);

            expect(
                screen.getByText("Informações adicionais"),
            ).toBeInTheDocument();
        });

        it("deve exibir 'Seção final' no step 3 quando não há info agressor", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Não",
            };
            renderWithClient(<FormularioUE />);

            const labels = screen.getAllByText("Seção final");
            expect(labels.length).toBeGreaterThan(0);
        });
    });

    describe("Callbacks de mudança de formulário", () => {
        it("deve atualizar currentTipoOcorrencia quando handleSecaoInicialChange é chamado", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Não" };
            renderWithClient(<FormularioUE />);

            expect(
                screen.getByTestId("mock-secao-nao-furto"),
            ).toBeInTheDocument();

            await act(async () => {
                if (capturedSecaoInicialCallback) {
                    capturedSecaoInicialCallback({ tipoOcorrencia: "Sim" });
                }
            });

            await waitFor(() => {
                expect(
                    screen.getByText("Mock SecaoFurtoERoubo"),
                ).toBeInTheDocument();
            });
        });

        it("deve sincronizar tiposOcorrencia no store quando handleSecaoFurtoChange é chamado", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Sim" };
            renderWithClient(<FormularioUE />);

            await act(async () => {
                if (capturedSecaoFurtoCallback) {
                    capturedSecaoFurtoCallback({
                        tiposOcorrencia: ["Furto", "Roubo"],
                    });
                }
            });

            await waitFor(() => {
                expect(mockSetFormData).toHaveBeenCalledWith({
                    tiposOcorrencia: ["Furto", "Roubo"],
                });
            });
        });

        it("não deve sincronizar tiposOcorrencia quando valores são iguais aos anteriores", async () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Sim",
                tiposOcorrencia: ["Furto"],
            };
            renderWithClient(<FormularioUE />);
            mockSetFormData.mockClear();

            await act(async () => {
                if (capturedSecaoFurtoCallback) {
                    capturedSecaoFurtoCallback({
                        tiposOcorrencia: ["Furto"],
                    });
                }
            });

            await act(async () => {
                if (capturedSecaoFurtoCallback) {
                    capturedSecaoFurtoCallback({
                        tiposOcorrencia: ["Furto"],
                    });
                }
            });

            const tiposCalls = mockSetFormData.mock.calls.filter(
                (call: unknown[]) =>
                    call[0] &&
                    typeof call[0] === "object" &&
                    "tiposOcorrencia" in (call[0] as Record<string, unknown>),
            );
            expect(tiposCalls.length).toBeLessThanOrEqual(1);
        });

        it("deve atualizar currentPossuiInfoAgressor quando handleSecaoNaoFurtoChange é chamado", async () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Não",
            };
            renderWithClient(<FormularioUE />);

            expect(
                screen.queryByText("Mock InformacoesAdicionais"),
            ).not.toBeInTheDocument();

            await act(async () => {
                if (capturedSecaoNaoFurtoCallback) {
                    capturedSecaoNaoFurtoCallback({
                        possuiInfoAgressorVitima: "Sim",
                    });
                }
            });

            await waitFor(() => {
                expect(
                    screen.getByText("Mock InformacoesAdicionais"),
                ).toBeInTheDocument();
            });
        });

        it("deve sincronizar tiposOcorrencia no store quando handleSecaoNaoFurtoChange envia tiposOcorrencia", async () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Não",
            };
            renderWithClient(<FormularioUE />);
            mockSetFormData.mockClear();

            await act(async () => {
                if (capturedSecaoNaoFurtoCallback) {
                    capturedSecaoNaoFurtoCallback({
                        tiposOcorrencia: ["Agressão", "Ameaça"],
                    });
                }
            });

            await waitFor(() => {
                expect(mockSetFormData).toHaveBeenCalledWith({
                    tiposOcorrencia: ["Agressão", "Ameaça"],
                });
            });
        });
    });

    describe("handleClickBack", () => {
        it("deve chamar reset e invalidateQueries ao clicar em Voltar", async () => {
            renderWithClient(<FormularioUE />);

            const botaoVoltar = screen.getByText("Voltar");
            await userEvent.click(botaoVoltar);

            await waitFor(() => {
                expect(mockReset).toHaveBeenCalledTimes(1);
                expect(mockInvalidateQueries).toHaveBeenCalledWith({
                    queryKey: ["ocorrencia", "test-uuid"],
                });
            });
        });
    });

    describe("Validação de formulários", () => {
        it("deve validar com sucesso todos os formulários para furto/roubo", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Sim" };
            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockSecaoInicialTrigger).toHaveBeenCalled();
                expect(mockSecaoFurtoTrigger).toHaveBeenCalled();
                expect(mockSecaoFinalTrigger).toHaveBeenCalled();
            });
        });

        it("deve mostrar erro quando a validação da Seção Inicial falha", async () => {
            mockSecaoInicialTrigger.mockResolvedValue(false);
            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Erro ao validar Seção Inicial",
                    description:
                        "Verifique os campos da Seção Inicial e tente novamente.",
                    variant: "error",
                });
            });
        });

        it("deve mostrar erro quando a validação do Formulário Patrimonial falha", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Sim" };
            mockSecaoFurtoTrigger.mockResolvedValue(false);
            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Erro ao validar Formulário Patrimonial",
                    description: "Verifique os campos e tente novamente.",
                    variant: "error",
                });
            });
        });

        it("deve mostrar erro quando a validação do Formulário Geral falha", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Não" };
            mockSecaoNaoFurtoTrigger.mockResolvedValue(false);
            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Erro ao validar Formulário Geral",
                    description: "Verifique os campos e tente novamente.",
                    variant: "error",
                });
            });
        });

        it("deve mostrar erro quando a validação das Informações Adicionais falha", async () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Sim",
            };
            mockInfoAdicionaisTrigger.mockResolvedValue(false);
            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Erro ao validar Informações Adicionais",
                    description: "Verifique os campos e tente novamente.",
                    variant: "error",
                });
            });
        });

        it("deve mostrar erro quando a validação da Seção Final falha", async () => {
            mockSecaoFinalTrigger.mockResolvedValue(false);
            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Erro ao validar Seção Final",
                    description: "Verifique os campos e tente novamente.",
                    variant: "error",
                });
            });
        });
    });

    describe("handleSaveAll - Casos de erro", () => {
        it("deve mostrar erro quando ocorrenciaUuid é null", async () => {
            mockStoreState.ocorrenciaUuid = null;
            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Erro",
                    description: "UUID da ocorrência não encontrado.",
                    variant: "error",
                });
            });
        });

        it("deve lidar com erro ao validar", async () => {
            mockSecaoInicialTrigger.mockRejectedValue(
                new Error("Erro de validação"),
            );
            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Erro ao validar",
                    description:
                        "Ocorreu um erro ao validar os formulários. Tente novamente.",
                    variant: "error",
                });
            });
        });
    });

    describe("handleSaveAll - Sucesso", () => {
        it("deve chamar onNext quando fornecido e atualização é bem-sucedida", async () => {
            const mockOnNext = vi.fn();
            mockInvalidateQueries.mockResolvedValue(undefined);
            mockMutate.mockImplementation((data, callbacks) => {
                callbacks?.onSuccess?.({ success: true });
            });

            renderWithClient(<FormularioUE onNext={mockOnNext} />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(mockOnNext).toHaveBeenCalled();
            });
        });

        it("deve redirecionar para /dashboard quando onNext não é fornecido", async () => {
            mockInvalidateQueries.mockResolvedValue(undefined);
            mockMutate.mockImplementation((data, callbacks) => {
                callbacks?.onSuccess?.({ success: true });
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
            });
        });

        it("deve invalidar queries quando atualização é bem-sucedida", async () => {
            mockInvalidateQueries.mockResolvedValue(undefined);
            mockMutate.mockImplementation((data, callbacks) => {
                callbacks?.onSuccess?.({ success: true });
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockInvalidateQueries).toHaveBeenCalledWith({
                    queryKey: ["ocorrencia", "test-uuid"],
                });
            });
        });

        it("deve mostrar erro quando result.success é false", async () => {
            mockMutate.mockImplementation((data, callbacks) => {
                callbacks?.onSuccess?.({
                    success: false,
                    error: "Erro customizado",
                });
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Erro ao atualizar",
                    description: "Erro customizado",
                    variant: "error",
                });
            });
        });

        it("deve mostrar erro padrão quando result.success é false sem mensagem", async () => {
            mockMutate.mockImplementation((data, callbacks) => {
                callbacks?.onSuccess?.({ success: false });
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Erro ao atualizar",
                    description: "Ocorreu um erro ao atualizar o formulário.",
                    variant: "error",
                });
            });
        });

        it("deve lidar com erro ao chamar a API", async () => {
            const consoleErrorSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});
            mockMutate.mockImplementation((data, callbacks) => {
                callbacks?.onError?.(new Error("Erro de rede"));
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Erro ao atualizar",
                    description: "Ocorreu um erro ao atualizar o formulário.",
                    variant: "error",
                });
            });

            consoleErrorSpy.mockRestore();
        });

        it("deve incluir dados de SecaoFurtoERoubo no allFormData quando isFurtoRoubo é verdadeiro", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Sim" };
            mockInvalidateQueries.mockResolvedValue(undefined);
            mockMutate.mockImplementation((data, callbacks) => {
                callbacks?.onSuccess?.({ success: true });
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockSetFormData).toHaveBeenCalledWith(
                    expect.objectContaining({
                        tiposOcorrencia: ["Furto"],
                        descricao: "Descrição do furto",
                        smartSampa: "monitorada",
                    }),
                );
            });
        });

        it("deve incluir dados de InformacoesAdicionais no allFormData quando hasAgressorVitimaInfo é verdadeiro", async () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Sim",
            };
            mockInvalidateQueries.mockResolvedValue(undefined);
            mockMutate.mockImplementation((data, callbacks) => {
                callbacks?.onSuccess?.({ success: true });
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockSetFormData).toHaveBeenCalledWith(
                    expect.objectContaining({
                        pessoasAgressoras: [{ nome: "João", idade: "15" }],
                        motivoOcorrencia: "Bullying",
                    }),
                );
            });
        });
    });

    describe("buildRequestBody", () => {
        it("deve construir body corretamente para furto/roubo", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Sim" };
            mockMutate.mockImplementation((data) => {
                expect(data.body).toMatchObject({
                    data_ocorrencia: expect.any(String),
                    unidade_codigo_eol: "123456",
                    dre_codigo_eol: "DRE-01",
                    sobre_furto_roubo_invasao_depredacao: true,
                    tipos_ocorrencia: ["Furto"],
                    descricao_ocorrencia: "Descrição do furto",
                    smart_sampa_situacao: "monitorada",
                    envolvido: "",
                    tem_info_agressor_ou_vitima: "nao",
                    declarante: "Diretor",
                    comunicacao_seguranca_publica: "sim",
                });
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve construir body corretamente para não furto/roubo sem info agressor", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Não" };
            mockSecaoNaoFurtoGetData.mockReturnValue({
                tiposOcorrencia: ["Agressão"],
                descricao: "Descrição da agressão",
                envolvidos: ["Alunos"],
                possuiInfoAgressorVitima: "Não",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body).toMatchObject({
                    sobre_furto_roubo_invasao_depredacao: false,
                    smart_sampa_situacao: "nao",
                    envolvido: ["Alunos"],
                    tem_info_agressor_ou_vitima: "nao",
                });
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve construir body corretamente com informações adicionais", async () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Sim",
            };

            mockInfoAdicionaisGetData.mockReturnValue({
                pessoasAgressoras: [{ nome: "João", idade: "15" }],
                motivoOcorrencia: "Bullying",
                genero: "Masculino",
                grupoEtnicoRacial: "Branco",
                etapaEscolar: "Fundamental II",
                frequenciaEscolar: "Regular",
                interacaoAmbienteEscolar: "Boa",
                notificadoConselhoTutelar: "Sim",
                acompanhadoNAAPA: ["naapa"],
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body).toMatchObject({
                    tem_info_agressor_ou_vitima: "sim",
                    pessoas_agressoras: [
                        expect.objectContaining({ nome: "João", idade: 15 }),
                    ],
                    motivacao_ocorrencia: "Bullying",
                    notificado_conselho_tutelar: true,
                    ocorrencia_acompanhada_pelo: ["naapa"],
                });
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve mapear pessoasAgressoras corretamente convertendo idade para número", async () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Sim",
            };

            mockInfoAdicionaisGetData.mockReturnValue({
                pessoasAgressoras: [
                    {
                        nome: "João Silva",
                        idade: "25",
                        genero: "Masculino",
                        grupoEtnicoRacial: "Branco",
                        etapaEscolar: "Fundamental II",
                        frequenciaEscolar: "Regular",
                        interacaoAmbienteEscolar: "Boa",
                    },
                    {
                        nome: "Maria Santos",
                        idade: "30",
                        genero: "Feminino",
                        grupoEtnicoRacial: "Pardo",
                        etapaEscolar: "Ensino Médio",
                        frequenciaEscolar: "Regular",
                        interacaoAmbienteEscolar: "Boa",
                    },
                ],
                motivoOcorrencia: "Bullying",
                notificadoConselhoTutelar: "Sim",
                acompanhadoNAAPA: ["naapa"],
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.pessoas_agressoras).toEqual([
                    expect.objectContaining({
                        nome: "João Silva",
                        idade: 25,
                    }),
                    expect.objectContaining({
                        nome: "Maria Santos",
                        idade: 30,
                    }),
                ]);
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve mapear comunicacao_seguranca_publica corretamente", async () => {
            mockSecaoFinalGetData.mockReturnValue({
                declarante: "Diretor",
                comunicacaoSeguranca: "Sim",
                protocoloAcionado: "Alerta",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.comunicacao_seguranca_publica).toBe("sim");
                expect(data.body.protocolo_acionado).toBe("alerta");
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve mapear protocolo_acionado para 'registro' quando é 'Apenas para registro/não se aplica'", async () => {
            mockSecaoFinalGetData.mockReturnValue({
                declarante: "Diretor",
                comunicacaoSeguranca: "Não",
                protocoloAcionado: "Apenas para registro/não se aplica",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.protocolo_acionado).toBe("registro");
                expect(data.body.comunicacao_seguranca_publica).toBe("nao");
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar fallback 'nao' quando smartSampa é undefined em furto/roubo", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Sim" };
            mockSecaoFurtoGetData.mockReturnValue({
                tiposOcorrencia: ["Furto"],
                descricao: "Descrição do furto",
                smartSampa: undefined,
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.smart_sampa_situacao).toBe("nao");
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve definir smart_sampa_situacao como 'sim' quando smartSampa é 'Sim' em furto/roubo", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Sim" };
            mockSecaoFurtoGetData.mockReturnValue({
                tiposOcorrencia: ["Furto"],
                descricao: "Descrição do furto",
                smartSampa: "Sim",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.smart_sampa_situacao).toBe("sim");
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar fallback 'nao' quando comunicacaoSeguranca é uma string não mapeada", async () => {
            mockSecaoFinalGetData.mockReturnValue({
                declarante: "Diretor",
                comunicacaoSeguranca: "Valor inválido",
                protocoloAcionado: "Ameaça",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.comunicacao_seguranca_publica).toBe("nao");
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar fallback 'registro' quando protocoloAcionado é uma string não mapeada", async () => {
            mockSecaoFinalGetData.mockReturnValue({
                declarante: "Diretor",
                comunicacaoSeguranca: "Não",
                protocoloAcionado: "Valor inválido",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.protocolo_acionado).toBe("registro");
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar fallbacks quando dados da SecaoInicial são undefined", async () => {
            mockSecaoInicialGetData.mockReturnValue({
                dataOcorrencia: "2024-01-01",
                horaOcorrencia: "10:00",
                unidadeEducacional: undefined,
                dre: undefined,
                tipoOcorrencia: "Sim",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.unidade_codigo_eol).toBe("");
                expect(data.body.dre_codigo_eol).toBe("");
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar fallbacks quando tiposOcorrencia e descricao são undefined", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Sim" };
            mockSecaoFurtoGetData.mockReturnValue({
                tiposOcorrencia: undefined,
                descricao: undefined,
                smartSampa: "monitorada",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.tipos_ocorrencia).toEqual([]);
                expect(data.body.descricao_ocorrencia).toBe("");
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar fallback quando envolvidos é undefined em não furto/roubo", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Não" };
            mockSecaoNaoFurtoGetData.mockReturnValue({
                tiposOcorrencia: ["Agressão"],
                descricao: "Descrição",
                envolvidos: undefined,
                possuiInfoAgressorVitima: "Não",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.envolvidos).toEqual([]);
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar fallback quando declarante é undefined", async () => {
            mockSecaoFinalGetData.mockReturnValue({
                declarante: undefined,
                comunicacaoSeguranca: "Não",
                protocoloAcionado: "Ameaça",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.declarante).toBe("");
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar fallback quando comunicacaoSeguranca é undefined", async () => {
            mockSecaoFinalGetData.mockReturnValue({
                declarante: "Diretor",
                comunicacaoSeguranca: undefined,
                protocoloAcionado: "Ameaça",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.comunicacao_seguranca_publica).toBe("nao");
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar fallback quando protocoloAcionado é undefined", async () => {
            mockSecaoFinalGetData.mockReturnValue({
                declarante: "Diretor",
                comunicacaoSeguranca: "Não",
                protocoloAcionado: undefined,
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.protocolo_acionado).toBe("registro");
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar array vazio quando envolvidos é null em não furto/roubo", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Não" };
            mockSecaoNaoFurtoGetData.mockReturnValue({
                tiposOcorrencia: ["Agressão"],
                descricao: "Descrição",
                envolvidos: null,
                possuiInfoAgressorVitima: "Não",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.envolvidos).toEqual([]);
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar o valor de formData.envolvidos quando definido", async () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                envolvidos: ["uuid-estudantes"],
            };
            mockSecaoNaoFurtoGetData.mockReturnValue({
                tiposOcorrencia: ["Agressão"],
                descricao: "Descrição",
                envolvidos: ["uuid-alunos"],
                possuiInfoAgressorVitima: "Não",
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.envolvidos).toEqual(["uuid-estudantes"]);
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar fallback vazio quando envolvidos retorna undefined após passar na condição", async () => {
            mockStoreState.formData = { tipoOcorrencia: "Não" };

            // Cria um objeto com getter que retorna valor diferente em cada acesso
            let accessCount = 0;
            const mockData = {
                tiposOcorrencia: ["Agressão"],
                descricao: "Descrição",
                possuiInfoAgressorVitima: "Não",
                get envolvidos() {
                    accessCount++;
                    // Primeira chamada (condição do spread): retorna truthy
                    // Segunda chamada (dentro do spread): retorna undefined
                    return accessCount === 1 ? ["uuid-alunos"] : undefined;
                },
            };

            mockSecaoNaoFurtoGetData.mockReturnValue(mockData);

            mockMutate.mockImplementation((data) => {
                // O fallback ?? [] deve ser usado
                expect(data.body.envolvidos).toEqual([]);
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve usar '00:00' na data_ocorrencia quando foraHorarioFuncionamento é true", async () => {
            mockSecaoInicialGetData.mockReturnValue({
                dataOcorrencia: "2024-01-02",
                horaOcorrencia: "15:30",
                unidadeEducacional: "123456",
                dre: "DRE-01",
                tipoOcorrencia: "Sim",
                foraHorarioFuncionamento: true,
            });

            mockMutate.mockImplementation((data) => {
                expect(data.body.fora_horario_funcionamento_ue).toBe(true);
                expect(data.body.data_ocorrencia).toEqual(expect.any(String));
                expect(data.body.data_ocorrencia).not.toContain("15:30");
            });

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByText("Próximo");
            await userEvent.click(botaoProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });
    });

    describe("Botões baseados em permissões", () => {
        it("deve exibir botões 'Anterior' e 'Próximo' por padrão", () => {
            renderWithClient(<FormularioUE />);

            expect(screen.getByText("Anterior")).toBeInTheDocument();
            expect(screen.getByText("Próximo")).toBeInTheDocument();
            expect(screen.queryByText("Finalizar")).not.toBeInTheDocument();
        });

        it("deve exibir botão 'Anterior' desabilitado", () => {
            renderWithClient(<FormularioUE />);

            const botaoAnterior = screen.getByText("Anterior");
            expect(botaoAnterior).toBeDisabled();
        });

        it("deve exibir botão 'Finalizar' quando isAssistenteOuDiretor é true", () => {
            hookStates.isAssistenteOuDiretor = true;
            renderWithClient(<FormularioUE />);

            expect(screen.getByText("Finalizar")).toBeInTheDocument();
            expect(screen.queryByText("Anterior")).not.toBeInTheDocument();
            expect(screen.queryByText("Próximo")).not.toBeInTheDocument();
        });

        it("deve exibir 'Salvando...' no botão quando isPending é true para Assistente/Diretor", () => {
            hookStates.isAssistenteOuDiretor = true;
            hookStates.isPending = true;
            renderWithClient(<FormularioUE />);

            expect(screen.getByText("Salvando...")).toBeInTheDocument();
            expect(screen.queryByText("Finalizar")).not.toBeInTheDocument();
        });

        it("deve exibir 'Salvando...' no botão Próximo quando isPending é true", () => {
            hookStates.isPending = true;
            renderWithClient(<FormularioUE />);

            expect(screen.getByText("Salvando...")).toBeInTheDocument();
            expect(screen.queryByText("Próximo")).not.toBeInTheDocument();
        });

        it("deve desabilitar botão 'Próximo' quando isPending é true", () => {
            hookStates.isPending = true;
            renderWithClient(<FormularioUE />);

            const botaoSalvar = screen.getByText("Salvando...");
            expect(botaoSalvar).toBeDisabled();
        });
    });

    describe("Redirect para dashboard quando finalizada", () => {
        it("deve redirecionar para dashboard quando ocorrência está finalizada e usuário é assistente/diretor", async () => {
            const user = userEvent.setup();

            mockStoreState.formData = {
                status: "finalizada",
                tipoOcorrencia: "Sim",
                unidadeEducacional: "123456",
                dre: "654321",
            };

            hookStates.isAssistenteOuDiretor = true;

            mockSecaoInicialGetData.mockReturnValue({
                dataOcorrencia: "2024-01-01",
                horaOcorrencia: "10:00",
                unidadeEducacional: "123456",
                dre: "DRE-01",
                tipoOcorrencia: "Sim",
            });

            mockSecaoFurtoGetData.mockReturnValue({
                tiposOcorrencia: ["Furto"],
                descricao: "Descrição do furto",
                smartSampa: "monitorada",
            });

            mockSecaoFinalGetData.mockReturnValue({
                declarante: "Diretor",
                comunicacaoSeguranca: "Sim",
                protocoloAcionado: "Ameaça",
            });

            renderWithClient(<FormularioUE />);

            const botaoFinalizar = screen.getByRole("button", {
                name: /finalizar/i,
            });

            expect(botaoFinalizar).toBeInTheDocument();
            expect(botaoFinalizar).toHaveTextContent("Finalizar");

            await user.click(botaoFinalizar);

            expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
            expect(mockMutate).not.toHaveBeenCalled();
        });

        it("não deve redirecionar quando ocorrência não está finalizada", async () => {
            mockStoreState.formData = {
                status: "em_andamento",
                tipoOcorrencia: "Sim",
                unidadeEducacional: "123456",
                dre: "654321",
            };

            hookStates.isAssistenteOuDiretor = true;

            renderWithClient(<FormularioUE />);

            const botaoFinalizar = screen.getByRole("button", {
                name: /finalizar/i,
            });

            expect(botaoFinalizar).toHaveTextContent("Finalizar");
        });

        it("não deve redirecionar quando usuário não é assistente/diretor", async () => {
            mockStoreState.formData = {
                status: "finalizada",
                tipoOcorrencia: "Sim",
                unidadeEducacional: "123456",
                dre: "654321",
            };

            hookStates.isAssistenteOuDiretor = false;

            renderWithClient(<FormularioUE />);

            const botaoProximo = screen.getByRole("button", {
                name: /próximo/i,
            });

            expect(botaoProximo).toBeInTheDocument();
            expect(botaoProximo).toHaveTextContent("Próximo");
        });
    });
});
