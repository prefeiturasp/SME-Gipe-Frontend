import * as useAtualizarSecaoNaoFurtoRouboHook from "@/hooks/useAtualizarSecaoNaoFurtoRoubo";
import * as useEnvolvidosHook from "@/hooks/useEnvolvidos";
import * as useTiposOcorrenciaHook from "@/hooks/useTiposOcorrencia";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SecaoNaoFurtoERoubo, { SecaoNaoFurtoERouboRef } from "./index";

import * as useOcorrenciaFormStoreModule from "@/stores/useOcorrenciaFormStore";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));

vi.mock("@/hooks/useTiposOcorrencia");

vi.mock("@/hooks/useEnvolvidos");

vi.mock("@/hooks/useAtualizarSecaoNaoFurtoRoubo", () => ({
    useAtualizarSecaoNaoFurtoRoubo: () => ({
        mutate: vi.fn((_, options) => {
            if (options?.onSuccess) {
                options.onSuccess({ success: true, data: {} });
            }
        }),
        isPending: false,
    }),
}));

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

const mockEnvolvidos = [
    {
        uuid: "uuid-estudante",
        perfil_dos_envolvidos: "Apenas um estudante",
    },
    {
        uuid: "uuid-funcionario",
        perfil_dos_envolvidos: "Estudante e funcionário",
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
            useOcorrenciaFormStoreModule.useOcorrenciaFormStore,
        ).mockReturnValue({
            formData: {},
            savedFormData: {},
            setFormData: mockSetFormData,
            setSavedFormData: vi.fn(),
            ocorrenciaUuid: null,
            clearFormData: mockClearFormData,
        } as never);

        vi.spyOn(useEnvolvidosHook, "useEnvolvidos").mockReturnValue({
            data: mockEnvolvidos,
            isLoading: false,
            isError: false,
            error: null,
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
            { wrapper: createWrapper() },
        );

        expect(
            screen.getByText("Qual o tipo de ocorrência?*"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Quem são os envolvidos?*"),
        ).toBeInTheDocument();
        expect(screen.getByText("Descreva a ocorrência*")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Existem informações sobre o agressor e/ou vítima?*",
            ),
        ).toBeInTheDocument();
    });

    it("deve renderizar todas as opções de tipo de ocorrência", async () => {
        const user = userEvent.setup();
        render(
            <SecaoNaoFurtoERoubo
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

    it("deve renderizar as opções de possuiInfoAgressorVitima", () => {
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() },
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
            { wrapper: createWrapper() },
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
            { wrapper: createWrapper() },
        );

        const selectButton = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });
        await user.click(selectButton);

        const opcaoViolencia = await screen.findByRole("option", {
            name: /violência física/i,
        });
        await user.click(opcaoViolencia);

        const envolvidosButton = screen.getByRole("combobox", {
            name: /Quem são os envolvidos\?\*/i,
        });
        await user.click(envolvidosButton);

        const opcaoAluno = await screen.findByRole("option", {
            name: /Apenas um estudante/i,
        });
        await user.click(opcaoAluno);

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(
            descricaoField,
            "Esta é uma descrição detalhada com mais de dez caracteres",
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
            { wrapper: createWrapper() },
        );

        const btnAnterior = screen.getByRole("button", { name: /anterior/i });
        await user.click(btnAnterior);

        expect(mockSetFormData).toHaveBeenCalled();
        expect(mockOnPrevious).toHaveBeenCalled();
    });

    it("deve chamar onNext ao submeter formulário válido", async () => {
        const user = userEvent.setup();

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

        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() },
        );

        const selectButton = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });
        await user.click(selectButton);

        const opcaoViolencia = await screen.findByRole("option", {
            name: /violência física/i,
        });
        await user.click(opcaoViolencia);

        const envolvidosButton = screen.getByRole("combobox", {
            name: /Quem são os envolvidos\?\*/i,
        });
        await user.click(envolvidosButton);

        const opcaoAluno = await screen.findByRole("option", {
            name: /Apenas um estudante/i,
        });
        await user.click(opcaoAluno);

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(
            descricaoField,
            "Esta é uma descrição detalhada com mais de dez caracteres",
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

    it("deve carregar valores do formData quando existentes", () => {
        vi.mocked(
            useOcorrenciaFormStoreModule.useOcorrenciaFormStore,
        ).mockReturnValue({
            formData: {
                tiposOcorrencia: ["1cd5b78c-3d8a-483c-a2c5-1346c44a4e97"],
                envolvidos: "aluno",
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
            { wrapper: createWrapper() },
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
            { wrapper: createWrapper() },
        );

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(descricaoField, "Curto");
        await user.tab();

        await waitFor(() => {
            expect(
                screen.getByText(
                    "A descrição deve ter pelo menos 10 caracteres.",
                ),
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
            { wrapper: createWrapper() },
        );

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(descricaoField, "          ");
        await user.tab();

        await waitFor(() => {
            expect(
                screen.getByText(
                    "A descrição não pode conter apenas espaços em branco.",
                ),
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
            { wrapper: createWrapper() },
        );

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(
            descricaoField,
            "Esta é uma descrição detalhada com mais de dez caracteres",
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
            { wrapper: createWrapper() },
        );

        expect(
            screen.getByText(
                "Descreva o que ocorreu, incluindo data, local, caso existam pessoas envolvidas e demais informações relevantes para o registro.",
            ),
        ).toBeInTheDocument();
    });

    it("deve desabilitar select quando tipos de ocorrência estão carregando", () => {
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
            { wrapper: createWrapper() },
        );

        const selectButton = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });
        expect(selectButton).toBeDisabled();
    });

    it("deve permitir selecionar um tipo de ocorrência", async () => {
        const user = userEvent.setup();
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() },
        );

        const selectButton = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });
        await user.click(selectButton);

        const opcaoViolenciaFisica = await screen.findByRole("option", {
            name: /^violência física$/i,
        });
        await user.click(opcaoViolenciaFisica);

        await waitFor(() => {
            expect(selectButton).toHaveTextContent("Violência física");
        });
    });

    it("deve exibir toast de erro quando ocorrenciaUuid não existe", async () => {
        const user = userEvent.setup();

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

        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() },
        );

        const selectButton = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });
        await user.click(selectButton);

        const opcaoViolencia = await screen.findByRole("option", {
            name: /violência física/i,
        });
        await user.click(opcaoViolencia);

        const envolvidosButton = screen.getByRole("combobox", {
            name: /Quem são os envolvidos\?\*/i,
        });
        await user.click(envolvidosButton);

        const opcaoAluno = await screen.findByRole("option", {
            name: /Apenas um estudante/i,
        });
        await user.click(opcaoAluno);

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(
            descricaoField,
            "Esta é uma descrição detalhada com mais de dez caracteres",
        );

        const radioSim = screen.getByRole("radio", { name: /sim/i });
        await user.click(radioSim);

        const btnProximo = screen.getByRole("button", { name: /próximo/i });
        await user.click(btnProximo);

        await waitFor(() => {
            expect(mockOnNext).not.toHaveBeenCalled();
        });
    });

    it("deve exibir toast de erro quando response.success é false", async () => {
        const user = userEvent.setup();
        const mockMutate = vi.fn((_, options) => {
            if (options?.onSuccess) {
                options.onSuccess({
                    success: false,
                    error: "Erro ao processar a requisição",
                });
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
            useAtualizarSecaoNaoFurtoRouboHook,
            "useAtualizarSecaoNaoFurtoRoubo",
        ).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        } as never);

        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
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

        const descricaoInput = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(descricaoInput, "Descrição de teste para error");

        const envolvido = screen.getByRole("combobox", {
            name: /quem são os envolvidos/i,
        });
        await user.click(envolvido);
        const envolvidoOption = await screen.findByRole("option", {
            name: /apenas um estudante/i,
        });
        await user.click(envolvidoOption);

        const radioSim = screen.getByRole("radio", { name: /sim/i });
        await user.click(radioSim);

        const submitButton = screen.getByRole("button", { name: /próximo/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
        });
    });
    it("deve exibir toast de erro quando onError é chamado", async () => {
        const user = userEvent.setup();
        const mockMutate = vi.fn((_, options) => {
            if (options?.onError) {
                options.onError(new Error("Network error"));
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
            useAtualizarSecaoNaoFurtoRouboHook,
            "useAtualizarSecaoNaoFurtoRoubo",
        ).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        } as never);

        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
            />,
            { wrapper: createWrapper() },
        );

        const selectButton = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });
        await user.click(selectButton);

        const opcaoViolencia = await screen.findByRole("option", {
            name: /violência física/i,
        });
        await user.click(opcaoViolencia);

        const envolvidosButton = screen.getByRole("combobox", {
            name: /Quem são os envolvidos\?\*/i,
        });
        await user.click(envolvidosButton);

        const opcaoAluno = await screen.findByRole("option", {
            name: /Apenas um estudante/i,
        });
        await user.click(opcaoAluno);

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(
            descricaoField,
            "Esta é uma descrição detalhada com mais de dez caracteres",
        );

        const radioSim = screen.getByRole("radio", { name: /sim/i });
        await user.click(radioSim);

        const btnProximo = screen.getByRole("button", { name: /próximo/i });
        await user.click(btnProximo);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
            expect(mockOnNext).not.toHaveBeenCalled();
        });
    });

    it("deve enviar tem_info_agressor_ou_vitima como 'nao' quando usuário seleciona Não", async () => {
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
            useAtualizarSecaoNaoFurtoRouboHook,
            "useAtualizarSecaoNaoFurtoRoubo",
        ).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        } as never);

        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
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

        const descricaoInput = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(descricaoInput, "Descrição de teste completa");

        const envolvido = screen.getByRole("combobox", {
            name: /quem são os envolvidos/i,
        });
        await user.click(envolvido);
        const envolvidoOption = await screen.findByRole("option", {
            name: /apenas um estudante/i,
        });
        await user.click(envolvidoOption);

        const radioNao = screen.getByRole("radio", { name: /não/i });
        await user.click(radioNao);

        const submitButton = screen.getByRole("button", { name: /próximo/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith(
                expect.objectContaining({
                    body: expect.objectContaining({
                        tem_info_agressor_ou_vitima: "nao",
                    }),
                }),
                expect.any(Object),
            );
        });
    });

    describe("métodos expostos via ref", () => {
        it("deve retornar dados do formulário via getFormData", () => {
            const ref = React.createRef<SecaoNaoFurtoERouboRef>();
            render(
                <SecaoNaoFurtoERoubo
                    ref={ref}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
                { wrapper: createWrapper() },
            );

            const formData = ref.current?.getFormData();

            expect(formData).toHaveProperty("tiposOcorrencia");
            expect(formData).toHaveProperty("envolvidos");
            expect(formData).toHaveProperty("descricao");
            expect(formData).toHaveProperty("possuiInfoAgressorVitima");
        });

        it("deve retornar instância do formulário via getFormInstance", () => {
            const ref = React.createRef<SecaoNaoFurtoERouboRef>();
            render(
                <SecaoNaoFurtoERoubo
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
                useAtualizarSecaoNaoFurtoRouboHook,
                "useAtualizarSecaoNaoFurtoRoubo",
            ).mockReturnValue({
                mutate: mockMutate,
                isPending: false,
            } as never);

            const ref = React.createRef<SecaoNaoFurtoERouboRef>();
            render(
                <SecaoNaoFurtoERoubo
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

            const envolvidosButton = screen.getByRole("combobox", {
                name: /Quem são os envolvidos\?\*/i,
            });
            await user.click(envolvidosButton);

            const envolvidoOption = await screen.findByRole("option", {
                name: /Apenas um estudante/i,
            });
            await user.click(envolvidoOption);

            const descricaoField =
                screen.getByPlaceholderText("Descreva aqui...");
            await user.type(
                descricaoField,
                "Esta é uma descrição detalhada com mais de dez caracteres",
            );

            const radioSim = screen.getByRole("radio", { name: /sim/i });
            await user.click(radioSim);

            await waitFor(async () => {
                const result = await ref.current?.submitForm();
                expect(result).toBe(true);
            });

            expect(mockMutate).toHaveBeenCalled();
        });

        it("deve retornar false ao submeter via submitForm quando dados são inválidos", async () => {
            const ref = React.createRef<SecaoNaoFurtoERouboRef>();
            render(
                <SecaoNaoFurtoERoubo
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

    describe("filtragem de tiposOcorrencia inválidos", () => {
        it("deve remover UUIDs que não pertencem ao tipo atual ao montar", async () => {
            vi.mocked(
                useOcorrenciaFormStoreModule.useOcorrenciaFormStore,
            ).mockReturnValue({
                formData: {
                    tiposOcorrencia: [
                        "1cd5b78c-3d8a-483c-a2c5-1346c44a4e97",
                        "uuid-invalido-de-outro-tipo",
                    ],
                    descricao: "Teste",
                    envolvidos: "uuid-estudante",
                    possuiInfoAgressorVitima: "Não",
                },
                savedFormData: {},
                setFormData: mockSetFormData,
                setSavedFormData: vi.fn(),
                ocorrenciaUuid: "test-uuid",
                clearFormData: mockClearFormData,
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

            const ref = React.createRef<SecaoNaoFurtoERouboRef>();
            render(
                <SecaoNaoFurtoERoubo
                    ref={ref}
                    onNext={mockOnNext}
                    onPrevious={mockOnPrevious}
                />,
                { wrapper: createWrapper() },
            );

            await waitFor(() => {
                const formValues = ref.current?.getFormData();
                expect(formValues?.tiposOcorrencia).toEqual([
                    "1cd5b78c-3d8a-483c-a2c5-1346c44a4e97",
                ]);
            });
        });
    });

    it("deve desabilitar todos os campos quando disabled=true", async () => {
        const user = userEvent.setup();
        render(
            <SecaoNaoFurtoERoubo
                onPrevious={mockOnPrevious}
                onNext={mockOnNext}
                disabled={true}
            />,
        );

        const tiposSelect = screen.getByRole("button", {
            name: /Selecione os tipos de ocorrência/i,
        });
        expect(tiposSelect).toBeDisabled();

        const envolvidosSelect = screen.getByRole("combobox", {
            name: /Quem são os envolvidos\?\*/i,
        });
        expect(envolvidosSelect).toBeDisabled();

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
