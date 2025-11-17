import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Anexos from "./index";
import * as useOcorrenciaFormStoreModule from "@/stores/useOcorrenciaFormStore";
import * as useUserStoreModule from "@/stores/useUserStore";
import * as useEnviarAnexoHook from "@/hooks/useEnviarAnexo";

vi.mock("@/stores/useOcorrenciaFormStore");
vi.mock("@/stores/useUserStore");
vi.mock("@/hooks/useEnviarAnexo");

const mockToast = vi.fn();
vi.mock("@/components/ui/headless-toast", () => ({
    toast: (params: unknown) => mockToast(params),
}));

const mockAlert = vi.spyOn(globalThis, "alert").mockImplementation(() => {});

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    Wrapper.displayName = "QueryClientWrapper";
    return Wrapper;
};

const renderWithProvider = (ui: React.ReactElement) => {
    return render(ui, { wrapper: createWrapper() });
};

describe("Anexos", () => {
    const mockOnPrevious = vi.fn();
    const mockOnNext = vi.fn();
    const mockSetFormData = vi.fn();
    const mockMutateAsync = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockToast.mockClear();
        mockAlert.mockClear();
        mockSetFormData.mockClear();
        mockMutateAsync.mockClear();

        mockMutateAsync.mockResolvedValue({
            success: true,
            data: {
                id: "123",
                url: "https://example.com/anexo.pdf",
            },
        });

        vi.spyOn(useEnviarAnexoHook, "useEnviarAnexo").mockReturnValue({
            mutateAsync: mockMutateAsync,
            mutate: vi.fn(),
            isPending: false,
            isError: false,
            isSuccess: false,
            isIdle: true,
        } as never);

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore"
        ).mockReturnValue({
            formData: {},
            setFormData: mockSetFormData,
            ocorrenciaUuid: "test-uuid-123",
        } as never);

        vi.spyOn(useUserStoreModule, "useUserStore").mockReturnValue({
            user: {
                name: "João da Silva",
                perfil_acesso: {
                    uuid: "perfil-uuid",
                    nome: "DIRETOR DE ESCOLA",
                },
            },
        } as never);
    });

    it("deve renderizar o título e descrições", () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        expect(screen.getByText("Anexos")).toBeInTheDocument();
        expect(screen.getByText("Anexar novo arquivo")).toBeInTheDocument();
        expect(
            screen.getByText(
                /Selecione e classifique o tipo de arquivo, depois clique em/i
            )
        ).toBeInTheDocument();
    });

    it("deve renderizar todos os campos do formulário", () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        expect(
            screen.getByLabelText(/Selecione o arquivo/i)
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/Nenhum arquivo selecionado/i)
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Escolher arquivo/i })
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/Tipo do documento/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Anexar documento/i })
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Formatos aceitos: PDF, JPG, PNG/i)
        ).toBeInTheDocument();
    });

    it("deve renderizar os botões Anterior e Finalizar", () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        expect(
            screen.getByRole("button", { name: /Anterior/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Finalizar/i })
        ).toBeInTheDocument();
    });

    it("deve desabilitar o botão Anexar documento quando não há arquivo selecionado", () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        expect(anexarButton).toBeDisabled();
    });

    it("deve selecionar um arquivo válido", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });

        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        await waitFor(() => {
            expect(
                screen.getByDisplayValue("documento.pdf")
            ).toBeInTheDocument();
        });
    });

    it("deve exibir alerta ao tentar anexar arquivo maior que 2MB", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const largeFile = new File(
            ["x".repeat(3 * 1024 * 1024)],
            "grande.pdf",
            {
                type: "application/pdf",
            }
        );

        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, largeFile);

        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith(
                "O arquivo deve ter no máximo 2MB"
            );
        });

        expect(
            screen.getByPlaceholderText(/Nenhum arquivo selecionado/i)
        ).toHaveValue("");
    });

    it("deve exibir alerta ao tentar anexar arquivo de formato não suportado", async () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const invalidFile = new File(["conteúdo"], "documento.txt", {
            type: "text/plain",
        });

        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;

        Object.defineProperty(fileInput, "files", {
            value: [invalidFile],
            writable: false,
        });
        fireEvent.change(fileInput);

        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith(
                "Formato não suportado. Use PDF, JPG ou PNG"
            );
        });
    });

    it("deve aceitar arquivo PDF válido", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });

        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        await waitFor(() => {
            expect(
                screen.getByDisplayValue("documento.pdf")
            ).toBeInTheDocument();
        });
    });

    it("deve aceitar arquivo JPG válido", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "foto.jpg", {
            type: "image/jpeg",
        });

        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        await waitFor(() => {
            expect(screen.getByDisplayValue("foto.jpg")).toBeInTheDocument();
        });
    });

    it("deve aceitar arquivo PNG válido", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "imagem.png", {
            type: "image/png",
        });

        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        await waitFor(() => {
            expect(screen.getByDisplayValue("imagem.png")).toBeInTheDocument();
        });
    });

    it("deve habilitar o botão Anexar documento quando arquivo e tipo são selecionados", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });

        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);

        const opcaoBoletim = await screen.findByRole("option", {
            name: /Boletim de Ocorrência/i,
        });
        await user.click(opcaoBoletim);

        await waitFor(() => {
            const anexarButton = screen.getByRole("button", {
                name: /Anexar documento/i,
            });
            expect(anexarButton).not.toBeDisabled();
        });
    });

    it("deve anexar documento e exibir na lista de preview", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });

        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);

        const opcaoBoletim = await screen.findByRole("option", {
            name: /Boletim de Ocorrência/i,
        });
        await user.click(opcaoBoletim);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });

        await waitFor(() => {
            expect(anexarButton).not.toBeDisabled();
        });

        await user.click(anexarButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalled();
        });

        await waitFor(
            () => {
                expect(
                    screen.getByText(
                        "Estes são os documentos já anexados na ocorrência."
                    )
                ).toBeInTheDocument();
                expect(screen.getByText("documento.pdf")).toBeInTheDocument();
                const anexoHeading = screen.getByRole("heading", {
                    name: /documento\.pdf/i,
                });
                expect(anexoHeading).toBeInTheDocument();
                expect(
                    screen.getByRole("button", { name: /Excluir arquivo/i })
                ).toBeInTheDocument();
            },
            { timeout: 3000 }
        );
    });

    it("deve resetar o formulário após anexar documento", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });

        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);

        const opcaoBoletim = await screen.findByRole("option", {
            name: /Boletim de Ocorrência/i,
        });
        await user.click(opcaoBoletim);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        await user.click(anexarButton);

        await waitFor(() => {
            expect(
                screen.getByPlaceholderText(/Nenhum arquivo selecionado/i)
            ).toHaveValue("");
            expect(anexarButton).toBeDisabled();
        });
    });

    it("deve exibir múltiplos anexos na lista", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file1 = new File(["conteúdo1"], "documento1.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file1);

        let tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);
        let opcao = await screen.findByRole("option", {
            name: /Boletim de Ocorrência/i,
        });
        await user.click(opcao);

        let anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        await user.click(anexarButton);

        await waitFor(() => {
            expect(screen.getByText("documento1.pdf")).toBeInTheDocument();
        });

        const file2 = new File(["conteúdo2"], "foto.jpg", {
            type: "image/jpeg",
        });
        await user.upload(fileInput, file2);

        tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);
        opcao = await screen.findByRole("option", {
            name: /Registro de ocorrência interno/i,
        });
        await user.click(opcao);

        anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        await user.click(anexarButton);

        await waitFor(() => {
            expect(screen.getByText("documento1.pdf")).toBeInTheDocument();
            expect(screen.getByText("foto.jpg")).toBeInTheDocument();
            const anexoCards = screen.getAllByRole("heading", { level: 4 });
            expect(anexoCards).toHaveLength(2);
            expect(anexoCards[0]).toHaveTextContent("documento1.pdf");
            expect(anexoCards[1]).toHaveTextContent("foto.jpg");
        });
    });

    it("deve remover anexo ao clicar em Excluir", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);
        const opcao = await screen.findByRole("option", {
            name: /Boletim de Ocorrência/i,
        });
        await user.click(opcao);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        await user.click(anexarButton);

        await waitFor(() => {
            expect(screen.getByText("documento.pdf")).toBeInTheDocument();
        });

        const excluirButton = screen.getByRole("button", {
            name: /Excluir arquivo/i,
        });
        await user.click(excluirButton);

        await waitFor(() => {
            expect(screen.queryByText("documento.pdf")).not.toBeInTheDocument();
            expect(
                screen.queryByText(
                    "Estes são os documentos já anexados na ocorrência."
                )
            ).not.toBeInTheDocument();
        });
    });

    it("deve exibir data e hora do anexo", async () => {
        const user = userEvent.setup();
        const mockDate = new Date("2025-11-13T14:30:00");
        vi.setSystemTime(mockDate);

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);
        const opcao = await screen.findByRole("option", {
            name: /Boletim de Ocorrência/i,
        });
        await user.click(opcao);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        await user.click(anexarButton);

        await waitFor(() => {
            expect(screen.getByText("13/11/2025 14:30")).toBeInTheDocument();
        });

        vi.useRealTimers();
    });

    it("deve usar 'Usuário' quando não há nome de usuário", async () => {
        vi.spyOn(useUserStoreModule, "useUserStore").mockReturnValue({
            user: null,
        } as never);

        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);
        const opcao = await screen.findByRole("option", {
            name: /Boletim de Ocorrência/i,
        });
        await user.click(opcao);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        await user.click(anexarButton);

        await waitFor(() => {
            expect(
                screen.getByText(/Anexado por: Usuário/i)
            ).toBeInTheDocument();
        });
    });

    it("deve renderizar todos os tipos de documento", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);

        await waitFor(() => {
            expect(
                screen.getByRole("option", { name: /Boletim de ocorrência/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", {
                    name: /Registro de ocorrência interno/i,
                })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", {
                    name: /Protocolo Conselho Tutelar/i,
                })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", {
                    name: /Instrução Normativa 20\/2020/i,
                })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: /Relatório do NAAPA/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: /Relatório do CEFAI/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: /Relatório do STS/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: /Relatório do CPCA/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", {
                    name: /Ofício Guarda Civil Metropolitana/i,
                })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", {
                    name: /Registro de intercorrência/i,
                })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", {
                    name: /Relatório da Supervisão Escolar/i,
                })
            ).toBeInTheDocument();
        });
    });

    it("deve chamar onPrevious ao clicar no botão Anterior", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const anteriorButton = screen.getByRole("button", {
            name: /Anterior/i,
        });
        await user.click(anteriorButton);

        expect(mockOnPrevious).toHaveBeenCalledTimes(1);
        expect(mockSetFormData).toHaveBeenCalled();
    });

    it("deve chamar onNext ao submeter o formulário", async () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const form = document.querySelector("form") as HTMLFormElement;

        fireEvent.submit(form);

        await waitFor(() => {
            expect(mockSetFormData).toHaveBeenCalled();
            expect(mockOnNext).toHaveBeenCalled();
        });
    });

    it("deve preencher campos com dados do store", () => {
        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore"
        ).mockReturnValue({
            formData: {
                tipoDocumento: "boletim_ocorrencia",
            },
            setFormData: mockSetFormData,
            ocorrenciaUuid: "test-uuid-123",
        } as never);

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const tipoSelect = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        expect(tipoSelect).toHaveTextContent("Boletim de ocorrência");
    });

    it("deve exibir link de ajuda sobre arquivos suportados", () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        expect(
            screen.getByText(
                /Para conferir mais detalhes sobre os arquivos suportados/i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /clique aqui/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar ícone de anexo no preview", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);
        const opcao = await screen.findByRole("option", {
            name: /Boletim de Ocorrência/i,
        });
        await user.click(opcao);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        await user.click(anexarButton);

        await waitFor(() => {
            const container = screen.getByText("documento.pdf").closest("div");
            expect(container).toBeInTheDocument();
        });
    });

    it("não deve anexar documento se não houver arquivo selecionado", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);
        const opcao = await screen.findByRole("option", {
            name: /Boletim de Ocorrência/i,
        });
        await user.click(opcao);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        expect(anexarButton).toBeDisabled();
    });

    it("não deve anexar documento se não houver tipo selecionado", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        expect(anexarButton).toBeDisabled();
    });

    it("deve abrir o seletor de arquivo ao clicar no botão Escolher arquivo", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const escolherButton = screen.getByRole("button", {
            name: /Escolher arquivo/i,
        });

        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        const clickSpy = vi.spyOn(fileInput, "click");

        await user.click(escolherButton);

        expect(clickSpy).toHaveBeenCalled();
    });

    it("deve exibir erro quando não há ocorrenciaUuid", async () => {
        const user = userEvent.setup();

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore"
        ).mockReturnValue({
            formData: {},
            setFormData: mockSetFormData,
            ocorrenciaUuid: null,
        } as never);

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);

        const opcaoBoletim = await screen.findByRole("option", {
            name: /Boletim de ocorrência/i,
        });
        await user.click(opcaoBoletim);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        await user.click(anexarButton);

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: "Não conseguimos anexar o arquivo",
                description:
                    "UUID da intercorrência não encontrado. Salve a ocorrência primeiro.",
                variant: "error",
            });
        });

        expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it("deve usar tipoDocumento como fallback quando label não é encontrado", async () => {
        const user = userEvent.setup();

        const mockMutateAsyncCustom = vi.fn().mockResolvedValue({
            success: true,
            data: {
                id: "123",
                url: "https://example.com/anexo.pdf",
            },
        });

        vi.spyOn(useEnviarAnexoHook, "useEnviarAnexo").mockReturnValue({
            mutateAsync: mockMutateAsyncCustom,
            mutate: vi.fn(),
            isPending: false,
            isError: false,
            isSuccess: false,
            isIdle: true,
        } as never);

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore"
        ).mockReturnValue({
            formData: {
                tipoDocumento: "tipo_inexistente_xyz",
            },
            setFormData: mockSetFormData,
            ocorrenciaUuid: "test-uuid-123",
        } as never);

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });

        await waitFor(() => {
            expect(anexarButton).not.toBeDisabled();
        });

        await user.click(anexarButton);

        await waitFor(() => {
            expect(mockMutateAsyncCustom).toHaveBeenCalledWith(
                expect.objectContaining({
                    categoria: "tipo_inexistente_xyz",
                })
            );
        });

        await waitFor(() => {
            const tiposExibidos = screen.queryAllByText("tipo_inexistente_xyz");
            expect(tiposExibidos.length).toBeGreaterThan(0);
        });
    });
    it("deve exibir erro quando o envio do anexo falha", async () => {
        const user = userEvent.setup();

        mockMutateAsync.mockResolvedValueOnce({
            success: false,
            error: "Erro ao processar o arquivo",
        });

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);

        const opcaoBoletim = await screen.findByRole("option", {
            name: /Boletim de ocorrência/i,
        });
        await user.click(opcaoBoletim);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });

        await waitFor(() => {
            expect(anexarButton).not.toBeDisabled();
        });

        await user.click(anexarButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: "Não conseguimos anexar o arquivo",
                description: "Erro ao processar o arquivo",
                variant: "error",
            });
        });

        await waitFor(() => {
            expect(screen.queryByText("documento.pdf")).not.toBeInTheDocument();
        });
    });

    it("deve usar 'diretor' como perfil padrão quando perfil_acesso.nome não está mapeado", async () => {
        const user = userEvent.setup();

        vi.spyOn(useUserStoreModule, "useUserStore").mockReturnValue({
            user: {
                name: "João da Silva",
                perfil_acesso: {
                    uuid: "perfil-uuid",
                    nome: "PERFIL_NAO_MAPEADO",
                },
            },
        } as never);

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);

        const opcaoBoletim = await screen.findByRole("option", {
            name: /Boletim de ocorrência/i,
        });
        await user.click(opcaoBoletim);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        await user.click(anexarButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    perfil: "diretor",
                })
            );
        });
    });

    it("deve mapear corretamente perfil 'ASSISTENTE DE DIRETOR DE ESCOLA' para 'assistente'", async () => {
        const user = userEvent.setup();

        vi.clearAllMocks();

        const mockMutateAsyncLocal = vi.fn().mockResolvedValue({
            success: true,
            data: {
                id: "123",
                url: "https://example.com/anexo.pdf",
            },
        });

        vi.spyOn(useEnviarAnexoHook, "useEnviarAnexo").mockReturnValue({
            mutateAsync: mockMutateAsyncLocal,
            mutate: vi.fn(),
            isPending: false,
            isError: false,
            isSuccess: false,
            isIdle: true,
        } as never);

        vi.spyOn(
            useOcorrenciaFormStoreModule,
            "useOcorrenciaFormStore"
        ).mockImplementation(((selector: unknown) => {
            const state = {
                formData: {},
                setFormData: mockSetFormData,
                ocorrenciaUuid: "test-uuid-123",
            };
            return selector
                ? (selector as (s: unknown) => unknown)(state)
                : state;
        }) as never);

        vi.spyOn(useUserStoreModule, "useUserStore").mockImplementation(((
            selector: unknown
        ) => {
            const state = {
                user: {
                    name: "Maria Silva",
                    perfil_acesso: {
                        uuid: "perfil-uuid",
                        nome: "ASSISTENTE DE DIRETOR DE ESCOLA",
                    },
                },
            };
            return selector
                ? (selector as (s: unknown) => unknown)(state)
                : state;
        }) as never);

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);

        const opcaoBoletim = await screen.findByRole("option", {
            name: /Boletim de ocorrência/i,
        });
        await user.click(opcaoBoletim);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        await user.click(anexarButton);

        await waitFor(() => {
            expect(mockMutateAsyncLocal).toHaveBeenCalledWith(
                expect.objectContaining({
                    perfil: "assistente",
                })
            );
        });
    });

    it("deve usar 'diretor' como perfil padrão quando perfil_acesso.nome é string vazia", async () => {
        const user = userEvent.setup();

        vi.spyOn(useUserStoreModule, "useUserStore").mockReturnValue({
            user: {
                name: "João da Silva",
                perfil_acesso: {
                    uuid: "perfil-uuid",
                    nome: "",
                },
            },
        } as never);

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);

        const opcaoBoletim = await screen.findByRole("option", {
            name: /Boletim de ocorrência/i,
        });
        await user.click(opcaoBoletim);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        await user.click(anexarButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    perfil: "diretor",
                })
            );
        });
    });

    it("deve usar 'diretor' como perfil padrão quando user.perfil_acesso é undefined", async () => {
        const user = userEvent.setup();

        vi.spyOn(useUserStoreModule, "useUserStore").mockReturnValue({
            user: {
                name: "João da Silva",
                perfil_acesso: undefined,
            },
        } as never);

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const file = new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        });
        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        await user.upload(fileInput, file);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);

        const opcaoBoletim = await screen.findByRole("option", {
            name: /Boletim de ocorrência/i,
        });
        await user.click(opcaoBoletim);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        await user.click(anexarButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    perfil: "diretor",
                })
            );
        });
    });
});
