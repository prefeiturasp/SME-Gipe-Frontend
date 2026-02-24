import { QueryClient } from "@tanstack/react-query";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { mockUseUserStore, renderWithClient } from "./__tests__/helpers";
import "./__tests__/setup";

vi.mock("./StepRenderer", () => ({
    default: vi.fn(
        ({
            currentStep,
            isFurtoRoubo,
            hasAgressorVitimaInfo,
            onNext,
            onPrevious,
        }) => {
            const getStepContent = () => {
                if (currentStep === 1) {
                    return (
                        <div>
                            <span>Mock SecaoInicial</span>
                            <button onClick={onNext}>Próximo</button>
                        </div>
                    );
                }
                if (currentStep === 2) {
                    if (isFurtoRoubo) {
                        return (
                            <div>
                                <span>Mock SecaoFurtoERoubo</span>
                                <button onClick={onNext}>Próximo</button>
                                <button onClick={onPrevious}>Anterior</button>
                            </div>
                        );
                    }
                    return (
                        <div>
                            <span>Mock SecaoNaoFurtoERoubo</span>
                            <button onClick={onNext}>Próximo</button>
                            <button onClick={onPrevious}>Anterior</button>
                        </div>
                    );
                }
                if (currentStep === 3) {
                    if (hasAgressorVitimaInfo) {
                        return (
                            <div>
                                <span>Mock InformacoesAdicionais</span>
                                <button onClick={onNext}>Próximo</button>
                                <button onClick={onPrevious}>Anterior</button>
                            </div>
                        );
                    }
                    return (
                        <div>
                            <span>Mock SecaoFinal</span>
                            <button onClick={onNext}>Próximo</button>
                            <button onClick={onPrevious}>Anterior</button>
                        </div>
                    );
                }
                if (currentStep === 4) {
                    if (hasAgressorVitimaInfo) {
                        return (
                            <div>
                                <span>Mock SecaoFinal</span>
                                <button onClick={onNext}>Próximo</button>
                                <button onClick={onPrevious}>Anterior</button>
                            </div>
                        );
                    }
                }
                return null;
            };

            return <div data-testid="step-renderer">{getStepContent()}</div>;
        },
    ),
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
            {steps.map((step: { label: string }) => (
                <span key={step.label}>{step.label}</span>
            ))}
        </div>
    )),
}));

const mockReset = vi.fn();
const mockInvalidateQueries = vi.fn();
const queryClient = new QueryClient();

const setupStoreMock = (
    formData: Record<string, unknown>,
    uuid: string | null = null,
) => {
    const mockSetFormData = vi.fn();
    const mockStore = {
        formData,
        ocorrenciaUuid: uuid,
        reset: mockReset,
        setFormData: mockSetFormData,
        setSavedFormData: vi.fn(),
        setOcorrenciaUuid: vi.fn(),
        savedFormData: {},
    };

    vi.doMock("@/stores/useOcorrenciaFormStore", () => ({
        useOcorrenciaFormStore: (
            selector?: (state: typeof mockStore) => unknown,
        ) => {
            if (typeof selector === "function") {
                return selector(mockStore);
            }
            return mockStore;
        },
    }));

    return mockStore;
};

vi.doMock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query");
    return {
        ...(actual as object),
        useQueryClient: () => ({
            ...queryClient,
            invalidateQueries: mockInvalidateQueries,
        }),
    };
});

vi.doMock("@/stores/useUserStore", mockUseUserStore);

describe("CadastrarOcorrencia - Orquestração e Integração", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockInvalidateQueries.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.resetModules();
    });

    describe("Renderização inicial e estrutura", () => {
        it("deve renderizar PageHeader, Stepper e StepRenderer", async () => {
            setupStoreMock({});

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            expect(
                screen.getByRole("button", { name: "Voltar" }),
            ).toBeInTheDocument();
            expect(screen.getByTestId("mock-stepper")).toBeInTheDocument();
            expect(screen.getByTestId("step-renderer")).toBeInTheDocument();
        });

        it("deve renderizar SecaoInicial no step 1 por padrão", async () => {
            setupStoreMock({});

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            expect(screen.getByText("Mock SecaoInicial")).toBeInTheDocument();
            expect(screen.getByTestId("current-step")).toHaveTextContent("1");
        });

        it("deve respeitar initialStep quando fornecido", async () => {
            setupStoreMock({ tipoOcorrencia: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={2} />);

            expect(
                screen.getByText("Mock SecaoFurtoERoubo"),
            ).toBeInTheDocument();
            expect(screen.getByTestId("current-step")).toHaveTextContent("2");
        });
    });

    describe("Navegação entre steps", () => {
        it("deve navegar do step 1 para step 2 (furto/roubo) ao clicar em Próximo", async () => {
            setupStoreMock({ tipoOcorrencia: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            expect(screen.getByText("Mock SecaoInicial")).toBeInTheDocument();

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

            await waitFor(() => {
                expect(
                    screen.getByText("Mock SecaoFurtoERoubo"),
                ).toBeInTheDocument();
            });
            expect(screen.getByTestId("current-step")).toHaveTextContent("2");
        });

        it("deve navegar do step 1 para step 2 (não furto/roubo) ao clicar em Próximo", async () => {
            setupStoreMock({ tipoOcorrencia: "Não" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

            await waitFor(() => {
                expect(
                    screen.getByText("Mock SecaoNaoFurtoERoubo"),
                ).toBeInTheDocument();
            });
            expect(screen.getByTestId("current-step")).toHaveTextContent("2");
        });

        it("deve voltar do step 2 (furto/roubo) para step 1 ao clicar em Anterior", async () => {
            setupStoreMock({ tipoOcorrencia: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={2} />);

            expect(
                screen.getByText("Mock SecaoFurtoERoubo"),
            ).toBeInTheDocument();

            fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

            await waitFor(() => {
                expect(
                    screen.getByText("Mock SecaoInicial"),
                ).toBeInTheDocument();
            });
            expect(screen.getByTestId("current-step")).toHaveTextContent("1");
        });

        it("deve voltar do step 2 (não furto/roubo) para step 1 ao clicar em Anterior", async () => {
            setupStoreMock({ tipoOcorrencia: "Não" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={2} />);

            expect(
                screen.getByText("Mock SecaoNaoFurtoERoubo"),
            ).toBeInTheDocument();

            fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

            await waitFor(() => {
                expect(
                    screen.getByText("Mock SecaoInicial"),
                ).toBeInTheDocument();
            });
            expect(screen.getByTestId("current-step")).toHaveTextContent("1");
        });

        it("deve navegar do step 2 para step 3 (SecaoFinal sem InformacoesAdicionais)", async () => {
            setupStoreMock({
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Não",
            });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={2} />);

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

            await waitFor(() => {
                expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
            });
            expect(screen.getByTestId("current-step")).toHaveTextContent("3");
        });

        it("deve navegar do step 2 para step 3 (InformacoesAdicionais)", async () => {
            setupStoreMock({
                tipoOcorrencia: "Sim",
                possuiInfoAgressorVitima: "Sim",
            });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={2} />);

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

            await waitFor(() => {
                expect(
                    screen.getByText("Mock InformacoesAdicionais"),
                ).toBeInTheDocument();
            });
            expect(screen.getByTestId("current-step")).toHaveTextContent("3");
        });

        it("deve voltar do step 3 (InformacoesAdicionais) para step 2", async () => {
            setupStoreMock({
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Sim",
            });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={3} />);

            expect(
                screen.getByText("Mock InformacoesAdicionais"),
            ).toBeInTheDocument();

            fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

            await waitFor(() => {
                expect(
                    screen.getByText("Mock SecaoNaoFurtoERoubo"),
                ).toBeInTheDocument();
            });
            expect(screen.getByTestId("current-step")).toHaveTextContent("2");
        });

        it("deve navegar do step 3 (InformacoesAdicionais) para step 4 (SecaoFinal)", async () => {
            setupStoreMock({ possuiInfoAgressorVitima: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={3} />);

            expect(
                screen.getByText("Mock InformacoesAdicionais"),
            ).toBeInTheDocument();

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

            await waitFor(() => {
                expect(screen.getByTestId("current-step")).toHaveTextContent(
                    "4",
                );
            });
        });

        it("deve voltar do step 3 (SecaoFinal sem InformacoesAdicionais) para step 2", async () => {
            setupStoreMock({
                tipoOcorrencia: "Sim",
                possuiInfoAgressorVitima: "Não",
            });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={3} />);

            expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();

            fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

            await waitFor(() => {
                expect(
                    screen.getByText("Mock SecaoFurtoERoubo"),
                ).toBeInTheDocument();
            });
            expect(screen.getByTestId("current-step")).toHaveTextContent("2");
        });

        it("deve avançar do step 3 (SecaoFinal) para step 4", async () => {
            setupStoreMock({ possuiInfoAgressorVitima: "Não" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={3} />);

            expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();

            fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

            await waitFor(() => {
                expect(screen.getByTestId("current-step")).toHaveTextContent(
                    "4",
                );
            });
        });
    });

    describe("Integração com store e PageHeader", () => {
        it("deve chamar reset e invalidateQueries ao clicar em Voltar", async () => {
            const testUuid = "uuid-123";
            setupStoreMock({}, testUuid);

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            const voltarButton = screen.getByRole("button", { name: "Voltar" });
            fireEvent.click(voltarButton);

            await waitFor(() => {
                expect(mockReset).toHaveBeenCalledTimes(1);
                expect(mockInvalidateQueries).toHaveBeenCalledWith({
                    queryKey: ["ocorrencia", testUuid],
                });
            });
        });

        it("deve passar isFurtoRoubo correto para StepRenderer baseado em formData", async () => {
            setupStoreMock({ tipoOcorrencia: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={2} />);

            expect(
                screen.getByText("Mock SecaoFurtoERoubo"),
            ).toBeInTheDocument();
        });

        it("deve passar hasAgressorVitimaInfo correto para StepRenderer baseado em formData", async () => {
            setupStoreMock({ possuiInfoAgressorVitima: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={3} />);

            expect(
                screen.getByText("Mock InformacoesAdicionais"),
            ).toBeInTheDocument();
        });
    });

    describe("Labels dinâmicos do Stepper", () => {
        it("deve exibir 'Fase 02' quando tipoOcorrencia não está definido", async () => {
            setupStoreMock({});

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            expect(screen.getByText("Fase 02")).toBeInTheDocument();
        });

        it("deve exibir 'Formulário patrimonial' quando tipoOcorrencia é 'Sim'", async () => {
            setupStoreMock({ tipoOcorrencia: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            expect(
                screen.getByText("Formulário patrimonial"),
            ).toBeInTheDocument();
        });

        it("deve exibir 'Formulário geral' quando tipoOcorrencia é 'Não'", async () => {
            setupStoreMock({ tipoOcorrencia: "Não" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            expect(screen.getByText("Formulário geral")).toBeInTheDocument();
        });

        it("deve exibir 'Fase 03' quando possuiInfoAgressorVitima não está definido e currentStep < 3", async () => {
            setupStoreMock({});

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            expect(screen.getByText("Fase 03")).toBeInTheDocument();
        });

        it("deve exibir 'Informações adicionais' quando possuiInfoAgressorVitima é 'Sim'", async () => {
            setupStoreMock({ possuiInfoAgressorVitima: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={3} />);

            expect(
                screen.getByText("Informações adicionais"),
            ).toBeInTheDocument();
        });

        it("deve exibir 'Seção final' quando possuiInfoAgressorVitima é 'Não'", async () => {
            setupStoreMock({ possuiInfoAgressorVitima: "Não" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={3} />);

            expect(screen.getByText("Seção final")).toBeInTheDocument();
        });

        it("deve exibir todos os labels do stepper corretamente", async () => {
            setupStoreMock({
                tipoOcorrencia: "Sim",
                possuiInfoAgressorVitima: "Sim",
            });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            expect(
                screen.getByText("Cadastro de ocorrência"),
            ).toBeInTheDocument();
            expect(
                screen.getByText("Formulário patrimonial"),
            ).toBeInTheDocument();
            expect(screen.getByText("Seção final")).toBeInTheDocument();
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });
    });

    describe("Callbacks onFormChange", () => {
        it("deve atualizar currentTipoOcorrencia quando SecaoInicial chama onSecaoInicialChange", async () => {
            setupStoreMock({});

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;

            const mockStepRenderer = vi.mocked(
                (await import("./StepRenderer")).default,
            );

            renderWithClient(<CadastrarOcorrencia />);

            const lastCall = mockStepRenderer.mock.calls.at(-1);
            const props = lastCall?.[0];

            act(() => {
                props?.onSecaoInicialChange?.({ tipoOcorrencia: "Sim" });
            });

            await waitFor(() => {
                const updatedCall = mockStepRenderer.mock.calls.at(-1);
                expect(updatedCall?.[0].isFurtoRoubo).toBe(true);
            });
        });

        it("deve atualizar currentPossuiInfoAgressor quando SecaoNaoFurtoRoubo chama onSecaoNaoFurtoChange", async () => {
            setupStoreMock({ tipoOcorrencia: "Não" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;

            const mockStepRenderer = vi.mocked(
                (await import("./StepRenderer")).default,
            );

            renderWithClient(<CadastrarOcorrencia initialStep={2} />);

            const lastCall = mockStepRenderer.mock.calls.at(-1);
            const props = lastCall?.[0];

            act(() => {
                props?.onSecaoNaoFurtoChange?.({
                    possuiInfoAgressorVitima: "Sim",
                });
            });

            await waitFor(() => {
                const updatedCall = mockStepRenderer.mock.calls.at(-1);
                expect(updatedCall?.[0].hasAgressorVitimaInfo).toBe(true);
            });
        });

        it("não deve atualizar currentTipoOcorrencia quando data.tipoOcorrencia é undefined", async () => {
            setupStoreMock({ tipoOcorrencia: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;

            const mockStepRenderer = vi.mocked(
                (await import("./StepRenderer")).default,
            );

            renderWithClient(<CadastrarOcorrencia />);

            const initialIsFurtoRoubo =
                mockStepRenderer.mock.calls.at(-1)?.[0].isFurtoRoubo;

            const lastCall = mockStepRenderer.mock.calls.at(-1);
            const props = lastCall?.[0];

            props?.onSecaoInicialChange?.({ tipoOcorrencia: undefined });

            await waitFor(() => {
                const updatedCall = mockStepRenderer.mock.calls.at(-1);
                expect(updatedCall?.[0].isFurtoRoubo).toBe(initialIsFurtoRoubo);
            });
        });

        it("não deve atualizar currentPossuiInfoAgressor quando data.possuiInfoAgressorVitima é undefined", async () => {
            setupStoreMock({
                tipoOcorrencia: "Não",
                possuiInfoAgressorVitima: "Sim",
            });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;

            const mockStepRenderer = vi.mocked(
                (await import("./StepRenderer")).default,
            );

            renderWithClient(<CadastrarOcorrencia initialStep={2} />);

            const initialHasAgressorVitimaInfo =
                mockStepRenderer.mock.calls.at(-1)?.[0].hasAgressorVitimaInfo;

            const lastCall = mockStepRenderer.mock.calls.at(-1);
            const props = lastCall?.[0];

            props?.onSecaoNaoFurtoChange?.({
                possuiInfoAgressorVitima: undefined,
            });

            await waitFor(() => {
                const updatedCall = mockStepRenderer.mock.calls.at(-1);
                expect(updatedCall?.[0].hasAgressorVitimaInfo).toBe(
                    initialHasAgressorVitimaInfo,
                );
            });
        });

        it("deve limpar campos do Step 2 no store ao trocar tipoOcorrencia", async () => {
            const mockStore = setupStoreMock({ tipoOcorrencia: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;

            const mockStepRenderer = vi.mocked(
                (await import("./StepRenderer")).default,
            );

            renderWithClient(<CadastrarOcorrencia />);

            const lastCall = mockStepRenderer.mock.calls.at(-1);
            const props = lastCall?.[0];

            act(() => {
                props?.onSecaoInicialChange?.({ tipoOcorrencia: "Não" });
            });

            await waitFor(() => {
                expect(mockStore.setFormData).toHaveBeenCalledWith({
                    tiposOcorrencia: [],
                    descricao: "",
                    smartSampa: undefined,
                    envolvidos: "",
                    possuiInfoAgressorVitima: undefined,
                });
            });
        });

        it("não deve limpar campos do Step 2 quando tipoOcorrencia não muda de valor", async () => {
            const mockStore = setupStoreMock({ tipoOcorrencia: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;

            const mockStepRenderer = vi.mocked(
                (await import("./StepRenderer")).default,
            );

            renderWithClient(<CadastrarOcorrencia />);

            const lastCall = mockStepRenderer.mock.calls.at(-1);
            const props = lastCall?.[0];

            act(() => {
                props?.onSecaoInicialChange?.({ tipoOcorrencia: "Sim" });
            });

            await waitFor(() => {
                expect(mockStore.setFormData).not.toHaveBeenCalled();
            });
        });
    });
});
