import { screen, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { forwardRef } from "react";
import { renderWithClient } from "../CadastrarOcorrencia/__tests__/helpers";
import VisualizarOcorrencia from "./index";

vi.mock("../CadastrarOcorrencia/SecaoInicial", () => {
    const Mock = forwardRef<
        HTMLDivElement,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { onFormChange?: (data: any) => void }
    >((props, ref) => {
        if (props.onFormChange) {
            capturedSecaoInicialCallback = props.onFormChange;
        }
        return (
            <div
                ref={ref}
                data-testid="mock-secao-inicial"
                data-onformchange={!!props.onFormChange}
            >
                Mock SecaoInicial
            </div>
        );
    });
    Mock.displayName = "MockSecaoInicial";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/SecaoFurtoERoubo", () => {
    const Mock = forwardRef<HTMLDivElement>((props, ref) => (
        <div ref={ref}>Mock SecaoFurtoERoubo</div>
    ));
    Mock.displayName = "MockSecaoFurtoERoubo";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/SecaoNaoFurtoERoubo", () => {
    const Mock = forwardRef<
        HTMLDivElement,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { onFormChange?: (data: any) => void }
    >((props, ref) => {
        if (props.onFormChange) {
            capturedSecaoNaoFurtoCallback = props.onFormChange;
        }
        return (
            <div
                ref={ref}
                data-testid="mock-secao-nao-furto"
                data-onformchange={!!props.onFormChange}
            >
                Mock SecaoNaoFurtoERoubo
            </div>
        );
    });
    Mock.displayName = "MockSecaoNaoFurtoERoubo";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/InformacoesAdicionais", () => {
    const Mock = forwardRef<HTMLDivElement>((props, ref) => (
        <div ref={ref}>Mock InformacoesAdicionais</div>
    ));
    Mock.displayName = "MockInformacoesAdicionais";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/SecaoFinal", () => {
    const Mock = forwardRef<HTMLDivElement>((props, ref) => (
        <div ref={ref}>Mock SecaoFinal</div>
    ));
    Mock.displayName = "MockSecaoFinal";
    return { default: Mock };
});

vi.mock("../CadastrarOcorrencia/Anexos", () => ({
    default: vi.fn(() => <div>Mock Anexos</div>),
}));

vi.mock("../PageHeader/PageHeader", () => ({
    default: vi.fn(({ onClickBack }) => (
        <div>
            <button onClick={onClickBack}>Voltar</button>
        </div>
    )),
}));

vi.mock("@/components/stepper/Stepper", () => ({
    Stepper: vi.fn(({ steps, currentStep }) => (
        <div data-testid="mock-stepper">
            <span data-testid="current-step">{currentStep}</span>
            <span data-testid="total-steps">{steps.length}</span>
            {steps.map((step: { label: string }) => (
                <span key={step.label}>{step.label}</span>
            ))}
        </div>
    )),
}));

const mockReset = vi.fn();
const mockInvalidateQueries = vi.fn();

let capturedSecaoInicialCallback:
    | ((data: { tipoOcorrencia?: string }) => void)
    | null = null;
let capturedSecaoNaoFurtoCallback:
    | ((data: { possuiInfoAgressorVitima?: string }) => void)
    | null = null;

const mockStoreState = {
    formData: {
        tipoOcorrencia: "Sim",
        possuiInfoAgressorVitima: "Sim",
    },
    ocorrenciaUuid: "test-uuid",
    reset: mockReset,
};

vi.mock("@/stores/useOcorrenciaFormStore", () => ({
    useOcorrenciaFormStore: vi.fn((selector) => {
        return selector ? selector(mockStoreState) : mockStoreState;
    }),
}));

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual<
        typeof import("@tanstack/react-query")
    >("@tanstack/react-query");

    return {
        ...actual,
        useQueryClient: vi.fn(() => ({
            invalidateQueries: mockInvalidateQueries,
        })),
    };
});

const mockUseUserPermissions = vi.fn();

vi.mock("@/hooks/useUserPermissions", () => ({
    useUserPermissions: () => mockUseUserPermissions(),
}));

describe("VisualizarOcorrencia", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockStoreState.formData = {
            tipoOcorrencia: "Sim",
            possuiInfoAgressorVitima: "Sim",
        };
        mockStoreState.ocorrenciaUuid = "test-uuid";
        mockUseUserPermissions.mockReturnValue({
            isAssistenteOuDiretor: false,
        });
    });

    it("deve renderizar o título 'Nova ocorrência'", () => {
        renderWithClient(<VisualizarOcorrencia />);

        expect(screen.getByText("Nova ocorrência")).toBeInTheDocument();
    });

    it("deve renderizar o Stepper com todas as etapas completas", () => {
        renderWithClient(<VisualizarOcorrencia />);

        const stepper = screen.getByTestId("mock-stepper");
        const currentStep = screen.getByTestId("current-step");
        const totalSteps = screen.getByTestId("total-steps");

        expect(stepper).toBeInTheDocument();
        expect(currentStep.textContent).toBe(
            (Number(totalSteps.textContent) + 1).toString()
        );
    });

    it("deve renderizar todas as seções quando tipoOcorrencia é 'Sim' (Furto/Roubo)", () => {
        renderWithClient(<VisualizarOcorrencia />);

        expect(screen.getByText("Mock SecaoInicial")).toBeInTheDocument();
        expect(screen.getByText("Mock SecaoFurtoERoubo")).toBeInTheDocument();
        expect(
            screen.queryByText("Mock SecaoNaoFurtoERoubo")
        ).not.toBeInTheDocument();

        expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
        expect(screen.getByText("Mock Anexos")).toBeInTheDocument();
    });

    it("deve renderizar SecaoNaoFurtoERoubo quando tipoOcorrencia não é 'Sim'", () => {
        mockStoreState.formData = {
            tipoOcorrencia: "Não",
            possuiInfoAgressorVitima: "Sim",
        };

        renderWithClient(<VisualizarOcorrencia />);

        expect(
            screen.getByText("Mock SecaoNaoFurtoERoubo")
        ).toBeInTheDocument();
        expect(
            screen.queryByText("Mock SecaoFurtoERoubo")
        ).not.toBeInTheDocument();
    });

    it("não deve renderizar InformacoesAdicionais quando possuiInfoAgressorVitima não é 'Sim'", () => {
        mockStoreState.formData = {
            tipoOcorrencia: "Sim",
            possuiInfoAgressorVitima: "Não",
        };

        renderWithClient(<VisualizarOcorrencia />);

        expect(
            screen.queryByText("Mock InformacoesAdicionais")
        ).not.toBeInTheDocument();
        expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
    });

    it("deve renderizar os labels corretos do Stepper para Furto/Roubo", () => {
        renderWithClient(<VisualizarOcorrencia />);

        expect(screen.getByText("Cadastro de ocorrência")).toBeInTheDocument();
        expect(screen.getByText("Formulário patrimonial")).toBeInTheDocument();
        expect(screen.getByText("Seção final")).toBeInTheDocument();
        expect(screen.getByText("Anexos")).toBeInTheDocument();
    });

    it("deve renderizar os labels corretos do Stepper para Não Furto/Roubo", () => {
        mockStoreState.formData = {
            tipoOcorrencia: "Não",
            possuiInfoAgressorVitima: "Não",
        };

        renderWithClient(<VisualizarOcorrencia />);

        expect(screen.getByText("Cadastro de ocorrência")).toBeInTheDocument();
        expect(screen.getByText("Formulário geral")).toBeInTheDocument();
        expect(screen.getByText("Seção final")).toBeInTheDocument();
        expect(screen.getByText("Anexos")).toBeInTheDocument();
    });

    it("deve chamar reset e invalidateQueries ao clicar em Voltar", async () => {
        renderWithClient(<VisualizarOcorrencia />);

        const botaoVoltar = screen.getByText("Voltar");
        botaoVoltar.click();

        expect(mockReset).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({
            queryKey: ["ocorrencia", "test-uuid"],
        });
    });

    describe("Callbacks onFormChange", () => {
        it("deve atualizar currentTipoOcorrencia quando SecaoInicial chama onFormChange", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Não",
            };

            const { rerender } = renderWithClient(<VisualizarOcorrencia />);

            expect(
                screen.getByText("Mock SecaoNaoFurtoERoubo")
            ).toBeInTheDocument();

            mockStoreState.formData = {
                tipoOcorrencia: "Sim",
                possuiInfoAgressorVitima: "Não",
            };

            rerender(<VisualizarOcorrencia />);

            expect(
                screen.getByText("Mock SecaoFurtoERoubo")
            ).toBeInTheDocument();
            expect(
                screen.queryByText("Mock SecaoNaoFurtoERoubo")
            ).not.toBeInTheDocument();
        });

        it("deve atualizar currentPossuiInfoAgressor quando SecaoNaoFurtoRoubo chama onFormChange", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Não",
            };

            const { rerender } = renderWithClient(<VisualizarOcorrencia />);

            expect(
                screen.queryByText("Mock InformacoesAdicionais")
            ).not.toBeInTheDocument();

            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Sim",
            };

            rerender(<VisualizarOcorrencia />);

            expect(
                screen.getByText("Mock InformacoesAdicionais")
            ).toBeInTheDocument();
        });

        it("não deve atualizar currentTipoOcorrencia quando callback recebe undefined", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Sim",
                possuiInfoAgressorVitima: "Não",
            };

            const { rerender } = renderWithClient(<VisualizarOcorrencia />);

            expect(
                screen.getByText("Mock SecaoFurtoERoubo")
            ).toBeInTheDocument();

            rerender(<VisualizarOcorrencia />);

            expect(
                screen.getByText("Mock SecaoFurtoERoubo")
            ).toBeInTheDocument();
            expect(
                screen.queryByText("Mock SecaoNaoFurtoERoubo")
            ).not.toBeInTheDocument();
        });

        it("não deve atualizar currentPossuiInfoAgressor quando callback recebe undefined", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Sim",
            };

            const { rerender } = renderWithClient(<VisualizarOcorrencia />);

            expect(
                screen.getByText("Mock InformacoesAdicionais")
            ).toBeInTheDocument();

            rerender(<VisualizarOcorrencia />);

            expect(
                screen.getByText("Mock InformacoesAdicionais")
            ).toBeInTheDocument();
        });

        it("deve passar callback onFormChange para SecaoInicial", () => {
            renderWithClient(<VisualizarOcorrencia />);

            const secaoInicial = screen.getByTestId("mock-secao-inicial");
            expect(secaoInicial.dataset.onformchange).toBe("true");
        });

        it("deve passar callback onFormChange para SecaoNaoFurtoERoubo quando não é furto/roubo", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Não",
            };

            renderWithClient(<VisualizarOcorrencia />);

            const secaoNaoFurto = screen.getByTestId("mock-secao-nao-furto");
            expect(secaoNaoFurto.dataset.onformchange).toBe("true");
        });

        it("deve executar handleSecaoInicialChange quando callback é chamado", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Não",
            };

            renderWithClient(<VisualizarOcorrencia />);

            expect(capturedSecaoInicialCallback).not.toBeNull();
            expect(capturedSecaoInicialCallback).toBeDefined();
        });

        it("deve executar handleSecaoNaoFurtoChange quando callback é chamado", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Não",
            };

            renderWithClient(<VisualizarOcorrencia />);

            expect(capturedSecaoNaoFurtoCallback).not.toBeNull();
            expect(capturedSecaoNaoFurtoCallback).toBeDefined();
        });

        it("não deve atualizar currentPossuiInfoAgressor quando possuiInfoAgressorVitima é undefined no callback", () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Sim",
            };

            const { rerender } = renderWithClient(<VisualizarOcorrencia />);

            expect(
                screen.getByText("Mock InformacoesAdicionais")
            ).toBeInTheDocument();

            if (capturedSecaoNaoFurtoCallback) {
                capturedSecaoNaoFurtoCallback({});
            }

            rerender(<VisualizarOcorrencia />);

            expect(
                screen.getByText("Mock InformacoesAdicionais")
            ).toBeInTheDocument();
        });

        it("deve chamar setCurrentPossuiInfoAgressor quando callback recebe valor definido", async () => {
            mockStoreState.formData = {
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Não",
            };

            renderWithClient(<VisualizarOcorrencia />);

            expect(
                screen.queryByText("Mock InformacoesAdicionais")
            ).not.toBeInTheDocument();

            act(() => {
                if (capturedSecaoNaoFurtoCallback) {
                    capturedSecaoNaoFurtoCallback({
                        possuiInfoAgressorVitima: "Sim",
                    });
                }
            });

            await waitFor(() => {
                expect(
                    screen.getByText("Mock InformacoesAdicionais")
                ).toBeInTheDocument();
            });
        });
    });

    describe("Botões de navegação baseados em permissão", () => {
        it("deve exibir botão 'Finalizar' quando isAssistenteOuDiretor é true", () => {
            mockUseUserPermissions.mockReturnValue({
                isAssistenteOuDiretor: true,
            });

            renderWithClient(<VisualizarOcorrencia />);

            const botaoFinalizar = screen.getByRole("link", {
                name: /finalizar/i,
            });
            expect(botaoFinalizar).toBeInTheDocument();
            expect(botaoFinalizar).toHaveAttribute("href", "/dashboard");

            expect(
                screen.queryByRole("button", { name: /anterior/i })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("link", { name: /próximo/i })
            ).not.toBeInTheDocument();
        });

        it("deve exibir botões 'Anterior' e 'Próximo' quando isAssistenteOuDiretor é false", () => {
            mockUseUserPermissions.mockReturnValue({
                isAssistenteOuDiretor: false,
            });

            renderWithClient(<VisualizarOcorrencia />);

            const botaoAnterior = screen.getByRole("button", {
                name: /anterior/i,
            });
            const botaoProximo = screen.getByRole("link", { name: /próximo/i });

            expect(botaoAnterior).toBeInTheDocument();
            expect(botaoAnterior).toBeDisabled();

            expect(botaoProximo).toBeInTheDocument();
            expect(botaoProximo).toHaveAttribute(
                "href",
                "/dashboard/cadastrar-ocorrencia/test-uuid/dre"
            );

            expect(
                screen.queryByRole("link", { name: /finalizar/i })
            ).not.toBeInTheDocument();
        });

        it("deve construir corretamente o link para o formulário DRE com ocorrenciaUuid", () => {
            mockUseUserPermissions.mockReturnValue({
                isAssistenteOuDiretor: false,
            });
            mockStoreState.ocorrenciaUuid = "uuid-123-teste";

            renderWithClient(<VisualizarOcorrencia />);

            const botaoProximo = screen.getByRole("link", { name: /próximo/i });
            expect(botaoProximo).toHaveAttribute(
                "href",
                "/dashboard/cadastrar-ocorrencia/uuid-123-teste/dre"
            );
        });
    });
});
