import * as useAtualizarSecaoFurtoRouboHook from "@/hooks/useAtualizarSecaoFurtoRoubo";
import * as useTiposOcorrenciaHook from "@/hooks/useTiposOcorrencia";
import * as useOcorrenciaFormStoreModule from "@/stores/useOcorrenciaFormStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SecaoFurtoERoubo, { SecaoFurtoERouboRef } from "./index";

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
            useOcorrenciaFormStoreModule.useOcorrenciaFormStore,
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
            "useAtualizarSecaoFurtoRoubo",
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
            { wrapper: createWrapper() },
        );

        expect(
            screen.getByText("Qual o tipo de ocorrência?*"),
        ).toBeInTheDocument();
        expect(screen.getByText("Descreva a ocorrência*")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Unidade Educacional é contemplada pelo Smart Sampa?*",
            ),
        ).toBeInTheDocument();
    });

    it("deve renderizar todas as opções de tipo de ocorrência", async () => {
        const user = userEvent.setup();
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() },
        );

        const selectButton = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });
        await user.click(selectButton);

        await waitFor(() => {
            expect(
                screen.getByRole("option", { name: "Violência física" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: "Violência psicológica" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: "Violência sexual" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: "Negligência" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: "Bullying" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: "Cyberbullying" }),
            ).toBeInTheDocument();
        });
    });

    it("deve renderizar as opções do Smart Sampa", () => {
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() },
        );

        expect(screen.getByText("Sim")).toBeInTheDocument();
        expect(screen.getByText("Não")).toBeInTheDocument();
    });

    it("deve desabilitar o botão Próximo quando o formulário está inválido", () => {
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() },
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
            { wrapper: createWrapper() },
        );

        const selectButton = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });
        await user.click(selectButton);

        const option = await screen.findByRole("option", {
            name: "Violência física",
        });
        await user.click(option);

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(textarea, "Descrição detalhada da ocorrência");

        const radioNao = screen.getByRole("radio", {
            name: /não/i,
        });
        await user.click(radioNao);

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
            { wrapper: createWrapper() },
        );

        const btnAnterior = screen.getByRole("button", { name: /anterior/i });
        fireEvent.click(btnAnterior);

        expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    });
    it("deve exibir erro quando descrição é muito curta", async () => {
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() },
        );

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        fireEvent.change(textarea, { target: { value: "Curto" } });
        fireEvent.blur(textarea);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "A descrição deve ter pelo menos 10 caracteres.",
                ),
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
            { wrapper: createWrapper() },
        );

        const selectButton = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });
        await user.click(selectButton);

        const opcaoFisica = await screen.findByRole("option", {
            name: /violência física/i,
        });
        await user.click(opcaoFisica);

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(
            textarea,
            "Descrição detalhada da ocorrência com mais de dez caracteres",
        );

        const radioNao = screen.getByRole("radio", {
            name: /não/i,
        });
        await user.click(radioNao);

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
            { wrapper: createWrapper() },
        );

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        fireEvent.change(textarea, {
            target: { value: "Descrição detalhada da ocorrência" },
        });

        const radioNao = screen.getByRole("radio", {
            name: /não/i,
        });
        fireEvent.click(radioNao);

        await waitFor(() => {
            const btnProximo = screen.getByRole("button", {
                name: /próximo/i,
            });
            expect(btnProximo).toBeDisabled();
        });
    });

    it("deve desabilitar o Select quando os tipos estão carregando", () => {
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
            { wrapper: createWrapper() },
        );

        const selectButton = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });

        expect(selectButton).toBeDisabled();
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
            { wrapper: createWrapper() },
        );

        expect(
            screen.getByText("Qual o tipo de ocorrência?*"),
        ).toBeInTheDocument();

        const selectButton = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });

        expect(selectButton).toBeInTheDocument();
        expect(selectButton).not.toBeDisabled();
    });

    it("deve carregar formulário com descricao vazia quando formData.descricao é undefined", () => {
        vi.mocked(
            useOcorrenciaFormStoreModule.useOcorrenciaFormStore,
        ).mockReturnValue({
            formData: {
                tiposOcorrencia: undefined,
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
            { wrapper: createWrapper() },
        );

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        expect(textarea).toHaveValue("");
    });

    it("deve carregar formulário com descricao preenchida quando formData.descricao existe", () => {
        vi.mocked(
            useOcorrenciaFormStoreModule.useOcorrenciaFormStore,
        ).mockReturnValue({
            formData: {
                tiposOcorrencia: undefined,
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
            { wrapper: createWrapper() },
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
                "useOcorrenciaFormStore",
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: "Descrição original da ocorrência",
                    smartSampa: "Não",
                },
                savedFormData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: "Descrição original da ocorrência",
                    smartSampa: "Não",
                },
                setFormData: mockSetFormData,
                setSavedFormData: mockSetSavedFormData,
                ocorrenciaUuid: "test-uuid-123",
                clearFormData: vi.fn(),
            } as never);

            vi.spyOn(
                useAtualizarSecaoFurtoRouboHook,
                "useAtualizarSecaoFurtoRoubo",
            ).mockReturnValue({
                mutate: mockMutate,
                isPending: false,
                isError: false,
                error: null,
            } as never);

            vi.spyOn(
                useTiposOcorrenciaHook,
                "useTiposOcorrencia",
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
                { wrapper: createWrapper() },
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
                            smart_sampa_situacao: "nao",
                        }),
                    }),
                    expect.any(Object),
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
                { wrapper: createWrapper() },
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
                { wrapper: createWrapper() },
            );

            const radioSim = screen.getByRole("radio", {
                name: /^sim$/i,
            });
            await user.click(radioSim);

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
                { wrapper: createWrapper() },
            );

            const radioSim = screen.getByRole("radio", {
                name: /^sim$/i,
            });
            await user.click(radioSim);

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
                { wrapper: createWrapper() },
            );

            // O botão mostra o nome do primeiro valor selecionado
            // Usa getAllByRole e pega o primeiro (que é o botão principal, não o de remover)
            const selectButtons = screen.getAllByRole("button", {
                name: /Violência física/i,
            });
            await user.click(selectButtons[0]);

            const opcaoBullying = await screen.findByRole("option", {
                name: /^Bullying$/i,
            });
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
                            // MultiSelect mantém ambos os valores (o original + o novo)
                            tipos_ocorrencia: expect.arrayContaining([
                                "1cd5b78c-3d8a-483c-a2c5-1346c44a4e97", // Violência física
                                "1ccb79b1-0778-4cb8-a896-c805e37c0d73", // Bullying
                            ]),
                        }),
                    }),
                    expect.any(Object),
                );
            });
        });

        it("deve lidar corretamente quando formData.tiposOcorrencia é undefined", async () => {
            const user = userEvent.setup();

            vi.spyOn(
                useOcorrenciaFormStoreModule,
                "useOcorrenciaFormStore",
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: undefined,
                    descricao: "Descrição original da ocorrência",
                    smartSampa: "Não",
                },
                savedFormData: {
                    tiposOcorrencia: undefined,
                    descricao: "Descrição original da ocorrência",
                    smartSampa: "Não",
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
                { wrapper: createWrapper() },
            );

            const selectButton = screen.getByRole("button", {
                name: /Selecione os tipos de ocorrência/i,
            });
            await user.click(selectButton);

            const opcaoBullying = await screen.findByRole("option", {
                name: /^Bullying$/i,
            });
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
                    expect.any(Object),
                );
            });
        });

        it("deve avançar sem atualizar quando formData.tiposOcorrencia é undefined e nenhum tipo é selecionado", () => {
            vi.spyOn(
                useOcorrenciaFormStoreModule,
                "useOcorrenciaFormStore",
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: undefined,
                    descricao: "Descrição original da ocorrência",
                    smartSampa: "Não",
                },
                savedFormData: {
                    tiposOcorrencia: undefined,
                    descricao: "Descrição original da ocorrência",
                    smartSampa: "Não",
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
                { wrapper: createWrapper() },
            );

            const btnProximo = screen.getByRole("button", { name: /próximo/i });
            expect(btnProximo).toBeDisabled();
        });

        it("deve comparar com savedFormData quando ocorrenciaUuid existe", async () => {
            const user = userEvent.setup();

            vi.spyOn(
                useOcorrenciaFormStoreModule,
                "useOcorrenciaFormStore",
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: "Descrição modificada localmente",
                    smartSampa: "Sim",
                },
                savedFormData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: "Descrição original do backend",
                    smartSampa: "Não",
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
                { wrapper: createWrapper() },
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
                            smart_sampa_situacao: "sim",
                        }),
                    }),
                    expect.any(Object),
                );
            });
        });

        it("deve comparar com formData quando ocorrenciaUuid não existe (nova ocorrência)", async () => {
            const user = userEvent.setup();

            vi.spyOn(
                useOcorrenciaFormStoreModule,
                "useOcorrenciaFormStore",
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: "Descrição da nova ocorrência",
                    smartSampa: "Não",
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
                { wrapper: createWrapper() },
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
                "useOcorrenciaFormStore",
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: undefined,
                    smartSampa: "Não",
                },
                savedFormData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: undefined,
                    smartSampa: "Não",
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
                { wrapper: createWrapper() },
            );

            const textarea = screen.getByPlaceholderText("Descreva aqui...");
            expect(textarea).toHaveValue("");

            await user.type(
                textarea,
                "Nova descrição com mais de dez caracteres",
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
                    expect.any(Object),
                );
            });
        });

        it("deve tratar descricao undefined como string vazia na comparação (ocorrenciaUuid não existe)", async () => {
            const user = userEvent.setup();

            vi.spyOn(
                useOcorrenciaFormStoreModule,
                "useOcorrenciaFormStore",
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                    descricao: undefined,
                    smartSampa: "Não",
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
                { wrapper: createWrapper() },
            );

            const textarea = screen.getByPlaceholderText("Descreva aqui...");
            expect(textarea).toHaveValue("");

            await user.type(
                textarea,
                "Descrição válida com mais de dez caracteres",
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
                    }),
                );
                expect(mockOnNext).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("métodos expostos via ref", () => {
        it("deve retornar dados do formulário via getFormData", () => {
            const ref = React.createRef<SecaoFurtoERouboRef>();
            render(
                <SecaoFurtoERoubo
                    ref={ref}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
                { wrapper: createWrapper() },
            );

            const formData = ref.current?.getFormData();

            expect(formData).toHaveProperty("tiposOcorrencia");
            expect(formData).toHaveProperty("descricao");
            expect(formData).toHaveProperty("smartSampa");
        });

        it("deve retornar instância do formulário via getFormInstance", () => {
            const ref = React.createRef<SecaoFurtoERouboRef>();
            render(
                <SecaoFurtoERoubo
                    ref={ref}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
                { wrapper: createWrapper() },
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

            vi.mocked(
                useOcorrenciaFormStoreModule.useOcorrenciaFormStore,
            ).mockReturnValue({
                formData: {},
                savedFormData: {},
                setFormData: mockSetFormData,
                setSavedFormData: vi.fn(),
                ocorrenciaUuid: "test-uuid-123",
                clearFormData: mockClearFormData,
            } as never);

            vi.spyOn(
                useAtualizarSecaoFurtoRouboHook,
                "useAtualizarSecaoFurtoRoubo",
            ).mockReturnValue({
                mutate: mockMutate,
                isPending: false,
            } as never);

            const ref = React.createRef<SecaoFurtoERouboRef>();
            render(
                <SecaoFurtoERoubo
                    ref={ref}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
                { wrapper: createWrapper() },
            );

            const selectButton = screen.getByRole("button", {
                name: /Selecione os tipos de ocorrência/i,
            });
            await user.click(selectButton);

            const tipoOption = await screen.findByRole("option", {
                name: /violência física/i,
            });
            await user.click(tipoOption);

            const descricaoField =
                screen.getByPlaceholderText("Descreva aqui...");
            await user.type(
                descricaoField,
                "Esta é uma descrição detalhada com mais de dez caracteres",
            );

            const radioNao = screen.getByRole("radio", {
                name: /não/i,
            });
            await user.click(radioNao);

            await waitFor(async () => {
                const result = await ref.current?.submitForm();
                expect(result).toBe(true);
            });

            expect(mockMutate).toHaveBeenCalled();
        });

        it("deve retornar false ao submeter via submitForm quando dados são inválidos", async () => {
            const ref = React.createRef<SecaoFurtoERouboRef>();
            render(
                <SecaoFurtoERoubo
                    ref={ref}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
                { wrapper: createWrapper() },
            );

            await waitFor(async () => {
                const result = await ref.current?.submitForm();
                expect(result).toBe(false);
            });

            expect(mockOnNext).not.toHaveBeenCalled();
        });
    });

    describe("onFormChange callback", () => {
        it("deve chamar onFormChange quando um campo é alterado", async () => {
            const mockOnFormChange = vi.fn();
            const user = userEvent.setup();

            render(
                <SecaoFurtoERoubo
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                    onFormChange={mockOnFormChange}
                />,
                { wrapper: createWrapper() },
            );

            const descricaoField =
                screen.getByPlaceholderText("Descreva aqui...");
            await user.type(descricaoField, "Nova descrição");

            await waitFor(() => {
                expect(mockOnFormChange).toHaveBeenCalled();
                expect(mockOnFormChange).toHaveBeenCalledWith(
                    expect.objectContaining({
                        descricao: expect.stringContaining("Nova descrição"),
                    }),
                );
            });
        });

        it("deve chamar onFormChange quando multiselect é alterado", async () => {
            const mockOnFormChange = vi.fn();
            const user = userEvent.setup();

            render(
                <SecaoFurtoERoubo
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                    onFormChange={mockOnFormChange}
                />,
                { wrapper: createWrapper() },
            );

            const selectButton = screen.getByRole("button", {
                name: /Selecione os tipos de ocorrência/i,
            });
            await user.click(selectButton);

            const tipoOption = await screen.findByRole("option", {
                name: /violência física/i,
            });
            await user.click(tipoOption);

            await waitFor(() => {
                expect(mockOnFormChange).toHaveBeenCalledWith(
                    expect.objectContaining({
                        tiposOcorrencia: [
                            "1cd5b78c-3d8a-483c-a2c5-1346c44a4e97",
                        ],
                    }),
                );
            });
        });

        it("deve chamar onFormChange quando radio button é alterado", async () => {
            const mockOnFormChange = vi.fn();
            const user = userEvent.setup();

            render(
                <SecaoFurtoERoubo
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                    onFormChange={mockOnFormChange}
                />,
                { wrapper: createWrapper() },
            );

            const radioSim = screen.getByRole("radio", {
                name: /^sim$/i,
            });
            await user.click(radioSim);

            await waitFor(() => {
                expect(mockOnFormChange).toHaveBeenCalledWith(
                    expect.objectContaining({
                        smartSampa: "Sim",
                    }),
                );
            });
        });

        it("não deve chamar onFormChange quando callback não é fornecido", async () => {
            const user = userEvent.setup();

            render(
                <SecaoFurtoERoubo
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
                { wrapper: createWrapper() },
            );

            const descricaoField =
                screen.getByPlaceholderText("Descreva aqui...");
            await user.type(descricaoField, "Texto qualquer");

            await waitFor(() => {
                expect(descricaoField).toHaveValue("Texto qualquer");
            });
        });
    });

    it("deve desabilitar todos os campos quando disabled=true", async () => {
        const user = userEvent.setup();
        render(
            <SecaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
                disabled={true}
            />,
        );

        const selectButton = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });
        expect(selectButton).toBeDisabled();

        const textarea = screen.getByPlaceholderText(/Descreva aqui.../i);
        expect(textarea).toBeDisabled();

        const radioButtons = screen.getAllByRole("radio");
        radioButtons.forEach((radio) => {
            expect(radio).toBeDisabled();
        });

        await user.type(textarea, "Teste");
        expect(textarea).toHaveValue("");
    });
});
