import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InformacoesAdicionais, { InformacoesAdicionaisRef } from "./index";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useCategoriasDisponiveis } from "@/hooks/useCategoriasDisponiveis";
import * as useAtualizarInfoAgressorHook from "@/hooks/useAtualizarInfoAgressor";
import { toast } from "@/components/ui/headless-toast";
import { useEnderecoPorCep } from "@/hooks/useEnderecoViaCep";
import React from "react";

vi.mock("@/stores/useOcorrenciaFormStore");
vi.mock("@/hooks/useCategoriasDisponiveis");
vi.mock("@/hooks/useAtualizarInfoAgressor");
vi.mock("@/components/ui/headless-toast");
vi.mock("@/hooks/useEnderecoViaCep");

describe("InformacoesAdicionais", () => {
    const mockOnPrevious = vi.fn();
    const mockOnNext = vi.fn();
    const mockSetFormData = vi.fn();
    const mockSetSavedFormData = vi.fn();
    const mockMutate = vi.fn();
    const mockMutateAsync = vi.fn();

    const queryClient = new QueryClient();

    const renderComponent = () =>
        render(
            <QueryClientProvider client={queryClient}>
                <InformacoesAdicionais
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />
            </QueryClientProvider>
        );

    const preencherFormularioCompleto = async (
        user: ReturnType<typeof userEvent.setup>
    ) => {
        await user.type(
            screen.getByLabelText(/Qual o nome da pessoa agressora\?/i),
            "João Silva"
        );
        await user.type(
            screen.getByLabelText(/Qual a idade da pessoa agressora\?/i),
            "25"
        );
        await user.type(
            screen.getByPlaceholderText(/Digite o CEP\.\.\./i),
            "01310100"
        );

        await waitFor(() => {
            expect(
                screen.getByPlaceholderText(/Digite o CEP\.\.\./i)
            ).toHaveValue("01310-100");
        });

        await user.type(
            screen.getByLabelText(/Logradouro/i),
            "Avenida Paulista"
        );
        await user.type(screen.getByLabelText(/Número da residência/i), "1578");
        await user.type(screen.getByLabelText(/Cidade/i), "São Paulo");
        await user.type(screen.getByLabelText(/Bairro/i), "Bela Vista");
        await user.type(
            screen.getByLabelText(/Como é a interação da pessoa agressora/i),
            "Boa interação"
        );
        await user.type(
            screen.getByLabelText(/Quais as redes de proteção/i),
            "CRAS, NAAPA"
        );

        const radioSim = screen.getAllByRole("radio", { name: /Sim/i });
        await user.click(radioSim[0]);
        await user.click(radioSim[1]);

        const estadoTrigger = screen.getByRole("combobox", { name: /Estado/i });
        await user.click(estadoTrigger);
        await user.click(
            await screen.findByRole("option", { name: /São Paulo/i })
        );

        const motivoButton = screen.getByRole("button", { name: /Selecione/i });
        await user.click(motivoButton);
        await user.click(await screen.findByText(/Bullying/i));

        const generoTrigger = screen.getByRole("combobox", {
            name: /Qual o gênero\?/i,
        });
        await user.click(generoTrigger);
        await user.click(
            await screen.findByRole("option", { name: /Masculino/i })
        );

        const grupoTrigger = screen.getByRole("combobox", {
            name: /Qual o grupo étnico-racial\?/i,
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
            })
        );

        const frequenciaTrigger = screen.getByRole("combobox", {
            name: /Qual a frequência escolar\?/i,
        });
        await user.click(frequenciaTrigger);
        const regularOptions = await screen.findAllByRole("option", {
            name: /Regular/i,
        });
        await user.click(regularOptions.at(-1)!);

        await waitFor(
            () => {
                expect(
                    screen.getByRole("button", { name: /Próximo/i })
                ).not.toBeDisabled();
            },
            { timeout: 5000 }
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useEnderecoPorCep).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
            error: null,
        } as unknown as ReturnType<typeof useEnderecoPorCep>);
        vi.mocked(useOcorrenciaFormStore).mockReturnValue({
            formData: {},
            savedFormData: {},
            setFormData: mockSetFormData,
            setSavedFormData: mockSetSavedFormData,
            ocorrenciaUuid: null,
        });
        vi.mocked(useCategoriasDisponiveis).mockReturnValue({
            data: {
                motivo_ocorrencia: [{ label: "Bullying", value: "bullying" }],
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
            "useAtualizarInfoAgressor"
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
            screen.getByLabelText(/nome da pessoa agressora/i)
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/Digite o CEP/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/O que motivou a ocorrência/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/notificada ao Conselho Tutelar/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/acompanhada pelo NAAPA/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Anterior/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Próximo/i })
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

    it("deve formatar o CEP corretamente ao digitar", async () => {
        const user = userEvent.setup();
        renderComponent();

        const cepInput = screen.getByPlaceholderText(/Digite o CEP\.\.\./i);
        await user.type(cepInput, "01310100");

        await waitFor(() => {
            expect(cepInput).toHaveValue("01310-100");
        });
    });

    it("deve preencher os campos com dados do store", () => {
        vi.mocked(useOcorrenciaFormStore).mockReturnValue({
            formData: {
                nomeAgressor: "João Silva",
                idadeAgressor: "25",
                cep: "01310-100",
                logradouro: "Avenida Paulista",
                numero: "1578",
                complemento: "Apto 101",
                estado: "SP",
                cidade: "São Paulo",
                bairro: "Bela Vista",
                motivoOcorrencia: ["bullying"],
                genero: "masculino",
                grupoEtnicoRacial: "pardo",
                etapaEscolar: "ensino_fundamental_2",
                frequenciaEscolar: "regular",
                interacaoAmbienteEscolar: "Boa interação",
                redesProtecao: "CRAS",
                notificadoConselhoTutelar: "Sim",
                acompanhadoNAAPA: "Não",
            },
            setFormData: mockSetFormData,
        });

        renderComponent();

        expect(
            screen.getByLabelText(/Qual o nome da pessoa agressora\?/i)
        ).toHaveValue("João Silva");
        expect(
            screen.getByLabelText(/Qual a idade da pessoa agressora\?/i)
        ).toHaveValue(25);
        expect(screen.getByPlaceholderText(/Digite o CEP\.\.\./i)).toHaveValue(
            "01310-100"
        );
        expect(screen.getByLabelText(/Logradouro/i)).toHaveValue(
            "Avenida Paulista"
        );
        expect(screen.getByLabelText(/Número da residência/i)).toHaveValue(
            "1578"
        );
        expect(screen.getByLabelText(/Complemento/i)).toHaveValue("Apto 101");
        expect(screen.getByLabelText(/Cidade/i)).toHaveValue("São Paulo");
        expect(screen.getByLabelText(/Bairro/i)).toHaveValue("Bela Vista");
    });

    it("deve validar campos obrigatórios", async () => {
        const user = userEvent.setup();
        renderComponent();

        const proximoButton = screen.getByRole("button", { name: /Próximo/i });
        expect(proximoButton).toBeDisabled();

        const nomeInput = screen.getByLabelText(
            /Qual o nome da pessoa agressora\?/i
        );
        await user.type(nomeInput, "João Silva");

        expect(proximoButton).toBeDisabled();
    });

    it("deve exibir mensagem de ajuda para motivo de ocorrência", () => {
        renderComponent();
        expect(
            screen.getByText(/Se necessário, selecione mais de uma opção/i)
        ).toBeInTheDocument();
    });

    it("deve limitar o CEP a 9 caracteres", async () => {
        const user = userEvent.setup();
        renderComponent();

        const cepInput = screen.getByPlaceholderText(/Digite o CEP\.\.\./i);
        await user.type(cepInput, "0131010012345");

        await waitFor(() => {
            expect(cepInput).toHaveValue("01310-100");
        });
    });

    it("deve selecionar opções de radio buttons", async () => {
        const user = userEvent.setup();
        renderComponent();

        const radioNao = screen.getAllByRole("radio", { name: /Não/i });
        await user.click(radioNao[0]);
        await user.click(radioNao[1]);

        expect(radioNao[0]).toBeChecked();
        expect(radioNao[1]).toBeChecked();
    });

    it("deve chamar onNext e setFormData ao submeter formulário válido", async () => {
        const user = userEvent.setup();
        renderComponent();

        await user.type(
            screen.getByLabelText(/Qual o nome da pessoa agressora\?/i),
            "João Silva"
        );
        await user.type(
            screen.getByLabelText(/Qual a idade da pessoa agressora\?/i),
            "25"
        );
        await user.type(
            screen.getByPlaceholderText(/Digite o CEP\.\.\./i),
            "01310100"
        );

        await waitFor(() => {
            expect(
                screen.getByPlaceholderText(/Digite o CEP\.\.\./i)
            ).toHaveValue("01310-100");
        });

        await user.type(
            screen.getByLabelText(/Logradouro/i),
            "Avenida Paulista"
        );
        await user.type(screen.getByLabelText(/Número da residência/i), "1578");
        await user.type(screen.getByLabelText(/Cidade/i), "São Paulo");
        await user.type(screen.getByLabelText(/Bairro/i), "Bela Vista");
        await user.type(
            screen.getByLabelText(/Como é a interação da pessoa agressora/i),
            "Boa interação com todos"
        );
        await user.type(
            screen.getByLabelText(/Quais as redes de proteção/i),
            "CRAS e Conselho Tutelar"
        );

        const radioSim = screen.getAllByRole("radio", { name: /Sim/i });
        await user.click(radioSim[0]);
        await user.click(radioSim[1]);

        const estadoTrigger = screen.getByRole("combobox", { name: /Estado/i });
        await user.click(estadoTrigger);
        const spOption = await screen.findByRole("option", {
            name: /São Paulo/i,
        });
        await user.click(spOption);

        const motivoButton = screen.getByRole("button", { name: /Selecione/i });
        await user.click(motivoButton);
        const bullyingOption = await screen.findByText(/Bullying/i);
        await user.click(bullyingOption);

        const generoTrigger = screen.getByRole("combobox", {
            name: /Qual o gênero\?/i,
        });
        await user.click(generoTrigger);
        const masculinoOption = await screen.findByRole("option", {
            name: /Masculino/i,
        });
        await user.click(masculinoOption);

        const grupoTrigger = screen.getByRole("combobox", {
            name: /Qual o grupo étnico-racial\?/i,
        });
        await user.click(grupoTrigger);
        const pardoOption = await screen.findByRole("option", {
            name: /Pardo/i,
        });
        await user.click(pardoOption);

        const etapaTrigger = screen.getByRole("combobox", {
            name: /Qual a etapa escolar\?/i,
        });
        await user.click(etapaTrigger);
        const fundamentalOption = await screen.findByRole("option", {
            name: /Ensino Fundamental II/i,
        });
        await user.click(fundamentalOption);

        const frequenciaTrigger = screen.getByRole("combobox", {
            name: /Qual a frequência escolar\?/i,
        });
        await user.click(frequenciaTrigger);
        const regularOptions = await screen.findAllByRole("option", {
            name: /Regular/i,
        });
        await user.click(regularOptions.at(-1)!);

        await waitFor(
            () => {
                const proximoButton = screen.getByRole("button", {
                    name: /Próximo/i,
                });
                expect(proximoButton).not.toBeDisabled();
            },
            { timeout: 5000 }
        );

        const proximoButton = screen.getByRole("button", { name: /Próximo/i });
        await user.click(proximoButton);

        await waitFor(() => {
            expect(mockSetFormData).toHaveBeenCalledWith(
                expect.objectContaining({
                    nomeAgressor: "João Silva",
                    idadeAgressor: "25",
                    cep: "01310-100",
                    cidade: "São Paulo",
                })
            );
            expect(mockOnNext).toHaveBeenCalled();
        });
    }, 15000);

    it("deve chamar formatCep corretamente com menos de 5 números", async () => {
        const user = userEvent.setup();
        renderComponent();

        const cepInput = screen.getByPlaceholderText(/Digite o CEP\.\.\./i);
        await user.type(cepInput, "1234");

        await waitFor(() => {
            expect(cepInput).toHaveValue("1234");
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
            screen.getByText(/O que motivou a ocorrência\?/i)
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
                            nome_pessoa_agressora: "João Silva",
                            idade_pessoa_agressora: 25,
                            motivacao_ocorrencia: ["bullying"],
                            genero_pessoa_agressora: "masculino",
                            notificado_conselho_tutelar: true,
                            acompanhado_naapa: true,
                        }),
                    }),
                    expect.any(Object)
                );
            });
        }, 15000);

        it("deve exibir toast de erro quando ocorre erro na mutation", async () => {
            const user = userEvent.setup();
            const mockToast = vi.fn();
            vi.mocked(toast).mockImplementation(mockToast);

            mockMutate.mockImplementation((_, options) => {
                options?.onError?.();
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
                    description:
                        "Não foi possível atualizar os dados. Tente novamente.",
                    variant: "error",
                });
            });
        }, 15000);

        it("deve converter corretamente complemento vazio para string vazia", async () => {
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
                        body: expect.objectContaining({
                            complemento: "",
                        }),
                    }),
                    expect.any(Object)
                );
            });
        }, 15000);

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
        }, 15000);

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
                        body: expect.objectContaining({
                            unidade_codigo_eol: "",
                            dre_codigo_eol: "",
                        }),
                    }),
                    expect.any(Object)
                );
            });
        }, 15000);

        it("deve chamar onNext sem mutation quando não há mudanças nos dados", async () => {
            const user = userEvent.setup();

            vi.mocked(useOcorrenciaFormStore).mockReturnValue({
                formData: {
                    unidadeEducacional: "123456",
                    dre: "DRE-001",
                },
                savedFormData: {
                    nomeAgressor: "João Silva",
                    idadeAgressor: "25",
                    cep: "01310-100",
                    logradouro: "Avenida Paulista",
                    numero: "1578",
                    complemento: "",
                    cidade: "São Paulo",
                    bairro: "Bela Vista",
                    estado: "SP",
                    motivoOcorrencia: ["bullying"],
                    genero: "masculino",
                    grupoEtnicoRacial: "pardo",
                    etapaEscolar: "ensino_fundamental_2",
                    frequenciaEscolar: "regular",
                    interacaoAmbienteEscolar: "Boa interação",
                    redesProtecao: "CRAS, NAAPA",
                    notificadoConselhoTutelar: "Sim",
                    acompanhadoNAAPA: "Sim",
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
        }, 15000);
    });

    describe("Busca de CEP", () => {
        it("deve preencher campos corretamente ao buscar CEP com sucesso", async () => {
            mockMutateAsync.mockResolvedValue({
                logradouro: "Rua Teste",
                bairro: "Bairro Teste",
                cidade: "Cidade Teste",
                estado: "SP",
            });
            renderComponent();
            const user = userEvent.setup();
            const cepInput = screen.getByPlaceholderText(/Digite o CEP\.\.\./i);
            await user.type(cepInput, "12345678");
            const pesquisarCepButton = screen.getByRole("button", {
                name: /Pesquisar CEP/i,
            });
            await user.click(pesquisarCepButton);

            await waitFor(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith("12345-678");
                expect(screen.getByLabelText(/Logradouro/i)).toHaveValue(
                    "Rua Teste"
                );
                expect(screen.getByLabelText(/Bairro/i)).toHaveValue(
                    "Bairro Teste"
                );
                expect(screen.getByLabelText(/Cidade/i)).toHaveValue(
                    "Cidade Teste"
                );
                expect(
                    screen.getByRole("combobox", { name: /Estado/i })
                ).toHaveTextContent("São Paulo");
            });
        });

        it("deve mostrar toast de erro para CEP inválido", async () => {
            mockMutateAsync.mockRejectedValue(new Error("CEP inválido"));
            renderComponent();
            const user = userEvent.setup();
            const cepInput = screen.getByPlaceholderText(/Digite o CEP\.\.\./i);
            await user.type(cepInput, "00000000");
            await user.click(
                screen.getByRole("button", { name: /Pesquisar CEP/i })
            );

            await waitFor(() => {
                expect(toast).toHaveBeenCalledWith(
                    expect.objectContaining({
                        variant: "error",
                        title: "Número de CEP inválido!",
                    })
                );
            });
        });

        it("deve mostrar toast de erro genérico para outros erros", async () => {
            mockMutateAsync.mockRejectedValue("Erro genérico não estruturado");
            renderComponent();
            const user = userEvent.setup();
            const cepInput = screen.getByPlaceholderText(/Digite o CEP\.\.\./i);
            await user.type(cepInput, "12345678");
            await user.click(
                screen.getByRole("button", { name: /Pesquisar CEP/i })
            );

            await waitFor(() => {
                expect(toast).toHaveBeenCalledWith(
                    expect.objectContaining({
                        variant: "error",
                        title: "Houve um erro...",
                    })
                );
            });
        });

        it("deve mostrar 'Buscando...' no botão enquanto isPending é true", async () => {
            vi.mocked(useEnderecoPorCep).mockReturnValue({
                mutateAsync: mockMutateAsync,
                isPending: true,
                error: null,
            } as unknown as ReturnType<typeof useEnderecoPorCep>);

            renderComponent();

            const pesquisarCepButton = screen.getByRole("button", {
                name: /Buscando.../i,
            });
            expect(pesquisarCepButton).toBeInTheDocument();
            expect(pesquisarCepButton).toHaveTextContent("Buscando...");
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
                </QueryClientProvider>
            );

            const formData = ref.current?.getFormData();

            expect(formData).toHaveProperty("nomeAgressor");
            expect(formData).toHaveProperty("idadeAgressor");
            expect(formData).toHaveProperty("cep");
            expect(formData).toHaveProperty("logradouro");
            expect(formData).toHaveProperty("numero");
            expect(formData).toHaveProperty("complemento");
            expect(formData).toHaveProperty("estado");
            expect(formData).toHaveProperty("cidade");
            expect(formData).toHaveProperty("bairro");
            expect(formData).toHaveProperty("motivoOcorrencia");
            expect(formData).toHaveProperty("genero");
            expect(formData).toHaveProperty("grupoEtnicoRacial");
            expect(formData).toHaveProperty("etapaEscolar");
            expect(formData).toHaveProperty("frequenciaEscolar");
            expect(formData).toHaveProperty("interacaoAmbienteEscolar");
            expect(formData).toHaveProperty("redesProtecao");
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
                </QueryClientProvider>
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
                "useAtualizarInfoAgressor"
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
                </QueryClientProvider>
            );

            await user.type(
                screen.getByLabelText(/Qual o nome da pessoa agressora\?/i),
                "João Silva"
            );
            await user.type(
                screen.getByLabelText(/Qual a idade da pessoa agressora\?/i),
                "25"
            );
            await user.type(
                screen.getByPlaceholderText(/Digite o CEP\.\.\./i),
                "01310100"
            );

            await waitFor(() => {
                expect(
                    screen.getByPlaceholderText(/Digite o CEP\.\.\./i)
                ).toHaveValue("01310-100");
            });

            await user.type(
                screen.getByLabelText(/Logradouro/i),
                "Avenida Paulista"
            );
            await user.type(
                screen.getByLabelText(/Número da residência/i),
                "1578"
            );
            await user.type(screen.getByLabelText(/Cidade/i), "São Paulo");
            await user.type(screen.getByLabelText(/Bairro/i), "Bela Vista");
            await user.type(
                screen.getByLabelText(/Como é a interação da pessoa agressora/i),
                "Boa interação"
            );
            await user.type(
                screen.getByLabelText(/Quais as redes de proteção/i),
                "CRAS, NAAPA"
            );

            const radioSim = screen.getAllByRole("radio", { name: /Sim/i });
            await user.click(radioSim[0]);
            await user.click(radioSim[1]);

            const estadoTrigger = screen.getByRole("combobox", {
                name: /Estado/i,
            });
            await user.click(estadoTrigger);
            await user.click(
                await screen.findByRole("option", { name: /São Paulo/i })
            );

            const motivoButton = screen.getByRole("button", {
                name: /Selecione/i,
            });
            await user.click(motivoButton);
            await user.click(await screen.findByText(/Bullying/i));

            const generoTrigger = screen.getByRole("combobox", {
                name: /Qual o gênero\?/i,
            });
            await user.click(generoTrigger);
            await user.click(
                await screen.findByRole("option", { name: /Masculino/i })
            );

            const grupoTrigger = screen.getByRole("combobox", {
                name: /Qual o grupo étnico-racial\?/i,
            });
            await user.click(grupoTrigger);
            await user.click(
                await screen.findByRole("option", { name: /Pardo/i })
            );

            const etapaTrigger = screen.getByRole("combobox", {
                name: /Qual a etapa escolar\?/i,
            });
            await user.click(etapaTrigger);
            await user.click(
                await screen.findByRole("option", {
                    name: /Ensino Fundamental II/i,
                })
            );

            const frequenciaTrigger = screen.getByRole("combobox", {
                name: /Qual a frequência escolar\?/i,
            });
            await user.click(frequenciaTrigger);
            const regularOptions = await screen.findAllByRole("option", {
                name: /Regular/i,
            });
            await user.click(regularOptions.at(-1)!);

            await waitFor(
                async () => {
                    const result = await ref.current?.submitForm();
                    expect(result).toBe(true);
                },
                { timeout: 5000 }
            );

            expect(mockMutate).toHaveBeenCalled();
        }, 15000);

        it("deve retornar false ao submeter via submitForm quando dados são inválidos", async () => {
            const ref = React.createRef<InformacoesAdicionaisRef>();
            render(
                <QueryClientProvider client={queryClient}>
                    <InformacoesAdicionais
                        ref={ref}
                        onNext={mockOnNext}
                        onPrevious={mockOnPrevious}
                    />
                </QueryClientProvider>
            );

            await waitFor(async () => {
                const result = await ref.current?.submitForm();
                expect(result).toBe(false);
            });

            expect(mockOnNext).not.toHaveBeenCalled();
        });
    });
});
