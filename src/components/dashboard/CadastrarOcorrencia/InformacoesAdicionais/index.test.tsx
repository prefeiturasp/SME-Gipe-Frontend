import { toast } from "@/components/ui/headless-toast";
import * as useAtualizarInfoAgressorHook from "@/hooks/useAtualizarInfoAgressor";
import { useCategoriasDisponiveis } from "@/hooks/useCategoriasDisponiveis";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import InformacoesAdicionais, { InformacoesAdicionaisRef } from "./index";

vi.mock("@/stores/useOcorrenciaFormStore");
vi.mock("@/hooks/useCategoriasDisponiveis");
vi.mock("@/hooks/useAtualizarInfoAgressor");
vi.mock("@/components/ui/headless-toast");

describe("InformacoesAdicionais", () => {
    const mockOnPrevious = vi.fn();
    const mockOnNext = vi.fn();
    const mockSetFormData = vi.fn();
    const mockSetSavedFormData = vi.fn();
    const mockMutate = vi.fn();

    const queryClient = new QueryClient();

    const renderComponent = () =>
        render(
            <QueryClientProvider client={queryClient}>
                <InformacoesAdicionais
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />
            </QueryClientProvider>,
        );

    const preencherFormularioCompleto = async (
        user: ReturnType<typeof userEvent.setup>,
        options?: {
            motivoLabel?: RegExp;
            descricaoMotivo?: string;
        },
    ) => {
        const motivoLabel = options?.motivoLabel ?? /Bullying/i;

        const nomesInputs = screen.getAllByLabelText(
            /Qual o nome da pessoa\?/i,
        );
        await user.type(nomesInputs[0], "João Silva");
        const idadesInputs = screen.getAllByLabelText(/Qual a idade\?/i);
        await user.type(idadesInputs[0], "25");

        const generoTrigger = screen.getByRole("combobox", {
            name: /Qual o gênero\?/i,
        });
        await user.click(generoTrigger);
        await user.click(
            await screen.findByRole("option", { name: /Masculino/i }),
        );

        const grupoTrigger = screen.getByRole("combobox", {
            name: /Raça\/cor auto declarada/i,
        });
        await user.click(grupoTrigger);
        await user.click(await screen.findByRole("option", { name: /Pardo/i }));

        const etapaTrigger = screen.getByRole("combobox", {
            name: /Qual a etapa escolar\?/i,
        });
        await user.click(etapaTrigger);
        await user.click(
            await screen.findByRole("option", {
                name: /Ensino Fundamental II/i,
            }),
        );

        const frequenciaTrigger = screen.getByRole("combobox", {
            name: /Qual a frequência escolar\?/i,
        });
        await user.click(frequenciaTrigger);
        const regularOptions = await screen.findAllByRole("option", {
            name: /Regular/i,
        });
        await user.click(regularOptions.at(-1)!);

        await user.type(
            screen.getByLabelText(/Como é a interação da pessoa no ambiente/i),
            "Boa interação",
        );
        await user.type(
            screen.getByPlaceholderText(/Digite a nacionalidade/i),
            "Brasileira",
        );

        const deficienciaTrigger = screen.getByRole("combobox", {
            name: /Pessoa com deficiência\?/i,
        });
        await user.click(deficienciaTrigger);
        await user.click(await screen.findByRole("option", { name: /^Sim$/i }));

        const radioSim = screen.getAllByRole("radio", { name: /^Sim$/i });
        await user.click(radioSim[0]);

        const checkboxNAAPA = screen.getByRole("checkbox", { name: /NAAPA/i });
        await user.click(checkboxNAAPA);

        const motivoButton = screen.getByRole("button", { name: /Selecione/i });
        await user.click(motivoButton);
        await user.click(await screen.findByText(motivoLabel));

        if (options?.descricaoMotivo) {
            await user.type(
                screen.getByPlaceholderText(/Descreva aqui/i),
                options.descricaoMotivo,
            );
        }

        await waitFor(
            () => {
                expect(
                    screen.getByRole("button", { name: /Próximo/i }),
                ).not.toBeDisabled();
            },
            { timeout: 5000 },
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useOcorrenciaFormStore).mockReturnValue({
            formData: {},
            savedFormData: {},
            setFormData: mockSetFormData,
            setSavedFormData: mockSetSavedFormData,
            ocorrenciaUuid: null,
        });
        vi.mocked(useCategoriasDisponiveis).mockReturnValue({
            data: {
                motivo_ocorrencia: [
                    { label: "Bullying", value: "bullying" },
                    { label: "Outros", value: "outros" },
                ],
                genero: [{ label: "Masculino", value: "masculino" }],
                grupo_etnico_racial: [{ label: "Pardo", value: "pardo" }],
                etapa_escolar: [
                    {
                        label: "Ensino Fundamental II",
                        value: "ensino_fundamental_2",
                    },
                ],
                frequencia_escolar: [{ label: "Regular", value: "regular" }],
            },
            isLoading: false,
            isError: false,
            error: null,
            isFetching: false,
            refetch: vi.fn(),
            isSuccess: true,
        } as unknown as ReturnType<typeof useCategoriasDisponiveis>);
        vi.spyOn(
            useAtualizarInfoAgressorHook,
            "useAtualizarInfoAgressor",
        ).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
            isError: false,
            isSuccess: false,
            error: null,
        } as never);
    });

    it("deve renderizar o formulário com campos principais", () => {
        renderComponent();

        expect(
            screen.getAllByLabelText(/Qual o nome da pessoa\?/i).length,
        ).toBeGreaterThanOrEqual(1);
        expect(
            screen.getByText(/O que motivou a ocorrência/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/notificada ao CT/i)).toBeInTheDocument();
        expect(screen.getByText(/acompanhada por:/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Anterior/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Próximo/i }),
        ).toBeInTheDocument();
    });

    it("deve chamar onPrevious ao clicar no botão Anterior", async () => {
        const user = userEvent.setup();
        renderComponent();

        const anteriorButton = screen.getByRole("button", {
            name: /Anterior/i,
        });
        await user.click(anteriorButton);

        expect(mockOnPrevious).toHaveBeenCalledTimes(1);
        expect(mockSetFormData).toHaveBeenCalled();
    });

    it("deve preencher os campos com dados do store", () => {
        vi.mocked(useOcorrenciaFormStore).mockReturnValue({
            formData: {
                pessoasAgressoras: [
                    {
                        nome: "João Silva",
                        idade: "25",
                        genero: "masculino",
                        grupoEtnicoRacial: "pardo",
                        etapaEscolar: "ensino_fundamental_2",
                        frequenciaEscolar: "regular",
                        interacaoAmbienteEscolar: "Boa interação",
                    },
                ],
                motivoOcorrencia: ["outros"],
                notificadoConselhoTutelar: "Sim",
                acompanhadoNAAPA: ["naapa"],
            },
            setFormData: mockSetFormData,
        });

        renderComponent();

        const nomesInputs = screen.getAllByLabelText(
            /Qual o nome da pessoa\?/i,
        );
        expect(nomesInputs[0]).toHaveValue("João Silva");
        const idadesInputs = screen.getAllByLabelText(/Qual a idade\?/i);
        expect(idadesInputs[0]).toHaveValue(25);
    });

    it("deve validar campos obrigatórios", async () => {
        const user = userEvent.setup();
        renderComponent();

        const proximoButton = screen.getByRole("button", { name: /Próximo/i });
        expect(proximoButton).toBeDisabled();

        const nomesInputs = screen.getAllByLabelText(
            /Qual o nome da pessoa\?/i,
        );
        await user.type(nomesInputs[0], "João Silva");

        expect(proximoButton).toBeDisabled();
    });

    it("deve selecionar opções de radio buttons", async () => {
        const user = userEvent.setup();
        renderComponent();

        const radioNao = screen.getAllByRole("radio", { name: /Não/i })[0];
        await user.click(radioNao);

        expect(radioNao).toBeChecked();

        const checkboxNAAPA = screen.getByRole("checkbox", { name: /NAAPA/i });
        await user.click(checkboxNAAPA);
        expect(checkboxNAAPA).toBeChecked();
    });

    it("deve alterar o placeholder da idade ao ativar o switch de criança menor de 1 ano", async () => {
        const user = userEvent.setup();
        renderComponent();

        const idadeInput = screen.getAllByLabelText(/Qual a idade\?/i)[0];
        expect(idadeInput).toHaveAttribute(
            "placeholder",
            "Digite quantos anos...",
        );

        const switchIdade = screen.getByRole("switch");
        await user.click(switchIdade);

        expect(idadeInput).toHaveAttribute(
            "placeholder",
            "Digite quantos meses...",
        );
    });

    it("deve aceitar idade 0 meses quando switch de criança menor de 1 ano está ativo", async () => {
        const user = userEvent.setup();
        renderComponent();

        const switchIdade = screen.getByRole("switch");
        await user.click(switchIdade);

        const idadeInput = screen.getAllByLabelText(/Qual a idade\?/i)[0];
        await user.clear(idadeInput);
        await user.type(idadeInput, "0");

        expect(
            screen.queryByText(/A idade em meses deve ser entre 0 e 12/i),
        ).not.toBeInTheDocument();
    });

    it("deve exibir erro ao digitar idade maior que 12 meses quando switch está ativo", async () => {
        const user = userEvent.setup();
        renderComponent();

        const switchIdade = screen.getByRole("switch");
        await user.click(switchIdade);

        const idadeInput = screen.getAllByLabelText(/Qual a idade\?/i)[0];
        await user.clear(idadeInput);
        await user.type(idadeInput, "13");
        await user.tab();

        expect(
            await screen.findByText(/A idade em meses deve ser entre 0 e 12/i),
        ).toBeInTheDocument();
    });

    it("deve renderizar o checkbox Vara da infância", () => {
        renderComponent();

        expect(
            screen.getByRole("checkbox", { name: /Vara da infância/i }),
        ).toBeInTheDocument();
    });

    it("deve marcar e desmarcar o checkbox Vara da infância", async () => {
        const user = userEvent.setup();
        renderComponent();

        const checkbox = screen.getByRole("checkbox", {
            name: /Vara da infância/i,
        });
        await user.click(checkbox);
        expect(checkbox).toBeChecked();

        await user.click(checkbox);
        expect(checkbox).not.toBeChecked();
    });

    describe("Campo SEI", () => {
        it("deve renderizar a pergunta 'Foi aberto um processo SEI?'", () => {
            renderComponent();

            expect(
                screen.getByText(/Foi aberto um processo SEI\?/i),
            ).toBeInTheDocument();
        });

        it("não deve exibir campo de texto SEI por padrão", () => {
            renderComponent();

            expect(
                screen.queryByLabelText(/Número do processo SEI/i),
            ).not.toBeInTheDocument();
        });

        it("deve exibir campo de texto SEI ao selecionar 'Sim'", async () => {
            const user = userEvent.setup();
            renderComponent();

            const radios = screen.getAllByRole("radio", { name: /^Sim$/i });
            await user.click(radios[radios.length - 1]);

            expect(
                await screen.findByLabelText(/Número do processo SEI/i),
            ).toBeInTheDocument();
        });

        it("deve ocultar campo de texto SEI ao selecionar 'Não'", async () => {
            const user = userEvent.setup();
            renderComponent();

            const radiosSim = screen.getAllByRole("radio", {
                name: /^Sim$/i,
            });
            await user.click(radiosSim[radiosSim.length - 1]);

            expect(
                await screen.findByLabelText(/Número do processo SEI/i),
            ).toBeInTheDocument();

            const radiosNao = screen.getAllByRole("radio", {
                name: /^Não$/i,
            });
            await user.click(radiosNao[radiosNao.length - 1]);

            expect(
                screen.queryByLabelText(/Número do processo SEI/i),
            ).not.toBeInTheDocument();
        });

        it("deve carregar valor SEI 'Sim' do store e exibir campo de texto", () => {
            vi.mocked(useOcorrenciaFormStore).mockReturnValue({
                formData: {
                    numeroProcedimentoSEI: "Sim",
                    numeroProcedimentoSEITexto: "1234.5678/9012345-6",
                },
                savedFormData: {},
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: null,
            });

            renderComponent();

            expect(
                screen.getByLabelText(/Número do processo SEI/i),
            ).toBeInTheDocument();
        });

        it("deve incluir nr_processo_sei no body ao submeter com SEI 'Sim' preenchido", async () => {
            const user = userEvent.setup();

            vi.mocked(useOcorrenciaFormStore).mockReturnValue({
                formData: {
                    unidadeEducacional: "123456",
                    dre: "DRE-001",
                },
                savedFormData: {},
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
            });

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            renderComponent();
            await preencherFormularioCompleto(user);

            const radiosSim = screen.getAllByRole("radio", {
                name: /^Sim$/i,
            });
            await user.click(radiosSim[radiosSim.length - 1]);

            const inputSEI =
                await screen.findByPlaceholderText(/Exemplo: 1234/i);
            await user.type(inputSEI, "1234567890123456");

            const proximoButton = screen.getByRole("button", {
                name: /Próximo/i,
            });
            await user.click(proximoButton);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        body: expect.objectContaining({
                            nr_processo_sei: expect.any(String),
                        }),
                    }),
                    expect.any(Object),
                );
            });
        });

        it("deve enviar nr_processo_sei vazio ao submeter com SEI 'Não'", async () => {
            const user = userEvent.setup();

            vi.mocked(useOcorrenciaFormStore).mockReturnValue({
                formData: {
                    unidadeEducacional: "123456",
                    dre: "DRE-001",
                },
                savedFormData: {},
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
            });

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            renderComponent();
            await preencherFormularioCompleto(user);

            const radiosNao = screen.getAllByRole("radio", {
                name: /^Não$/i,
            });
            await user.click(radiosNao[radiosNao.length - 1]);

            const proximoButton = screen.getByRole("button", {
                name: /Próximo/i,
            });
            await user.click(proximoButton);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        body: expect.objectContaining({
                            nr_processo_sei: "",
                        }),
                    }),
                    expect.any(Object),
                );
            });
        });
    });

    it("deve desmarcar checkbox de acompanhamento e remover do array", async () => {
        const user = userEvent.setup();
        renderComponent();

        const checkboxNAAPA = screen.getByRole("checkbox", { name: /NAAPA/i });
        await user.click(checkboxNAAPA);
        expect(checkboxNAAPA).toBeChecked();

        await user.click(checkboxNAAPA);
        expect(checkboxNAAPA).not.toBeChecked();
    });

    it("deve chamar onNext e setFormData ao submeter formulário válido", async () => {
        const user = userEvent.setup();
        renderComponent();

        const nomesInputs = screen.getAllByLabelText(
            /Qual o nome da pessoa\?/i,
        );
        await user.type(nomesInputs[0], "João Silva");
        const idadesInputs = screen.getAllByLabelText(/Qual a idade\?/i);
        await user.type(idadesInputs[0], "25");

        const generoTrigger = screen.getByRole("combobox", {
            name: /Qual o gênero\?/i,
        });
        await user.click(generoTrigger);
        await user.click(
            await screen.findByRole("option", { name: /Masculino/i }),
        );

        const grupoTrigger = screen.getByRole("combobox", {
            name: /Raça\/cor auto declarada/i,
        });
        await user.click(grupoTrigger);
        await user.click(await screen.findByRole("option", { name: /Pardo/i }));

        const etapaTrigger = screen.getByRole("combobox", {
            name: /Qual a etapa escolar\?/i,
        });
        await user.click(etapaTrigger);
        await user.click(
            await screen.findByRole("option", {
                name: /Ensino Fundamental II/i,
            }),
        );

        const frequenciaTrigger = screen.getByRole("combobox", {
            name: /Qual a frequência escolar\?/i,
        });
        await user.click(frequenciaTrigger);
        const regularOptions = await screen.findAllByRole("option", {
            name: /Regular/i,
        });
        await user.click(regularOptions.at(-1)!);

        await user.type(
            screen.getByLabelText(/Como é a interação da pessoa no ambiente/i),
            "Boa interação com todos",
        );
        await user.type(
            screen.getByPlaceholderText(/Digite a nacionalidade/i),
            "Brasileira",
        );

        const deficienciaTrigger2 = screen.getByRole("combobox", {
            name: /Pessoa com deficiência\?/i,
        });
        await user.click(deficienciaTrigger2);
        await user.click(await screen.findByRole("option", { name: /^Sim$/i }));

        const radioSim = screen.getAllByRole("radio", { name: /^Sim$/i });
        await user.click(radioSim[0]);

        const radioNAAPA2 = screen.getByRole("checkbox", { name: /NAAPA/i });
        await user.click(radioNAAPA2);

        const motivoButton = screen.getByRole("button", { name: /Selecione/i });
        await user.click(motivoButton);
        const bullyingOption = await screen.findByText(/Bullying/i);
        await user.click(bullyingOption);

        await waitFor(
            () => {
                const proximoButton = screen.getByRole("button", {
                    name: /Próximo/i,
                });
                expect(proximoButton).not.toBeDisabled();
            },
            { timeout: 5000 },
        );

        const proximoButton = screen.getByRole("button", { name: /Próximo/i });
        await user.click(proximoButton);

        await waitFor(() => {
            expect(mockSetFormData).toHaveBeenCalledWith(
                expect.objectContaining({
                    pessoasAgressoras: [
                        expect.objectContaining({
                            nome: "João Silva",
                            idade: "25",
                        }),
                    ],
                }),
            );
            expect(mockOnNext).toHaveBeenCalled();
        });
    });

    it("deve lidar com categoriasDisponiveis indefinidas", () => {
        vi.mocked(useCategoriasDisponiveis).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
            error: null,
            isFetching: false,
            refetch: vi.fn(),
            isSuccess: true,
        } as unknown as ReturnType<typeof useCategoriasDisponiveis>);

        renderComponent();

        expect(
            screen.getByText(/O que motivou a ocorrência\?/i),
        ).toBeInTheDocument();
    });

    describe("Submit com atualização (ocorrenciaUuid presente)", () => {
        beforeEach(() => {
            vi.mocked(useOcorrenciaFormStore).mockReturnValue({
                formData: {
                    unidadeEducacional: "123456",
                    dre: "DRE-001",
                },
                savedFormData: {},
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
            });
        });

        it("deve chamar atualizarInfoAgressor ao submeter com uuid presente", async () => {
            const user = userEvent.setup();

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            renderComponent();
            await preencherFormularioCompleto(user);

            const proximoButton = screen.getByRole("button", {
                name: /Próximo/i,
            });
            await user.click(proximoButton);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        uuid: "test-uuid-123",
                        body: expect.objectContaining({
                            unidade_codigo_eol: "123456",
                            dre_codigo_eol: "DRE-001",
                            pessoas_agressoras: [
                                expect.objectContaining({
                                    nome: "João Silva",
                                    idade: 25,
                                }),
                            ],
                            motivacao_ocorrencia: ["bullying"],
                            notificado_conselho_tutelar: true,
                            ocorrencia_acompanhada_pelo: ["naapa"],
                        }),
                    }),
                    expect.any(Object),
                );
            });
        });

        it("deve exibir toast de erro quando ocorre erro na mutation", async () => {
            const user = userEvent.setup();
            const mockToast = vi.fn();
            vi.mocked(toast).mockImplementation(mockToast);

            mockMutate.mockImplementation((_, options) => {
                if (options?.onError) {
                    options.onError(new Error("Erro de teste"));
                }
            });

            renderComponent();
            await preencherFormularioCompleto(user);

            const proximoButton = screen.getByRole("button", {
                name: /Próximo/i,
            });
            await user.click(proximoButton);

            expect(mockToast).toHaveBeenCalledWith({
                title: "Erro ao atualizar informações adicionais",
                description:
                    "Não foi possível atualizar os dados. Tente novamente.",
                variant: "error",
            });
        });

        it("deve exibir toast de erro quando response.success é false", async () => {
            const user = userEvent.setup();
            const mockToast = vi.fn();
            vi.mocked(toast).mockImplementation(mockToast);

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({
                    success: false,
                    error: "Erro customizado da API",
                });
            });

            renderComponent();
            await preencherFormularioCompleto(user);

            const proximoButton = screen.getByRole("button", {
                name: /Próximo/i,
            });
            await user.click(proximoButton);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Erro ao atualizar informações adicionais",
                    description: "Erro customizado da API",
                    variant: "error",
                });
                expect(mockOnNext).not.toHaveBeenCalled();
            });
        });

        it("deve enviar strings vazias quando unidadeEducacional e dre são undefined", async () => {
            const user = userEvent.setup();

            vi.mocked(useOcorrenciaFormStore).mockReturnValue({
                formData: {
                    unidadeEducacional: undefined,
                    dre: undefined,
                },
                savedFormData: {},
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
            });

            // Mock mais controlado da mutation
            let mutationResolve: () => void;
            const mutationCalled = new Promise<void>((resolve) => {
                mutationResolve = resolve;
            });

            mockMutate.mockImplementation((data, options) => {
                // Resolve a promise quando a mutation é chamada
                mutationResolve();
                options?.onSuccess?.({ success: true });
            });

            renderComponent();
            await preencherFormularioCompleto(user);

            const proximoButton = screen.getByRole("button", {
                name: /Próximo/i,
            });
            await user.click(proximoButton);

            // Espera a mutation ser chamada (mais confiável que waitFor)
            await mutationCalled;

            // Verificação direta sem waitFor
            expect(mockMutate).toHaveBeenCalledWith(
                expect.objectContaining({
                    body: expect.objectContaining({
                        unidade_codigo_eol: "",
                        dre_codigo_eol: "",
                    }),
                }),
                expect.any(Object),
            );
        });

        it("deve chamar onNext sem mutation quando não há mudanças nos dados", async () => {
            const user = userEvent.setup();

            vi.mocked(useOcorrenciaFormStore).mockReturnValue({
                formData: {
                    unidadeEducacional: "123456",
                    dre: "DRE-001",
                },
                savedFormData: {
                    pessoasAgressoras: [
                        {
                            nome: "João Silva",
                            idadeEmMeses: false,
                            idade: "25",
                            genero: "masculino",
                            grupoEtnicoRacial: "pardo",
                            etapaEscolar: "ensino_fundamental_2",
                            frequenciaEscolar: "regular",
                            interacaoAmbienteEscolar: "Boa interação",
                            nacionalidade: "Brasileira",
                            pessoaComDeficiencia: "Sim",
                        },
                    ],
                    motivoOcorrencia: ["bullying"],
                    notificadoConselhoTutelar: "Sim",
                    acompanhadoNAAPA: ["naapa"],
                },
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
            });

            renderComponent();
            await preencherFormularioCompleto(user);

            const proximoButton = screen.getByRole("button", {
                name: /Próximo/i,
            });
            await user.click(proximoButton);

            await waitFor(() => {
                expect(mockMutate).not.toHaveBeenCalled();
                expect(mockOnNext).toHaveBeenCalled();
            });
        });
    });

    describe("métodos expostos via ref", () => {
        it("deve retornar dados do formulário via getFormData", () => {
            const ref = React.createRef<InformacoesAdicionaisRef>();
            render(
                <QueryClientProvider client={queryClient}>
                    <InformacoesAdicionais
                        ref={ref}
                        onNext={mockOnNext}
                        onPrevious={mockOnPrevious}
                    />
                </QueryClientProvider>,
            );

            const formData = ref.current?.getFormData();

            expect(formData).toHaveProperty("pessoasAgressoras");
            expect(formData).toHaveProperty("motivoOcorrencia");
            expect(formData).toHaveProperty("notificadoConselhoTutelar");
            expect(formData).toHaveProperty("acompanhadoNAAPA");
        });

        it("deve retornar instância do formulário via getFormInstance", () => {
            const ref = React.createRef<InformacoesAdicionaisRef>();
            render(
                <QueryClientProvider client={queryClient}>
                    <InformacoesAdicionais
                        ref={ref}
                        onNext={mockOnNext}
                        onPrevious={mockOnPrevious}
                    />
                </QueryClientProvider>,
            );

            const formInstance = ref.current?.getFormInstance();

            expect(formInstance).toBeDefined();
            expect(formInstance?.getValues).toBeDefined();
            expect(formInstance?.trigger).toBeDefined();
            expect(formInstance?.formState).toBeDefined();
        });

        it("deve validar e submeter via submitForm quando dados são válidos", async () => {
            const user = userEvent.setup();
            const mockMutate = vi.fn((_, options) => {
                if (options?.onSuccess) {
                    options.onSuccess({ success: true, data: {} });
                }
            });

            vi.mocked(useOcorrenciaFormStore).mockReturnValue({
                formData: {
                    unidadeEducacional: "123456",
                    dre: "DRE-001",
                },
                savedFormData: {},
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
            });

            vi.spyOn(
                useAtualizarInfoAgressorHook,
                "useAtualizarInfoAgressor",
            ).mockReturnValue({
                mutate: mockMutate,
                isPending: false,
            } as never);

            const ref = React.createRef<InformacoesAdicionaisRef>();
            render(
                <QueryClientProvider client={queryClient}>
                    <InformacoesAdicionais
                        ref={ref}
                        onNext={mockOnNext}
                        onPrevious={mockOnPrevious}
                    />
                </QueryClientProvider>,
            );

            await user.type(
                screen.getAllByLabelText(/Qual o nome da pessoa\?/i)[0],
                "João Silva",
            );
            await user.type(
                screen.getAllByLabelText(/Qual a idade\?/i)[0],
                "25",
            );

            const generoTrigger = screen.getByRole("combobox", {
                name: /Qual o gênero\?/i,
            });
            await user.click(generoTrigger);
            await user.click(
                await screen.findByRole("option", { name: /Masculino/i }),
            );

            const grupoTrigger = screen.getByRole("combobox", {
                name: /Raça\/cor auto declarada/i,
            });
            await user.click(grupoTrigger);
            await user.click(
                await screen.findByRole("option", { name: /Pardo/i }),
            );

            const etapaTrigger = screen.getByRole("combobox", {
                name: /Qual a etapa escolar\?/i,
            });
            await user.click(etapaTrigger);
            await user.click(
                await screen.findByRole("option", {
                    name: /Ensino Fundamental II/i,
                }),
            );

            const frequenciaTrigger = screen.getByRole("combobox", {
                name: /Qual a frequência escolar\?/i,
            });
            await user.click(frequenciaTrigger);
            const regularOptions = await screen.findAllByRole("option", {
                name: /Regular/i,
            });
            await user.click(regularOptions.at(-1)!);

            await user.type(
                screen.getByLabelText(
                    /Como é a interação da pessoa no ambiente/i,
                ),
                "Boa interação",
            );
            await user.type(
                screen.getByPlaceholderText(/Digite a nacionalidade/i),
                "Brasileira",
            );

            const deficienciaTrigger3 = screen.getByRole("combobox", {
                name: /Pessoa com deficiência\?/i,
            });
            await user.click(deficienciaTrigger3);
            await user.click(
                await screen.findByRole("option", { name: /^Sim$/i }),
            );

            const radioSimSubmit = screen.getAllByRole("radio", {
                name: /^Sim$/i,
            });
            await user.click(radioSimSubmit[0]);

            const radioNAAPA3 = screen.getByRole("checkbox", {
                name: /NAAPA/i,
            });
            await user.click(radioNAAPA3);

            const motivoButton = screen.getByRole("button", {
                name: /Selecione/i,
            });
            await user.click(motivoButton);
            await user.click(await screen.findByText(/Bullying/i));

            await waitFor(async () => {
                const result = await ref.current?.submitForm();
                expect(result).toBe(true);
            });

            expect(mockMutate).toHaveBeenCalled();
        });

        it("deve usar false como fallback para idadeEmMeses não definido ao submeter via ref", async () => {
            const mockMutateLocal = vi.fn((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            vi.mocked(useOcorrenciaFormStore).mockReturnValue({
                formData: {
                    pessoasAgressoras: [
                        {
                            nome: "João Silva",
                            idade: "25",
                            genero: "masculino",
                            grupoEtnicoRacial: "pardo",
                            etapaEscolar: "ensino_fundamental_2",
                            frequenciaEscolar: "regular",
                            interacaoAmbienteEscolar: "Boa interação",
                            nacionalidade: "Brasileira",
                            pessoaComDeficiencia: "Sim",
                            // idadeEmMeses intencionalmente omitido (undefined)
                        },
                    ],
                    motivoOcorrencia: ["bullying"],
                    notificadoConselhoTutelar: "Sim",
                    acompanhadoNAAPA: ["naapa"],
                    unidadeEducacional: "123456",
                    dre: "DRE-001",
                },
                savedFormData: {},
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
            });

            vi.spyOn(
                useAtualizarInfoAgressorHook,
                "useAtualizarInfoAgressor",
            ).mockReturnValue({
                mutate: mockMutateLocal,
                isPending: false,
            } as never);

            const ref = React.createRef<InformacoesAdicionaisRef>();
            render(
                <QueryClientProvider client={queryClient}>
                    <InformacoesAdicionais
                        ref={ref}
                        onNext={mockOnNext}
                        onPrevious={mockOnPrevious}
                    />
                </QueryClientProvider>,
            );

            await waitFor(async () => {
                const result = await ref.current?.submitForm();
                expect(result).toBe(true);
            });

            expect(mockMutateLocal).toHaveBeenCalledWith(
                expect.objectContaining({
                    body: expect.objectContaining({
                        pessoas_agressoras: [
                            expect.objectContaining({
                                idade_em_meses: false,
                            }),
                        ],
                    }),
                }),
                expect.any(Object),
            );
        });

        it("deve retornar false ao submeter via submitForm quando dados são inválidos", async () => {
            const ref = React.createRef<InformacoesAdicionaisRef>();
            render(
                <QueryClientProvider client={queryClient}>
                    <InformacoesAdicionais
                        ref={ref}
                        onNext={mockOnNext}
                        onPrevious={mockOnPrevious}
                    />
                </QueryClientProvider>,
            );

            await waitFor(async () => {
                const result = await ref.current?.submitForm();
                expect(result).toBe(false);
            });

            expect(mockOnNext).not.toHaveBeenCalled();
        });
    });

    it("deve desabilitar todos os campos quando disabled=true", async () => {
        const user = userEvent.setup();
        const renderComponent = () =>
            render(
                <QueryClientProvider client={queryClient}>
                    <InformacoesAdicionais
                        onPrevious={mockOnPrevious}
                        onNext={mockOnNext}
                        disabled={true}
                    />
                </QueryClientProvider>,
            );

        renderComponent();

        const nomeInput = screen.getAllByLabelText(
            /Qual o nome da pessoa\?/i,
        )[0];
        const idadeInput = screen.getAllByLabelText(/Qual a idade\?/i)[0];
        expect(nomeInput).toBeDisabled();
        expect(idadeInput).toBeDisabled();

        const selects = screen.getAllByRole("combobox");
        selects.forEach((select) => {
            expect(select).toBeDisabled();
        });

        const radioButtons = screen.getAllByRole("radio");
        radioButtons.forEach((radio) => {
            expect(radio).toBeDisabled();
        });

        await user.type(nomeInput, "Teste");
        expect(nomeInput).toHaveValue("");
    });
});
