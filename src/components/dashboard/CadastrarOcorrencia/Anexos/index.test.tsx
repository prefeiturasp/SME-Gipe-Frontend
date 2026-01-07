import * as useEnviarAnexoHook from "@/hooks/useEnviarAnexo";
import * as useObterAnexosHook from "@/hooks/useObterAnexos";
import * as useTiposDocumentosHook from "@/hooks/useTiposDocumentos";
import * as useUserPermissionsHook from "@/hooks/useUserPermissions";
import * as useOcorrenciaFormStoreModule from "@/stores/useOcorrenciaFormStore";
import * as useUserStoreModule from "@/stores/useUserStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Anexos from "./index";

vi.mock("@/stores/useOcorrenciaFormStore");
vi.mock("@/stores/useUserStore");
vi.mock("@/hooks/useEnviarAnexo");
vi.mock("@/hooks/useObterAnexos");
vi.mock("@/hooks/useTiposDocumentos");
vi.mock("@/hooks/useUserPermissions");

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => ({ get: () => null }),
    useParams: () => ({}),
    redirect: vi.fn(),
    notFound: vi.fn(),
}));

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
    const mockRefetch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockToast.mockClear();
        mockAlert.mockClear();
        mockSetFormData.mockClear();
        mockMutateAsync.mockClear();
        mockRefetch.mockClear();

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

        vi.spyOn(useObterAnexosHook, "useObterAnexos").mockReturnValue({
            data: undefined,
            refetch: mockRefetch,
            isLoading: false,
            isError: false,
            isSuccess: false,
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

        vi.spyOn(useTiposDocumentosHook, "useTiposDocumentos").mockReturnValue({
            data: [
                {
                    value: "boletim_ocorrencia",
                    label: "Boletim de ocorrência",
                },
                {
                    value: "registro_ocorrencia_interno",
                    label: "Registro de ocorrência interno",
                },
            ],
            isLoading: false,
            isError: false,
            error: null,
        } as never);

        vi.spyOn(useUserPermissionsHook, "useUserPermissions").mockReturnValue({
            isPontoFocal: false,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });
    });

    it("deve renderizar o título e descrições", async () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

        expect(screen.getByText("Anexar novo arquivo")).toBeInTheDocument();
        expect(
            screen.getByText(
                /Selecione e classifique o tipo de arquivo, depois clique em/i
            )
        ).toBeInTheDocument();
    });

    it("deve renderizar todos os campos do formulário", async () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(
                screen.getByLabelText(/Selecione o arquivo/i)
            ).toBeInTheDocument();
        });

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
    });

    it("deve renderizar os botões Anterior e Finalizar", async () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: /Anterior/i })
            ).toBeInTheDocument();
        });

        expect(
            screen.getByRole("button", { name: /Finalizar/i })
        ).toBeInTheDocument();
    });

    it("deve desabilitar o botão Anexar documento quando não há arquivo selecionado", async () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            const anexarButton = screen.getByRole("button", {
                name: /Anexar documento/i,
            });
            expect(anexarButton).toBeDisabled();
        });
    });

    it("deve selecionar um arquivo válido", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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
        fireEvent.change(fileInput, { target: { files: [largeFile] } });

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    variant: "error",
                    title: "Arquivo muito grande",
                })
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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

        const invalidFile = new File(["conteúdo"], "documento.exe", {
            type: "application/octet-stream",
        });

        const fileInput = document.querySelector(
            "#fileInput"
        ) as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [invalidFile] } });

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    variant: "error",
                    title: "Formato não suportado",
                })
            );
        });
    });

    it("deve aceitar arquivo PDF válido", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

    it("deve anexar documento e chamar refetch para atualizar lista da API", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await act(async () => {
            await user.click(anexarButton);
        });

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalled();
            expect(mockRefetch).toHaveBeenCalled();
        });
    });

    it("deve resetar o formulário após anexar documento", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await act(async () => {
            await user.click(anexarButton);
        });

        await waitFor(() => {
            expect(
                screen.getByPlaceholderText(/Nenhum arquivo selecionado/i)
            ).toHaveValue("");
            expect(anexarButton).toBeDisabled();
        });
    });

    it("deve exibir múltiplos anexos na lista após refetch", async () => {
        const mockAnexosData = {
            count: 2,
            next: null,
            previous: null,
            results: [
                {
                    uuid: "anexo-1",
                    nome_original: "documento1.pdf",
                    categoria: "boletim_ocorrencia" as const,
                    categoria_display: "Boletim de ocorrência",
                    perfil: "diretor" as const,
                    perfil_display: "Diretor de Escola",
                    tamanho_formatado: "1.2 MB",
                    extensao: "pdf",
                    arquivo_url: "https://example.com/doc1.pdf",
                    criado_em: "2025-11-17T10:00:00Z",
                    usuario_username: "usuario1",
                },
                {
                    uuid: "anexo-2",
                    nome_original: "foto.jpg",
                    categoria: "registro_ocorrencia_interno" as const,
                    categoria_display: "Registro de ocorrência interno",
                    perfil: "diretor" as const,
                    perfil_display: "Diretor de Escola",
                    tamanho_formatado: "800 KB",
                    extensao: "jpg",
                    arquivo_url: "https://example.com/foto.jpg",
                    criado_em: "2025-11-17T11:00:00Z",
                    usuario_username: "usuario1",
                },
            ],
        };

        vi.spyOn(useObterAnexosHook, "useObterAnexos").mockReturnValue({
            data: mockAnexosData,
            refetch: mockRefetch,
            isLoading: false,
            isError: false,
            isSuccess: true,
        } as never);

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(screen.getByText("documento1.pdf")).toBeInTheDocument();
            expect(screen.getByText("foto.jpg")).toBeInTheDocument();

            const boletimTexts = screen.getAllByText("Boletim de ocorrência");
            expect(boletimTexts.length).toBeGreaterThan(0);

            const registroTexts = screen.getAllByText(
                "Registro de ocorrência interno"
            );
            expect(registroTexts.length).toBeGreaterThan(0);
        });
    });

    it("deve exibir data e hora do anexo da API", async () => {
        const mockAnexosData = {
            count: 1,
            next: null,
            previous: null,
            results: [
                {
                    uuid: "anexo-1",
                    nome_original: "documento.pdf",
                    categoria: "boletim_ocorrencia" as const,
                    categoria_display: "Boletim de ocorrência",
                    perfil: "diretor" as const,
                    perfil_display: "Diretor de Escola",
                    tamanho_formatado: "1.2 MB",
                    extensao: "pdf",
                    arquivo_url: "https://example.com/doc.pdf",
                    criado_em: "2025-11-13T14:30:00Z",
                    usuario_username: "usuario1",
                },
            ],
        };

        vi.spyOn(useObterAnexosHook, "useObterAnexos").mockReturnValue({
            data: mockAnexosData,
            refetch: mockRefetch,
            isLoading: false,
            isError: false,
            isSuccess: true,
        } as never);

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(screen.getByText("documento.pdf")).toBeInTheDocument();
            expect(screen.getByText(/13\/11\/2025/)).toBeInTheDocument();
        });
    });

    it("deve chamar onPrevious ao clicar no botão Anterior", async () => {
        const user = userEvent.setup();
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

        const form = document.querySelector("form") as HTMLFormElement;

        fireEvent.submit(form);

        await waitFor(() => {
            expect(mockSetFormData).toHaveBeenCalled();
            expect(mockOnNext).toHaveBeenCalled();
        });
    });

    it("deve preencher campos com dados do store", async () => {
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

        await waitFor(() => {
            const tipoSelect = screen.getByRole("combobox", {
                name: /Tipo do documento/i,
            });
            expect(tipoSelect).toHaveTextContent("Boletim de ocorrência");
        });
    });

    it("deve exibir link de ajuda sobre arquivos suportados", async () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(
                screen.getByText(
                    /Para conferir mais detalhes sobre os arquivos suportados/i
                )
            ).toBeInTheDocument();
        });

        expect(
            screen.getByRole("button", { name: /clique aqui/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar ícone de anexo no preview da API", async () => {
        const mockAnexosData = {
            count: 1,
            next: null,
            previous: null,
            results: [
                {
                    uuid: "anexo-1",
                    nome_original: "documento.pdf",
                    categoria: "boletim_ocorrencia" as const,
                    categoria_display: "Boletim de ocorrência",
                    perfil: "diretor" as const,
                    perfil_display: "Diretor de Escola",
                    tamanho_formatado: "1.2 MB",
                    extensao: "pdf",
                    arquivo_url: "https://example.com/doc.pdf",
                    criado_em: "2025-11-17T10:00:00Z",
                    usuario_username: "usuario1",
                },
            ],
        };

        vi.spyOn(useObterAnexosHook, "useObterAnexos").mockReturnValue({
            data: mockAnexosData,
            refetch: mockRefetch,
            isLoading: false,
            isError: false,
            isSuccess: true,
        } as never);

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await act(async () => {
            await user.click(anexarButton);
        });

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

    it("deve exibir erro quando o envio do anexo falha", async () => {
        const user = userEvent.setup();

        mockMutateAsync.mockResolvedValueOnce({
            success: false,
            error: "Erro ao processar o arquivo",
        });

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await act(async () => {
            await user.click(anexarButton);
        });

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalled();
            expect(mockToast).toHaveBeenCalledWith({
                title: "Não conseguimos anexar o arquivo",
                description: "Erro ao processar o arquivo",
                variant: "error",
            });
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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await act(async () => {
            await user.click(anexarButton);
        });

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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await act(async () => {
            await user.click(anexarButton);
        });

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

        await waitFor(() => {
            expect(screen.getByText("Anexos")).toBeInTheDocument();
        });

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

        await act(async () => {
            await user.click(anexarButton);
        });

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    perfil: "diretor",
                })
            );
        });
    });

    it("deve abrir o modal de tipos ao clicar em 'clique aqui'", async () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const botao = screen.getByRole("button", { name: /clique aqui/i });
        await userEvent.click(botao);

        await waitFor(() => {
            expect(
                screen.getByText(/Formatos e tamanhos suportados/i)
            ).toBeInTheDocument();
        });
    });

    it("deve abrir o modal de tipos ao clicar em 'Finalizar'", async () => {
        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        const botao = screen.getByRole("button", { name: /finalizar/i });
        await userEvent.click(botao);

        await waitFor(() => {
            expect(screen.getByText(/Conclusão de etapa/i)).toBeInTheDocument();
        });
    });

    it("deve chamar useObterAnexos sem perfil quando usuário não é assistente ou diretor", async () => {
        const mockUseObterAnexos = vi
            .spyOn(useObterAnexosHook, "useObterAnexos")
            .mockReturnValue({
                data: undefined,
                refetch: mockRefetch,
                isLoading: false,
                isError: false,
                isSuccess: false,
            } as never);

        vi.spyOn(useUserPermissionsHook, "useUserPermissions").mockReturnValue({
            isPontoFocal: false,
            isGipe: true,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(mockUseObterAnexos).toHaveBeenCalledWith({
                intercorrenciaUuid: "test-uuid-123",
                perfil: undefined,
            });
        });
    });

    it("deve chamar useObterAnexos com perfil=UE quando usuário é assistente ou diretor", async () => {
        const mockUseObterAnexos = vi
            .spyOn(useObterAnexosHook, "useObterAnexos")
            .mockReturnValue({
                data: undefined,
                refetch: mockRefetch,
                isLoading: false,
                isError: false,
                isSuccess: false,
            } as never);

        vi.spyOn(useUserPermissionsHook, "useUserPermissions").mockReturnValue({
            isPontoFocal: false,
            isGipe: false,
            isAssistenteOuDiretor: true,
            isGipeAdmin: false,
        });

        renderWithProvider(
            <Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />
        );

        await waitFor(() => {
            expect(mockUseObterAnexos).toHaveBeenCalledWith({
                intercorrenciaUuid: "test-uuid-123",
                perfil: "UE",
            });
        });
    });
});
