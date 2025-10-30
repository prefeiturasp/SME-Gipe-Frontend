import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SecaoFurtoERoubo from "./index";
import userEvent from "@testing-library/user-event";
import * as useTiposOcorrenciaHook from "@/hooks/useTiposOcorrencia";
import * as useAtualizarSecaoFurtoRouboHook from "@/hooks/useAtualizarSecaoFurtoRoubo";
import * as useOcorrenciaFormStoreModule from "@/stores/useOcorrenciaFormStore";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));

vi.mock("@/hooks/useTiposOcorrencia");
vi.mock("@/hooks/useAtualizarSecaoFurtoRoubo");

const mockSetFormData = vi.fn();
const mockClearFormData = vi.fn();

vi.mock("@/stores/useOcorrenciaFormStore", () => ({
    useOcorrenciaFormStore: vi.fn(() => ({
        formData: {},
        savedFormData: {},
        setFormData: mockSetFormData,
        setSavedFormData: vi.fn(),
        ocorrenciaUuid: null,
        clearFormData: mockClearFormData,
    })),
}));

const mockTiposOcorrencia = [
    {
        uuid: "1cd5b78c-3d8a-483c-a2c5-1346c44a4e97",
        nome: "Violência física",
    },
    {
        uuid: "f2a5b2d7-390d-4af9-ab1b-06551eec0dba",
        nome: "Violência psicológica",
    },
    {
        uuid: "4d30a69e-e0b1-4d33-aee9-47636728bf44",
        nome: "Violência sexual",
    },
    {
        uuid: "263f33e0-36e3-45ec-b886-aa775ed1bd7e",
        nome: "Negligência",
    },
    {
        uuid: "1ccb79b1-0778-4cb8-a896-c805e37c0d73",
        nome: "Bullying",
    },
    {
        uuid: "252ebf03-c661-4195-b42e-455376e10396",
        nome: "Cyberbullying",
    },
];

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    Wrapper.displayName = "QueryClientProvider";
    return Wrapper;
};

describe("SecaoFurtoERoubo", () => {
    const mockOnPrevious = vi.fn();
    const mockOnNext = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(
            useOcorrenciaFormStoreModule.useOcorrenciaFormStore
        ).mockReturnValue({
            formData: {},
            savedFormData: {},
            setFormData: mockSetFormData,
            setSavedFormData: vi.fn(),
            ocorrenciaUuid: null,
            clearFormData: mockClearFormData,
        } as never);

        vi.spyOn(useTiposOcorrenciaHook, "useTiposOcorrencia").mockReturnValue({
            data: mockTiposOcorrencia,
            isLoading: false,
            isError: false,
            error: null,
        } as never);

        vi.spyOn(
            useAtualizarSecaoFurtoRouboHook,
            "useAtualizarSecaoFurtoRoubo"
        ).mockReturnValue({
            mutate: vi.fn(),
            mutateAsync: vi.fn(),
            isPending: false,
            isError: false,
            error: null,
        } as never);
    });

    it("deve renderizar todos os campos do formulário", () => {
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        expect(
            screen.getByText("Qual o tipo de ocorrência?*")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Se necessário, selecione mais de uma opção")
        ).toBeInTheDocument();
        expect(screen.getByText("Descreva a ocorrência*")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Unidade Educacional é contemplada pelo Smart Sampa? Se sim, houve dano às câmeras do sistema?*"
            )
        ).toBeInTheDocument();
    });

    it("deve renderizar todas as opções de tipo de ocorrência", async () => {
        const user = userEvent.setup();
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const multiSelectButton = screen.getByRole("button", {
            name: /selecione os tipos de ocorrência/i,
        });
        await user.click(multiSelectButton);

        await waitFor(() => {
            expect(screen.getByText("Violência física")).toBeInTheDocument();
            expect(
                screen.getByText("Violência psicológica")
            ).toBeInTheDocument();
            expect(screen.getByText("Violência sexual")).toBeInTheDocument();
            expect(screen.getByText("Negligência")).toBeInTheDocument();
            expect(screen.getByText("Bullying")).toBeInTheDocument();
            expect(screen.getByText("Cyberbullying")).toBeInTheDocument();
        });
    });

    it("deve renderizar as opções do Smart Sampa", () => {
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText("Sim e houve dano")).toBeInTheDocument();
        expect(screen.getByText("Sim, mas não houve dano")).toBeInTheDocument();
        expect(
            screen.getByText("A UE não faz parte do Smart Sampa")
        ).toBeInTheDocument();
    });

    it("deve desabilitar o botão Próximo quando o formulário está inválido", () => {
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const btnProximo = screen.getByRole("button", { name: /próximo/i });
        expect(btnProximo).toBeDisabled();
    });

    it("deve habilitar o botão Próximo quando todos os campos obrigatórios são preenchidos", async () => {
        const user = userEvent.setup();
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const multiSelectButton = screen.getByRole("button", {
            name: /selecione os tipos de ocorrência/i,
        });
        await user.click(multiSelectButton);

        const option = await screen.findByText("Violência física");
        await user.click(option);

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(textarea, "Descrição detalhada da ocorrência");

        const radioNaoFazParte = screen.getByRole("radio", {
            name: /a ue não faz parte do smart sampa/i,
        });
        await user.click(radioNaoFazParte);

        await waitFor(() => {
            const btnProximo = screen.getByRole("button", {
                name: /próximo/i,
            });
            expect(btnProximo).not.toBeDisabled();
        });
    });
    it("deve chamar onPrevious ao clicar no botão Anterior", () => {
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const btnAnterior = screen.getByRole("button", { name: /anterior/i });
        fireEvent.click(btnAnterior);

        expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    });

    it("deve permitir selecionar múltiplos tipos de ocorrência", async () => {
        const user = userEvent.setup();
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const multiSelectButton = screen.getByRole("button", {
            name: /selecione os tipos de ocorrência/i,
        });
        await user.click(multiSelectButton);

        const opcaoFisica = await screen.findByText("Violência física");
        await user.click(opcaoFisica);

        const opcaoPsicologica = await screen.findByText(
            "Violência psicológica"
        );
        await user.click(opcaoPsicologica);

        const opcaoNegligencia = await screen.findByText("Negligência");
        await user.click(opcaoNegligencia);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Violência física, Violência psicológica, Negligência"
                )
            ).toBeInTheDocument();
        });
    });

    it("deve permitir selecionar e visualizar a seleção no botão", async () => {
        const user = userEvent.setup();
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const multiSelectButton = screen.getByRole("button", {
            name: /selecione os tipos de ocorrência/i,
        });
        await user.click(multiSelectButton);

        const violenciaFisica = await screen.findByRole("option", {
            name: /violência física/i,
        });
        await user.click(violenciaFisica);

        await waitFor(() => {
            const button = screen.getByRole("button", {
                name: /violência física/i,
            });
            expect(button).toBeInTheDocument();
        });

        expect(
            screen.queryByText("Selecione os tipos de ocorrência")
        ).not.toBeInTheDocument();
    });
    it("deve exibir erro quando descrição é muito curta", async () => {
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        fireEvent.change(textarea, { target: { value: "Curto" } });
        fireEvent.blur(textarea);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "A descrição deve ter pelo menos 10 caracteres."
                )
            ).toBeInTheDocument();
        });
    });

    it("deve chamar onNext ao submeter o formulário válido", async () => {
        const user = userEvent.setup();
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const multiSelectButton = screen.getByRole("button", {
            name: /selecione os tipos de ocorrência/i,
        });
        await user.click(multiSelectButton);

        const opcaoFisica = await screen.findByText("Violência física");
        await user.click(opcaoFisica);

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(
            textarea,
            "Descrição detalhada da ocorrência com mais de dez caracteres"
        );

        const radioNaoFazParte = screen.getByRole("radio", {
            name: /a ue não faz parte do smart sampa/i,
        });
        await user.click(radioNaoFazParte);

        await waitFor(() => {
            const btnProximo = screen.getByRole("button", {
                name: /próximo/i,
            });
            expect(btnProximo).not.toBeDisabled();
        });

        const btnProximo = screen.getByRole("button", { name: /próximo/i });
        await user.click(btnProximo);

        await waitFor(() => {
            expect(mockOnNext).toHaveBeenCalledTimes(1);
        });
    });

    it("deve exibir mensagem de erro quando nenhum tipo de ocorrência é selecionado", async () => {
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        fireEvent.change(textarea, {
            target: { value: "Descrição detalhada da ocorrência" },
        });

        const radioNaoFazParte = screen.getByRole("radio", {
            name: /a ue não faz parte do smart sampa/i,
        });
        fireEvent.click(radioNaoFazParte);

        await waitFor(() => {
            const btnProximo = screen.getByRole("button", {
                name: /próximo/i,
            });
            expect(btnProximo).toBeDisabled();
        });
    });

    it("deve desabilitar o MultiSelect quando os tipos estão carregando", () => {
        vi.spyOn(useTiposOcorrenciaHook, "useTiposOcorrencia").mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
        } as never);

        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const multiSelectButtons = screen.getAllByRole("button");
        const multiSelectButton = multiSelectButtons.find(
            (button) => button.getAttribute("aria-haspopup") === "listbox"
        );

        expect(multiSelectButton).toBeDisabled();
    });

    it("deve exibir lista vazia quando não há tipos de ocorrência", () => {
        vi.spyOn(useTiposOcorrenciaHook, "useTiposOcorrencia").mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
            error: null,
        } as never);

        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        expect(
            screen.getByText("Qual o tipo de ocorrência?*")
        ).toBeInTheDocument();

        const multiSelectButtons = screen.getAllByRole("button");
        const multiSelectButton = multiSelectButtons.find(
            (button) => button.getAttribute("aria-haspopup") === "listbox"
        );

        expect(multiSelectButton).toBeInTheDocument();
        expect(multiSelectButton).not.toBeDisabled();
    });

    it("deve carregar formulário com descricao vazia quando formData.descricao é undefined", () => {
        vi.mocked(
            useOcorrenciaFormStoreModule.useOcorrenciaFormStore
        ).mockReturnValue({
            formData: {
                tiposOcorrencia: [],
                descricao: undefined,
                smartSampa: undefined,
            },
            savedFormData: {},
            setFormData: mockSetFormData,
            setSavedFormData: vi.fn(),
            ocorrenciaUuid: null,
            clearFormData: mockClearFormData,
        } as never);

        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        expect(textarea).toHaveValue("");
    });

    it("deve carregar formulário com descricao preenchida quando formData.descricao existe", () => {
        vi.mocked(
            useOcorrenciaFormStoreModule.useOcorrenciaFormStore
        ).mockReturnValue({
            formData: {
                tiposOcorrencia: [],
                descricao: "Descrição já preenchida",
                smartSampa: undefined,
            },
            savedFormData: {},
            setFormData: mockSetFormData,
            setSavedFormData: vi.fn(),
            ocorrenciaUuid: null,
            clearFormData: mockClearFormData,
        } as never);

        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        expect(textarea).toHaveValue("Descrição já preenchida");
    });

    describe("Atualização de ocorrência existente", () => {
        const mockMutate = vi.fn();
        const mockSetFormData = vi.fn();
        const mockSetSavedFormData = vi.fn();

        beforeEach(() => {
            vi.clearAllMocks();

            vi.spyOn(
                useOcorrenciaFormStoreModule,
                "useOcorrenciaFormStore"
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: "Descrição original da ocorrência",
                    smartSampa: "nao_faz_parte",
                },
                savedFormData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: "Descrição original da ocorrência",
                    smartSampa: "nao_faz_parte",
                },
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
                clearFormData: vi.fn(),
            } as never);

            vi.spyOn(
                useAtualizarSecaoFurtoRouboHook,
                "useAtualizarSecaoFurtoRoubo"
            ).mockReturnValue({
                mutate: mockMutate,
                isPending: false,
                isError: false,
                error: null,
            } as never);

            vi.spyOn(
                useTiposOcorrenciaHook,
                "useTiposOcorrencia"
            ).mockReturnValue({
                data: mockTiposOcorrencia,
                isLoading: false,
                isError: false,
                error: null,
            } as never);
        });

        it("deve atualizar a ocorrência quando houver mudanças", async () => {
            const user = userEvent.setup();

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            render(
                <SecaoFurtoERoubo
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />,
                { wrapper: createWrapper() }
            );

            const textarea = screen.getByPlaceholderText("Descreva aqui...");
            await user.clear(textarea);
            await user.type(textarea, "Nova descrição da ocorrência");

            await waitFor(() => {
                const btnProximo = screen.getByRole("button", {
                    name: /próximo/i,
                });
                expect(btnProximo).not.toBeDisabled();
            });

            const btnProximo = screen.getByRole("button", { name: /próximo/i });
            await user.click(btnProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        uuid: "test-uuid-123",
                        body: expect.objectContaining({
                            descricao_ocorrencia:
                                "Nova descrição da ocorrência",
                            smart_sampa_situacao: "nao_faz_parte",
                        }),
                    }),
                    expect.any(Object)
                );
            });
        });

        it("deve avançar sem atualizar quando não houver mudanças", async () => {
            const user = userEvent.setup();

            render(
                <SecaoFurtoERoubo
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />,
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                const btnProximo = screen.getByRole("button", {
                    name: /próximo/i,
                });
                expect(btnProximo).not.toBeDisabled();
            });

            const btnProximo = screen.getByRole("button", { name: /próximo/i });
            await user.click(btnProximo);

            await waitFor(() => {
                expect(mockMutate).not.toHaveBeenCalled();
                expect(mockOnNext).toHaveBeenCalledTimes(1);
            });
        });

        it("deve exibir toast de erro quando a atualização falhar", async () => {
            const user = userEvent.setup();

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({
                    success: false,
                    error: "Erro ao atualizar",
                });
            });

            render(
                <SecaoFurtoERoubo
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />,
                { wrapper: createWrapper() }
            );

            const radioSimHouveDano = screen.getByRole("radio", {
                name: /sim e houve dano/i,
            });
            await user.click(radioSimHouveDano);

            await waitFor(() => {
                const btnProximo = screen.getByRole("button", {
                    name: /próximo/i,
                });
                expect(btnProximo).not.toBeDisabled();
            });

            const btnProximo = screen.getByRole("button", { name: /próximo/i });
            await user.click(btnProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
                expect(mockOnNext).not.toHaveBeenCalled();
            });
        });

        it("deve exibir toast de erro em caso de erro de rede", async () => {
            const user = userEvent.setup();

            mockMutate.mockImplementation((_, options) => {
                options?.onError?.();
            });

            render(
                <SecaoFurtoERoubo
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />,
                { wrapper: createWrapper() }
            );

            const radioSimSemDano = screen.getByRole("radio", {
                name: /sim, mas não houve dano/i,
            });
            await user.click(radioSimSemDano);

            await waitFor(() => {
                const btnProximo = screen.getByRole("button", {
                    name: /próximo/i,
                });
                expect(btnProximo).not.toBeDisabled();
            });

            const btnProximo = screen.getByRole("button", { name: /próximo/i });
            await user.click(btnProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
                expect(mockOnNext).not.toHaveBeenCalled();
            });
        });

        it("deve detectar mudança ao alterar tipos de ocorrência", async () => {
            const user = userEvent.setup();

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            render(
                <SecaoFurtoERoubo
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />,
                { wrapper: createWrapper() }
            );

            const multiSelectButton = screen.getByRole("button", {
                name: /violência física/i,
            });
            await user.click(multiSelectButton);

            const opcaoBullying = await screen.findByText("Bullying");
            await user.click(opcaoBullying);

            await waitFor(() => {
                const btnProximo = screen.getByRole("button", {
                    name: /próximo/i,
                });
                expect(btnProximo).not.toBeDisabled();
            });

            const btnProximo = screen.getByRole("button", { name: /próximo/i });
            await user.click(btnProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        uuid: "test-uuid-123",
                        body: expect.objectContaining({
                            tipos_ocorrencia: expect.arrayContaining([
                                "1cd5b78c-3d8a-483c-a2c5-1346c44a4e97",
                                "1ccb79b1-0778-4cb8-a896-c805e37c0d73",
                            ]),
                        }),
                    }),
                    expect.any(Object)
                );
            });
        });

        it("deve lidar corretamente quando formData.tiposOcorrencia é undefined", async () => {
            const user = userEvent.setup();

            vi.spyOn(
                useOcorrenciaFormStoreModule,
                "useOcorrenciaFormStore"
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: undefined,
                    descricao: "Descrição original da ocorrência",
                    smartSampa: "nao_faz_parte",
                },
                savedFormData: {
                    tiposOcorrencia: undefined,
                    descricao: "Descrição original da ocorrência",
                    smartSampa: "nao_faz_parte",
                },
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
                clearFormData: vi.fn(),
            } as never);

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            render(
                <SecaoFurtoERoubo
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />,
                { wrapper: createWrapper() }
            );

            const multiSelectButton = screen.getByRole("button", {
                name: /selecione os tipos de ocorrência/i,
            });
            await user.click(multiSelectButton);

            const opcaoBullying = await screen.findByText("Bullying");
            await user.click(opcaoBullying);

            await waitFor(() => {
                const btnProximo = screen.getByRole("button", {
                    name: /próximo/i,
                });
                expect(btnProximo).not.toBeDisabled();
            });

            const btnProximo = screen.getByRole("button", { name: /próximo/i });
            await user.click(btnProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        uuid: "test-uuid-123",
                        body: expect.objectContaining({
                            tipos_ocorrencia: [
                                "1ccb79b1-0778-4cb8-a896-c805e37c0d73",
                            ],
                        }),
                    }),
                    expect.any(Object)
                );
            });
        });

        it("deve avançar sem atualizar quando formData.tiposOcorrencia é undefined e nenhum tipo é selecionado", () => {
            vi.spyOn(
                useOcorrenciaFormStoreModule,
                "useOcorrenciaFormStore"
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: undefined,
                    descricao: "Descrição original da ocorrência",
                    smartSampa: "nao_faz_parte",
                },
                savedFormData: {
                    tiposOcorrencia: undefined,
                    descricao: "Descrição original da ocorrência",
                    smartSampa: "nao_faz_parte",
                },
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
                clearFormData: vi.fn(),
            } as never);

            render(
                <SecaoFurtoERoubo
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />,
                { wrapper: createWrapper() }
            );

            const btnProximo = screen.getByRole("button", { name: /próximo/i });
            expect(btnProximo).toBeDisabled();
        });

        it("deve comparar com savedFormData quando ocorrenciaUuid existe", async () => {
            const user = userEvent.setup();

            vi.spyOn(
                useOcorrenciaFormStoreModule,
                "useOcorrenciaFormStore"
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: "Descrição modificada localmente",
                    smartSampa: "sim_com_dano",
                },
                savedFormData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: "Descrição original do backend",
                    smartSampa: "nao_faz_parte",
                },
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
                clearFormData: vi.fn(),
            } as never);

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            render(
                <SecaoFurtoERoubo
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />,
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                const btnProximo = screen.getByRole("button", {
                    name: /próximo/i,
                });
                expect(btnProximo).not.toBeDisabled();
            });

            const btnProximo = screen.getByRole("button", { name: /próximo/i });
            await user.click(btnProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        uuid: "test-uuid-123",
                        body: expect.objectContaining({
                            smart_sampa_situacao: "sim_com_dano",
                        }),
                    }),
                    expect.any(Object)
                );
            });
        });

        it("deve comparar com formData quando ocorrenciaUuid não existe (nova ocorrência)", async () => {
            const user = userEvent.setup();

            vi.spyOn(
                useOcorrenciaFormStoreModule,
                "useOcorrenciaFormStore"
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: "Descrição da nova ocorrência",
                    smartSampa: "nao_faz_parte",
                },
                savedFormData: {},
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: undefined,
                clearFormData: vi.fn(),
            } as never);

            render(
                <SecaoFurtoERoubo
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />,
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                const btnProximo = screen.getByRole("button", {
                    name: /próximo/i,
                });
                expect(btnProximo).not.toBeDisabled();
            });

            const btnProximo = screen.getByRole("button", { name: /próximo/i });
            await user.click(btnProximo);

            await waitFor(() => {
                expect(mockMutate).not.toHaveBeenCalled();
                expect(mockSetFormData).toHaveBeenCalled();
                expect(mockOnNext).toHaveBeenCalledTimes(1);
            });
        });

        it("deve tratar descricao undefined como string vazia na comparação (ocorrenciaUuid existe)", async () => {
            const user = userEvent.setup();

            vi.spyOn(
                useOcorrenciaFormStoreModule,
                "useOcorrenciaFormStore"
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: undefined,
                    smartSampa: "nao_faz_parte",
                },
                savedFormData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: undefined,
                    smartSampa: "nao_faz_parte",
                },
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
                clearFormData: vi.fn(),
            } as never);

            render(
                <SecaoFurtoERoubo
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />,
                { wrapper: createWrapper() }
            );

            const textarea = screen.getByPlaceholderText("Descreva aqui...");
            expect(textarea).toHaveValue("");

            await user.type(
                textarea,
                "Nova descrição com mais de dez caracteres"
            );

            await waitFor(() => {
                const btnProximo = screen.getByRole("button", {
                    name: /próximo/i,
                });
                expect(btnProximo).not.toBeDisabled();
            });

            const btnProximo = screen.getByRole("button", { name: /próximo/i });
            await user.click(btnProximo);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        uuid: "test-uuid-123",
                        body: expect.objectContaining({
                            descricao_ocorrencia:
                                "Nova descrição com mais de dez caracteres",
                        }),
                    }),
                    expect.any(Object)
                );
            });
        });

        it("deve tratar descricao undefined como string vazia na comparação (ocorrenciaUuid não existe)", async () => {
            const user = userEvent.setup();

            vi.spyOn(
                useOcorrenciaFormStoreModule,
                "useOcorrenciaFormStore"
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: undefined,
                    smartSampa: "nao_faz_parte",
                },
                savedFormData: {},
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: null,
                clearFormData: vi.fn(),
            } as never);

            render(
                <SecaoFurtoERoubo
                    onPrevious={mockOnPrevious}
                    onNext={mockOnNext}
                />,
                { wrapper: createWrapper() }
            );

            const textarea = screen.getByPlaceholderText("Descreva aqui...");
            expect(textarea).toHaveValue("");

            await user.type(
                textarea,
                "Descrição válida com mais de dez caracteres"
            );

            await waitFor(() => {
                const btnProximo = screen.getByRole("button", {
                    name: /próximo/i,
                });
                expect(btnProximo).not.toBeDisabled();
            });

            const btnProximo = screen.getByRole("button", { name: /próximo/i });
            await user.click(btnProximo);

            await waitFor(() => {
                expect(mockMutate).not.toHaveBeenCalled();
                expect(mockSetFormData).toHaveBeenCalledWith(
                    expect.objectContaining({
                        descricao:
                            "Descrição válida com mais de dez caracteres",
                    })
                );
                expect(mockOnNext).toHaveBeenCalledTimes(1);
            });
        });
    });
});
