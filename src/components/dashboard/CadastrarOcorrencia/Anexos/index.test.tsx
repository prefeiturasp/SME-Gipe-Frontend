import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Anexos from "./index";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useUserStore } from "@/stores/useUserStore";

vi.mock("@/stores/useOcorrenciaFormStore");
vi.mock("@/stores/useUserStore");

const mockAlert = vi.spyOn(globalThis, "alert").mockImplementation(() => {});

describe("Anexos", () => {
    const mockOnPrevious = vi.fn();
    const mockOnNext = vi.fn();
    const mockSetFormData = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockAlert.mockClear();

        vi.mocked(useOcorrenciaFormStore).mockReturnValue({
            formData: {},
            setFormData: mockSetFormData,
        });

        vi.mocked(useUserStore).mockReturnValue({
            user: { name: "João da Silva" },
        });
    });

    it("deve renderizar o título e descrições", () => {
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

        expect(screen.getByText("Anexos")).toBeInTheDocument();
        expect(screen.getByText("Anexar novo arquivo")).toBeInTheDocument();
        expect(
            screen.getByText(
                /Selecione e classifique o tipo de arquivo, depois clique em/i
            )
        ).toBeInTheDocument();
    });

    it("deve renderizar todos os campos do formulário", () => {
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

        expect(
            screen.getByRole("button", { name: /Anterior/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Finalizar/i })
        ).toBeInTheDocument();
    });

    it("deve desabilitar o botão Anexar documento quando não há arquivo selecionado", () => {
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

        const anexarButton = screen.getByRole("button", {
            name: /Anexar documento/i,
        });
        expect(anexarButton).toBeDisabled();
    });

    it("deve selecionar um arquivo válido", async () => {
        const user = userEvent.setup();
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        });
    });

    it("deve resetar o formulário após anexar documento", async () => {
        const user = userEvent.setup();
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
            name: /Foto/i,
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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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

        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        vi.mocked(useUserStore).mockReturnValue({
            user: null,
        });

        const user = userEvent.setup();
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

        const tipoTrigger = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        await user.click(tipoTrigger);

        await waitFor(() => {
            expect(
                screen.getByRole("option", { name: /Boletim de Ocorrência/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: /Relatório Escolar/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: /Laudo Médico/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: /^Foto$/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: /Vídeo/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: /Outro/i })
            ).toBeInTheDocument();
        });
    });

    it("deve chamar onPrevious ao clicar no botão Anterior", async () => {
        const user = userEvent.setup();
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

        const anteriorButton = screen.getByRole("button", {
            name: /Anterior/i,
        });
        await user.click(anteriorButton);

        expect(mockOnPrevious).toHaveBeenCalledTimes(1);
        expect(mockSetFormData).toHaveBeenCalled();
    });

    it("deve chamar onNext ao submeter o formulário", async () => {
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

        const form = document.querySelector("form") as HTMLFormElement;

        fireEvent.submit(form);

        await waitFor(() => {
            expect(mockSetFormData).toHaveBeenCalled();
            expect(mockOnNext).toHaveBeenCalled();
        });
    });

    it("deve preencher campos com dados do store", () => {
        vi.mocked(useOcorrenciaFormStore).mockReturnValue({
            formData: {
                tipoDocumento: "laudo_medico",
            },
            setFormData: mockSetFormData,
        });

        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

        const tipoSelect = screen.getByRole("combobox", {
            name: /Tipo do documento/i,
        });
        expect(tipoSelect).toHaveTextContent("Laudo Médico");
    });

    it("deve exibir link de ajuda sobre arquivos suportados", () => {
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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
        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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

    it("deve usar tipoDocumento como fallback quando label não é encontrado", async () => {
        const user = userEvent.setup();

        vi.mocked(useOcorrenciaFormStore).mockReturnValue({
            formData: {
                tipoDocumento: "tipo_customizado",
            },
            setFormData: mockSetFormData,
        });

        render(<Anexos onPrevious={mockOnPrevious} onNext={mockOnNext} />);

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

        expect(anexarButton).not.toBeDisabled();

        await user.click(anexarButton);

        await waitFor(() => {
            expect(screen.getByText("documento.pdf")).toBeInTheDocument();
            expect(screen.getByText("tipo_customizado")).toBeInTheDocument();
        });
    });
});
