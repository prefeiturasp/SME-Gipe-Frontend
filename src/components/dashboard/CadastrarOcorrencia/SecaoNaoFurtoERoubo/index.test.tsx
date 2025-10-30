import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SecaoNaoFurtoERoubo from "./index";
import userEvent from "@testing-library/user-event";
import * as useTiposOcorrenciaHook from "@/hooks/useTiposOcorrencia";
import * as useOcorrenciaFormStoreModule from "@/stores/useOcorrenciaFormStore";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));

vi.mock("@/hooks/useTiposOcorrencia");

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

describe("SecaoNaoFurtoERoubo", () => {
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
    });

    it("deve renderizar todos os campos do formulário", () => {
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        expect(
            screen.getByText("Qual o tipo de ocorrência?*")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Quem são os envolvidos?*")
        ).toBeInTheDocument();
        expect(screen.getByText("Descreva a ocorrência*")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Existem informações sobre o agressor e/ou vítima?*"
            )
        ).toBeInTheDocument();
    });

    it("deve renderizar todas as opções de tipo de ocorrência", async () => {
        const user = userEvent.setup();
        render(
            <SecaoNaoFurtoERoubo
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

    it("deve renderizar as opções de possuiInfoAgressorVitima", () => {
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const radioButtons = screen.getAllByRole("radio");
        expect(radioButtons).toHaveLength(2);

        expect(screen.getByText("Sim")).toBeInTheDocument();
        expect(screen.getByText("Não")).toBeInTheDocument();
    });

    it("deve desabilitar o botão Próximo quando o formulário está inválido", () => {
        render(
            <SecaoNaoFurtoERoubo
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
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const multiSelectButton = screen.getByRole("button", {
            name: /selecione os tipos de ocorrência/i,
        });
        await user.click(multiSelectButton);

        const opcaoViolencia = await screen.findByRole("option", {
            name: /violência física/i,
        });
        await user.click(opcaoViolencia);

        const envolvidosButton = screen.getByRole("button", {
            name: /selecione os envolvidos/i,
        });
        await user.click(envolvidosButton);

        const opcaoAluno = await screen.findByRole("option", {
            name: /aluno/i,
        });
        await user.click(opcaoAluno);

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(
            descricaoField,
            "Esta é uma descrição detalhada com mais de dez caracteres"
        );

        const radioSim = screen.getByRole("radio", { name: /sim/i });
        await user.click(radioSim);

        const btnProximo = screen.getByRole("button", { name: /próximo/i });
        await waitFor(() => {
            expect(btnProximo).toBeEnabled();
        });
    });

    it("deve chamar onPrevious e salvar dados ao clicar em Anterior", async () => {
        const user = userEvent.setup();
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const btnAnterior = screen.getByRole("button", { name: /anterior/i });
        await user.click(btnAnterior);

        expect(mockSetFormData).toHaveBeenCalled();
        expect(mockOnPrevious).toHaveBeenCalled();
    });

    it("deve chamar onNext ao submeter formulário válido", async () => {
        const user = userEvent.setup();
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const multiSelectButton = screen.getByRole("button", {
            name: /selecione os tipos de ocorrência/i,
        });
        await user.click(multiSelectButton);

        const opcaoViolencia = await screen.findByRole("option", {
            name: /violência física/i,
        });
        await user.click(opcaoViolencia);

        const envolvidosButton = screen.getByRole("button", {
            name: /selecione os envolvidos/i,
        });
        await user.click(envolvidosButton);

        const opcaoAluno = await screen.findByRole("option", {
            name: /aluno/i,
        });
        await user.click(opcaoAluno);

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(
            descricaoField,
            "Esta é uma descrição detalhada com mais de dez caracteres"
        );

        const radioSim = screen.getByRole("radio", { name: /sim/i });
        await user.click(radioSim);

        const btnProximo = screen.getByRole("button", { name: /próximo/i });
        await waitFor(() => {
            expect(btnProximo).toBeEnabled();
        });

        await user.click(btnProximo);

        await waitFor(() => {
            expect(mockSetFormData).toHaveBeenCalled();
            expect(mockOnNext).toHaveBeenCalled();
        });
    });

    it("deve renderizar as opções mockadas de envolvidos", async () => {
        const user = userEvent.setup();
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const envolvidosButton = screen.getByRole("button", {
            name: /selecione os envolvidos/i,
        });
        expect(envolvidosButton).toBeEnabled();

        await user.click(envolvidosButton);

        await waitFor(() => {
            expect(screen.getByText("Aluno")).toBeInTheDocument();
            expect(screen.getByText("Professor")).toBeInTheDocument();
        });
    });

    it("deve carregar valores do formData quando existentes", () => {
        vi.mocked(
            useOcorrenciaFormStoreModule.useOcorrenciaFormStore
        ).mockReturnValue({
            formData: {
                tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                envolvidos: ["aluno"],
                descricao: "Descrição inicial",
                possuiInfoAgressorVitima: "Sim" as const,
            },
            savedFormData: {},
            setFormData: mockSetFormData,
            setSavedFormData: vi.fn(),
            ocorrenciaUuid: null,
            clearFormData: mockClearFormData,
        } as never);

        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        expect(descricaoField).toHaveValue("Descrição inicial");

        const radioSim = screen.getByRole("radio", { name: /sim/i });
        expect(radioSim).toBeChecked();
    });

    it("deve exibir mensagem de erro quando descrição tem menos de 10 caracteres", async () => {
        const user = userEvent.setup();
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(descricaoField, "Curto");
        await user.tab();

        await waitFor(() => {
            expect(
                screen.getByText(
                    "A descrição deve ter pelo menos 10 caracteres."
                )
            ).toBeInTheDocument();
        });
    });

    it("deve exibir mensagem de erro quando descrição contém apenas espaços", async () => {
        const user = userEvent.setup();
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(descricaoField, "          ");
        await user.tab();

        await waitFor(() => {
            expect(
                screen.getByText(
                    "A descrição não pode conter apenas espaços em branco."
                )
            ).toBeInTheDocument();
        });
    });

    it("deve manter botão Próximo desabilitado quando faltam campos obrigatórios", async () => {
        const user = userEvent.setup();
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(
            descricaoField,
            "Esta é uma descrição detalhada com mais de dez caracteres"
        );

        const radioSim = screen.getByRole("radio", { name: /sim/i });
        await user.click(radioSim);

        const btnProximo = screen.getByRole("button", { name: /próximo/i });
        expect(btnProximo).toBeDisabled();
    });

    it("deve exibir texto auxiliar sobre informações do agressor/vítima", () => {
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        expect(
            screen.getByText(
                "se houver informações sobre agressores ou vítimas, preencher aqui"
            )
        ).toBeInTheDocument();
    });

    it("deve exibir texto auxiliar sobre seleção múltipla", () => {
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const textos = screen.getAllByText(
            "Se necessário, selecione mais de uma opção"
        );
        expect(textos).toHaveLength(2);
    });

    it("deve desabilitar multiselect quando tipos de ocorrência estão carregando", () => {
        vi.spyOn(useTiposOcorrenciaHook, "useTiposOcorrencia").mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
        } as never);

        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const multiSelectButton = screen.getByRole("button", {
            name: /selecione os tipos de ocorrência/i,
        });
        expect(multiSelectButton).toBeDisabled();
    });

    it("deve permitir selecionar múltiplos tipos de ocorrência", async () => {
        const user = userEvent.setup();
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const multiSelectButton = screen.getByRole("button", {
            name: /selecione os tipos de ocorrência/i,
        });
        await user.click(multiSelectButton);

        const opcaoViolenciaFisica = await screen.findByRole("option", {
            name: /^violência física$/i,
        });
        await user.click(opcaoViolenciaFisica);

        const opcaoBullying = await screen.findByRole("option", {
            name: /^bullying$/i,
        });
        await user.click(opcaoBullying);

        await waitFor(() => {
            const button = screen.getByRole("button", {
                name: /violência física, bullying/i,
            });
            expect(button).toBeInTheDocument();
        });
    });

    it("deve permitir selecionar múltiplos envolvidos", async () => {
        const user = userEvent.setup();
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() }
        );

        const envolvidosButton = screen.getByRole("button", {
            name: /selecione os envolvidos/i,
        });
        await user.click(envolvidosButton);

        const opcaoAluno = await screen.findByRole("option", {
            name: /^aluno$/i,
        });
        await user.click(opcaoAluno);

        const opcaoProfessor = await screen.findByRole("option", {
            name: /^professor$/i,
        });
        await user.click(opcaoProfessor);

        await waitFor(() => {
            const button = screen.getByRole("button", {
                name: /aluno, professor/i,
            });
            expect(button).toBeInTheDocument();
        });
    });
});
