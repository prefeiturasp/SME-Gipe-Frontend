import { vi } from "vitest";
import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { renderWithClient } from "../__tests__/helpers";
import SecaoFinal from "./index";

const setFormDataMock = vi.fn();
let mockFormData: Record<string, unknown> = {};

vi.mock("@/stores/useOcorrenciaFormStore", () => ({
    useOcorrenciaFormStore: () => ({
        formData: mockFormData,
        setFormData: setFormDataMock,
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
        setFormDataMock.mockClear();
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
            declarante: "GIPE",
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
                declarante: "GIPE",
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
                    declarante: "NAAPA",
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
            declarante: "GIPE",
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
            declarante: "GIPE",
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
            declarante: "GIPE",
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
});
