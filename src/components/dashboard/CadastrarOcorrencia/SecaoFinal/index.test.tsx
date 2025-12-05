import { vi } from "vitest";
import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { renderWithClient } from "../__tests__/helpers";
import SecaoFinal, { SecaoFinalRef } from "./index";

const setFormDataMock = vi.fn();
const setSavedFormDataMock = vi.fn();
let mockFormData: Record<string, unknown> = {};
let mockSavedFormData: Record<string, unknown> | null = null;
let mockOcorrenciaUuid: string | null = null;

const mockDeclarantes = [
    {
        uuid: "4cc15f41-e356-4cf5-82f9-06db6cf6c917",
        declarante: "Gabinete DRE",
    },
    {
        uuid: "62da7064-dedf-489e-9b0c-41752e87243f",
        declarante: "GCM",
    },
    {
        uuid: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
        declarante: "GIPE",
    },
    {
        uuid: "5818782c-f44e-4a55-ac8d-87ce64c5616a",
        declarante: "NAAPA",
    },
    {
        uuid: "cb747e41-5d72-434b-9f09-a1c240fcf8dd",
        declarante: "ProtegeEscola",
    },
    {
        uuid: "71f136e1-eb78-4ba6-967e-d8d1ce19994b",
        declarante: "Unidade Educacional",
    },
];

vi.mock("@/stores/useOcorrenciaFormStore", () => ({
    useOcorrenciaFormStore: () => ({
        formData: mockFormData,
        setFormData: setFormDataMock,
        savedFormData: mockSavedFormData,
        setSavedFormData: setSavedFormDataMock,
        ocorrenciaUuid: mockOcorrenciaUuid,
    }),
}));

vi.mock("@/hooks/useDeclarantes", () => ({
    useDeclarantes: vi.fn(() => ({
        data: mockDeclarantes,
        isLoading: false,
        isError: false,
    })),
}));

const mockMutate = vi.fn();
const mockIsPending = false;

vi.mock("@/hooks/useAtualizarSecaoFinal", () => ({
    useAtualizarSecaoFinal: () => ({
        mutate: mockMutate,
        isPending: mockIsPending,
    }),
}));

const queryClient = new QueryClient();

describe("SecaoFinal", () => {
    const mockOnNext = vi.fn();
    const mockOnPrevious = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        mockFormData = {};
        mockSavedFormData = null;
        mockOcorrenciaUuid = null;
        setFormDataMock.mockClear();
        setSavedFormDataMock.mockClear();
        mockMutate.mockClear();
    });

    it("deve renderizar todos os campos corretamente", () => {
        renderWithClient(
            <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
        );

        expect(screen.getByText(/Quem é o declarante\?/i)).toBeInTheDocument();
        expect(
            screen.getByText(/Houve comunicação com a segurança pública\?/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Qual protocolo acionado\?/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /É possível imprimir uma cópia das respostas depois de enviá-las/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /Anterior/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Próximo/i })
        ).toBeInTheDocument();
    });

    it("deve inicializar o formulário com valores do store quando disponíveis", () => {
        mockFormData = {
            declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
            comunicacaoSeguranca: "Sim, com a GCM",
            protocoloAcionado: "Ameaça",
        };

        renderWithClient(
            <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
        );

        const declaranteSelect = screen.getByRole("combobox", {
            name: /Quem é o declarante\?/i,
        });
        expect(declaranteSelect).toHaveTextContent("GIPE");

        const comunicacaoSelect = screen.getByRole("combobox", {
            name: /Houve comunicação com a segurança pública\?/i,
        });
        expect(comunicacaoSelect).toHaveTextContent("Sim, com a GCM");

        const protocoloSelect = screen.getByRole("combobox", {
            name: /Qual protocolo acionado\?/i,
        });
        expect(protocoloSelect).toHaveTextContent("Ameaça");
    });

    it("deve validar e habilitar o botão Próximo apenas quando todos os campos estiverem preenchidos", async () => {
        renderWithClient(
            <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
        );

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        expect(nextButton).toBeDisabled();

        const declaranteSelect = screen.getByRole("combobox", {
            name: /Quem é o declarante\?/i,
        });
        fireEvent.click(declaranteSelect);

        const declaranteOption = await screen.findByRole("option", {
            name: /GIPE/i,
        });
        fireEvent.click(declaranteOption);

        await waitFor(() => expect(nextButton).toBeDisabled());

        const comunicacaoSelect = screen.getByRole("combobox", {
            name: /Houve comunicação com a segurança pública\?/i,
        });
        fireEvent.click(comunicacaoSelect);

        const comunicacaoOption = await screen.findByRole("option", {
            name: /Sim, com a GCM/i,
        });
        fireEvent.click(comunicacaoOption);

        await waitFor(() => expect(nextButton).toBeDisabled());

        const protocoloSelect = screen.getByRole("combobox", {
            name: /Qual protocolo acionado\?/i,
        });
        fireEvent.click(protocoloSelect);

        const protocoloOption = await screen.findByRole("option", {
            name: /Ameaça/i,
        });
        fireEvent.click(protocoloOption);

        await waitFor(() => expect(nextButton).toBeEnabled());
    });

    it("deve exibir todas as opções do campo declarante", async () => {
        renderWithClient(
            <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
        );

        const declaranteSelect = screen.getByRole("combobox", {
            name: /Quem é o declarante\?/i,
        });
        fireEvent.click(declaranteSelect);

        await waitFor(() =>
            expect(
                screen.getByRole("option", { name: /Gabinete DRE/i })
            ).toBeInTheDocument()
        );
        expect(
            screen.getByRole("option", { name: /^GCM$/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: /^GIPE$/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: /NAAPA/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: /ProtegeEscola/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: /Unidade Educacional/i })
        ).toBeInTheDocument();
    });

    it("deve exibir todas as opções do campo comunicação com segurança", async () => {
        renderWithClient(
            <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
        );

        const comunicacaoSelect = screen.getByRole("combobox", {
            name: /Houve comunicação com a segurança pública\?/i,
        });
        fireEvent.click(comunicacaoSelect);

        await waitFor(() =>
            expect(
                screen.getByRole("option", { name: /Sim, com a GCM/i })
            ).toBeInTheDocument()
        );
        expect(
            screen.getByRole("option", { name: /Sim, com a PM/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: /^Não$/i })
        ).toBeInTheDocument();
    });

    it("deve exibir todas as opções do campo protocolo acionado", async () => {
        renderWithClient(
            <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
        );

        const protocoloSelect = screen.getByRole("combobox", {
            name: /Qual protocolo acionado\?/i,
        });
        fireEvent.click(protocoloSelect);

        await waitFor(() =>
            expect(
                screen.getByRole("option", { name: /^Ameaça$/i })
            ).toBeInTheDocument()
        );
        expect(
            screen.getByRole("option", { name: /^Alerta$/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("option", {
                name: /Apenas para registro\/não se aplica/i,
            })
        ).toBeInTheDocument();
    });

    it("deve chamar setFormData e onNext ao submeter o formulário com sucesso", async () => {
        renderWithClient(
            <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
        );

        const declaranteSelect = screen.getByRole("combobox", {
            name: /Quem é o declarante\?/i,
        });
        fireEvent.click(declaranteSelect);
        const declaranteOption = await screen.findByRole("option", {
            name: /GIPE/i,
        });
        fireEvent.click(declaranteOption);

        const comunicacaoSelect = screen.getByRole("combobox", {
            name: /Houve comunicação com a segurança pública\?/i,
        });
        fireEvent.click(comunicacaoSelect);
        const comunicacaoOption = await screen.findByRole("option", {
            name: /Sim, com a GCM/i,
        });
        fireEvent.click(comunicacaoOption);

        const protocoloSelect = screen.getByRole("combobox", {
            name: /Qual protocolo acionado\?/i,
        });
        fireEvent.click(protocoloSelect);
        const protocoloOption = await screen.findByRole("option", {
            name: /Ameaça/i,
        });
        fireEvent.click(protocoloOption);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());

        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(setFormDataMock).toHaveBeenCalledWith({
                declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
                comunicacaoSeguranca: "Sim, com a GCM",
                protocoloAcionado: "Ameaça",
            });
            expect(mockOnNext).toHaveBeenCalled();
        });
    });

    it("deve chamar setFormData e onPrevious ao clicar no botão Anterior", async () => {
        renderWithClient(
            <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
        );

        const previousButton = screen.getByRole("button", {
            name: /Anterior/i,
        });
        fireEvent.click(previousButton);

        await waitFor(() => {
            expect(setFormDataMock).toHaveBeenCalled();
            expect(mockOnPrevious).toHaveBeenCalled();
        });
    });

    it("deve preservar valores ao clicar em Anterior e salvar no store", async () => {
        renderWithClient(
            <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
        );

        const declaranteSelect = screen.getByRole("combobox", {
            name: /Quem é o declarante\?/i,
        });
        fireEvent.click(declaranteSelect);
        const declaranteOption = await screen.findByRole("option", {
            name: /NAAPA/i,
        });
        fireEvent.click(declaranteOption);

        const previousButton = screen.getByRole("button", {
            name: /Anterior/i,
        });
        fireEvent.click(previousButton);

        await waitFor(() => {
            expect(setFormDataMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    declarante: "5818782c-f44e-4a55-ac8d-87ce64c5616a",
                })
            );
            expect(mockOnPrevious).toHaveBeenCalled();
        });
    });

    it("deve exibir mensagens de erro quando tentar submeter formulário incompleto", async () => {
        renderWithClient(
            <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
        );

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        expect(nextButton).toBeDisabled();

        const declaranteSelect = screen.getByRole("combobox", {
            name: /Quem é o declarante\?/i,
        });
        fireEvent.click(declaranteSelect);
        const declaranteOption = await screen.findByRole("option", {
            name: /GIPE/i,
        });
        fireEvent.click(declaranteOption);

        await waitFor(() => expect(nextButton).toBeDisabled());
        expect(mockOnNext).not.toHaveBeenCalled();
    });

    it("schema valida corretamente dados completos", async () => {
        const mod = await import("./schema");
        const formSchema = mod.formSchema;

        const result = formSchema.safeParse({
            declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
            comunicacaoSeguranca: "Sim, com a GCM",
            protocoloAcionado: "Ameaça",
        });

        expect(result.success).toBe(true);
    });

    it("schema rejeita quando falta o campo declarante", async () => {
        const mod = await import("./schema");
        const formSchema = mod.formSchema;

        const result = formSchema.safeParse({
            declarante: "",
            comunicacaoSeguranca: "Sim, com a GCM",
            protocoloAcionado: "Ameaça",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(
                (i: { message: string }) => i.message
            );
            expect(messages).toContain("Selecione o declarante.");
        }
    });

    it("schema rejeita quando falta o campo comunicação com segurança", async () => {
        const mod = await import("./schema");
        const formSchema = mod.formSchema;

        const result = formSchema.safeParse({
            declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
            comunicacaoSeguranca: "",
            protocoloAcionado: "Ameaça",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(
                (i: { message: string }) => i.message
            );
            expect(messages).toContain(
                "Informe se houve comunicação com a segurança pública."
            );
        }
    });

    it("schema rejeita quando falta o campo protocolo acionado", async () => {
        const mod = await import("./schema");
        const formSchema = mod.formSchema;

        const result = formSchema.safeParse({
            declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
            comunicacaoSeguranca: "Sim, com a GCM",
            protocoloAcionado: "",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(
                (i: { message: string }) => i.message
            );
            expect(messages).toContain("Selecione o protocolo acionado.");
        }
    });

    describe("Atualização de ocorrência existente", () => {
        beforeEach(() => {
            mockFormData = {
                unidadeEducacional: "123456",
                dre: "DRE-01",
            };
            mockOcorrenciaUuid = "test-uuid-123";
        });

        it("deve chamar mutate quando houver ocorrenciaUuid e houver mudanças", async () => {
            mockSavedFormData = {
                declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
                comunicacaoSeguranca: "Sim, com a GCM",
                protocoloAcionado: "Ameaça",
            };

            mockFormData = {
                ...mockFormData,
                ...mockSavedFormData,
            };

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            renderWithClient(
                <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
            );

            const declaranteSelect = screen.getByRole("combobox", {
                name: /Quem é o declarante\?/i,
            });
            fireEvent.click(declaranteSelect);
            const declaranteOption = await screen.findByRole("option", {
                name: /NAAPA/i,
            });
            fireEvent.click(declaranteOption);

            const comunicacaoSelect = screen.getByRole("combobox", {
                name: /Houve comunicação com a segurança pública\?/i,
            });
            fireEvent.click(comunicacaoSelect);
            const comunicacaoOption = await screen.findByRole("option", {
                name: /Sim, com a PM/i,
            });
            fireEvent.click(comunicacaoOption);

            const protocoloSelect = screen.getByRole("combobox", {
                name: /Qual protocolo acionado\?/i,
            });
            fireEvent.click(protocoloSelect);
            const protocoloOption = await screen.findByRole("option", {
                name: /Alerta/i,
            });
            fireEvent.click(protocoloOption);

            const nextButton = screen.getByRole("button", { name: /Próximo/i });
            await waitFor(() => expect(nextButton).toBeEnabled());

            fireEvent.click(nextButton);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        uuid: "test-uuid-123",
                        body: expect.objectContaining({
                            unidade_codigo_eol: "123456",
                            dre_codigo_eol: "DRE-01",
                            declarante: "5818782c-f44e-4a55-ac8d-87ce64c5616a",
                            comunicacao_seguranca_publica: "sim_pm",
                            protocolo_acionado: "alerta",
                        }),
                    }),
                    expect.any(Object)
                );
            });
        });

        it("deve não chamar mutate quando não houver mudanças", async () => {
            mockSavedFormData = {
                declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
                comunicacaoSeguranca: "Sim, com a GCM",
                protocoloAcionado: "Ameaça",
            };

            mockFormData = {
                ...mockFormData,
                ...mockSavedFormData,
            };

            renderWithClient(
                <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
            );

            const nextButton = screen.getByRole("button", { name: /Próximo/i });
            await waitFor(() => expect(nextButton).toBeEnabled());

            fireEvent.click(nextButton);

            await waitFor(() => {
                expect(mockMutate).not.toHaveBeenCalled();
                expect(mockOnNext).toHaveBeenCalled();
            });
        });

        it("deve não chamar onNext quando a atualização falhar", async () => {
            mockSavedFormData = {
                declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
                comunicacaoSeguranca: "Sim, com a GCM",
                protocoloAcionado: "Ameaça",
            };

            mockFormData = {
                ...mockFormData,
                ...mockSavedFormData,
            };

            const errorMessage = "Erro ao atualizar seção final";
            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: false, error: errorMessage });
            });

            renderWithClient(
                <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
            );

            const comunicacaoSelect = screen.getByRole("combobox", {
                name: /Houve comunicação com a segurança pública\?/i,
            });
            fireEvent.click(comunicacaoSelect);
            const comunicacaoOption = await screen.findByRole("option", {
                name: /Sim, com a PM/i,
            });
            fireEvent.click(comunicacaoOption);

            const nextButton = screen.getByRole("button", { name: /Próximo/i });
            await waitFor(() => expect(nextButton).toBeEnabled());

            fireEvent.click(nextButton);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
                expect(mockOnNext).not.toHaveBeenCalled();
            });
        });

        it("deve mapear corretamente os valores do formulário para a API", async () => {
            mockSavedFormData = null;

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            renderWithClient(
                <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
            );

            const declaranteSelect = screen.getByRole("combobox", {
                name: /Quem é o declarante\?/i,
            });
            fireEvent.click(declaranteSelect);
            const declaranteOption = await screen.findByRole("option", {
                name: /GIPE/i,
            });
            fireEvent.click(declaranteOption);

            const comunicacaoSelect = screen.getByRole("combobox", {
                name: /Houve comunicação com a segurança pública\?/i,
            });
            fireEvent.click(comunicacaoSelect);
            const naoOption = await screen.findByRole("option", {
                name: /^Não$/i,
            });
            fireEvent.click(naoOption);

            const protocoloSelect = screen.getByRole("combobox", {
                name: /Qual protocolo acionado\?/i,
            });
            fireEvent.click(protocoloSelect);
            const registroOption = await screen.findByRole("option", {
                name: /Apenas para registro\/não se aplica/i,
            });
            fireEvent.click(registroOption);

            const nextButton = screen.getByRole("button", { name: /Próximo/i });
            await waitFor(() => expect(nextButton).toBeEnabled());

            fireEvent.click(nextButton);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        body: expect.objectContaining({
                            comunicacao_seguranca_publica: "nao",
                            protocolo_acionado: "registro",
                        }),
                    }),
                    expect.any(Object)
                );
            });
        });

        it("deve enviar strings vazias quando unidadeEducacional e dre não existirem", async () => {
            mockFormData = {
                unidadeEducacional: undefined,
                dre: null,
            };
            mockSavedFormData = null;

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            renderWithClient(
                <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
            );

            const declaranteSelect = screen.getByRole("combobox", {
                name: /Quem é o declarante\?/i,
            });
            fireEvent.click(declaranteSelect);
            const declaranteOption = await screen.findByRole("option", {
                name: /GIPE/i,
            });
            fireEvent.click(declaranteOption);

            const comunicacaoSelect = screen.getByRole("combobox", {
                name: /Houve comunicação com a segurança pública\?/i,
            });
            fireEvent.click(comunicacaoSelect);
            const gcmOption = await screen.findByRole("option", {
                name: /Sim, com a GCM/i,
            });
            fireEvent.click(gcmOption);

            const protocoloSelect = screen.getByRole("combobox", {
                name: /Qual protocolo acionado\?/i,
            });
            fireEvent.click(protocoloSelect);
            const ameacaOption = await screen.findByRole("option", {
                name: /Ameaça/i,
            });
            fireEvent.click(ameacaOption);

            const nextButton = screen.getByRole("button", { name: /Próximo/i });
            await waitFor(() => expect(nextButton).toBeEnabled());

            fireEvent.click(nextButton);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        body: expect.objectContaining({
                            unidade_codigo_eol: "",
                            dre_codigo_eol: "",
                            comunicacao_seguranca_publica: "sim_gcm",
                            protocolo_acionado: "ameaca",
                        }),
                    }),
                    expect.any(Object)
                );
            });
        });

        it("deve chamar setSavedFormData após atualização com sucesso", async () => {
            mockSavedFormData = {
                declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
                comunicacaoSeguranca: "Sim, com a GCM",
                protocoloAcionado: "Ameaça",
            };

            mockFormData = {
                ...mockFormData,
                ...mockSavedFormData,
            };

            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            renderWithClient(
                <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
            );

            const comunicacaoSelect = screen.getByRole("combobox", {
                name: /Houve comunicação com a segurança pública\?/i,
            });
            fireEvent.click(comunicacaoSelect);
            const comunicacaoOption = await screen.findByRole("option", {
                name: /Não/i,
            });
            fireEvent.click(comunicacaoOption);

            const nextButton = screen.getByRole("button", { name: /Próximo/i });
            await waitFor(() => expect(nextButton).toBeEnabled());

            fireEvent.click(nextButton);

            await waitFor(() => {
                expect(setSavedFormDataMock).toHaveBeenCalled();
                expect(mockOnNext).toHaveBeenCalled();
            });
        });

        it("deve não chamar onNext quando houver erro na requisição", async () => {
            mockSavedFormData = {
                declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
                comunicacaoSeguranca: "Sim, com a GCM",
                protocoloAcionado: "Ameaça",
            };

            mockFormData = {
                ...mockFormData,
                ...mockSavedFormData,
            };

            mockMutate.mockImplementation((_, options) => {
                options?.onError?.();
            });

            renderWithClient(
                <SecaoFinal onNext={mockOnNext} onPrevious={mockOnPrevious} />
            );

            const comunicacaoSelect = screen.getByRole("combobox", {
                name: /Houve comunicação com a segurança pública\?/i,
            });
            fireEvent.click(comunicacaoSelect);
            const comunicacaoOption = await screen.findByRole("option", {
                name: /Sim, com a PM/i,
            });
            fireEvent.click(comunicacaoOption);

            const nextButton = screen.getByRole("button", { name: /Próximo/i });
            await waitFor(() => expect(nextButton).toBeEnabled());

            fireEvent.click(nextButton);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
                expect(mockOnNext).not.toHaveBeenCalled();
                expect(setSavedFormDataMock).not.toHaveBeenCalled();
            });
        });
    });

    describe("métodos expostos via ref", () => {
        it("deve retornar dados do formulário via getFormData", () => {
            const ref = React.createRef<SecaoFinalRef>();

            renderWithClient(<SecaoFinal ref={ref} />);

            const formData = ref.current?.getFormData();

            expect(formData).toBeDefined();
            expect(formData).toHaveProperty("declarante");
            expect(formData).toHaveProperty("comunicacaoSeguranca");
            expect(formData).toHaveProperty("protocoloAcionado");
        });

        it("deve retornar instância do formulário via getFormInstance", () => {
            const ref = React.createRef<SecaoFinalRef>();

            renderWithClient(<SecaoFinal ref={ref} />);

            const formInstance = ref.current?.getFormInstance();

            expect(formInstance).toBeDefined();
            expect(formInstance).toHaveProperty("getValues");
            expect(formInstance).toHaveProperty("trigger");
            expect(formInstance).toHaveProperty("formState");
        });

        it("deve validar e submeter via submitForm quando dados são válidos", async () => {
            mockOcorrenciaUuid = "test-uuid-123";
            mockMutate.mockImplementation((_, options) => {
                options?.onSuccess?.({ success: true });
            });

            const ref = React.createRef<SecaoFinalRef>();
            const onNext = vi.fn();

            renderWithClient(<SecaoFinal ref={ref} onNext={onNext} />);

            const declaranteSelect = screen.getByRole("combobox", {
                name: /Quem é o declarante\?/i,
            });
            await act(async () => {
                fireEvent.click(declaranteSelect);
            });

            const declaranteOption = await screen.findByRole("option", {
                name: /NAAPA/i,
            });
            await act(async () => {
                fireEvent.click(declaranteOption);
            });

            const comunicacaoSelect = screen.getByRole("combobox", {
                name: /Houve comunicação com a segurança pública\?/i,
            });
            await act(async () => {
                fireEvent.click(comunicacaoSelect);
            });

            const comunicacaoOption = await screen.findByRole("option", {
                name: /Sim, com a GCM/i,
            });
            await act(async () => {
                fireEvent.click(comunicacaoOption);
            });

            const protocoloSelect = screen.getByRole("combobox", {
                name: /Qual protocolo acionado\?/i,
            });
            await act(async () => {
                fireEvent.click(protocoloSelect);
            });

            const protocoloOption = await screen.findByRole("option", {
                name: /Alerta/i,
            });
            await act(async () => {
                fireEvent.click(protocoloOption);
            });

            await waitFor(() => {
                expect(ref.current).not.toBeNull();
            });

            let result: boolean | undefined;
            await act(async () => {
                result = await ref.current?.submitForm();
            });

            expect(result).toBe(true);
            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("deve retornar false em submitForm quando dados são inválidos", async () => {
            const ref = React.createRef<SecaoFinalRef>();

            renderWithClient(<SecaoFinal ref={ref} />);

            await waitFor(() => {
                expect(ref.current).not.toBeNull();
            });

            let result: boolean | undefined;
            await act(async () => {
                result = await ref.current?.submitForm();
            });

            expect(result).toBe(false);
            expect(mockMutate).not.toHaveBeenCalled();
        });
    });
});
