import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CadastrarOcorrencia from "./index";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
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

function mockUseTiposOcorrencia() {
    return {
        useTiposOcorrencia: () => ({
            data: mockTiposOcorrencia,
            isLoading: false,
            isError: false,
            error: null,
        }),
    };
}

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

const fakeUser = {
    nome: "Usuário Teste",
    username: "382888888",
    perfil_acesso: { nome: "DRE Teste", codigo: 123 },
    unidades: [
        {
            dre: {
                codigo_eol: "001",
                nome: "DRE Teste",
                sigla: "DRT",
            },
            ue: {
                codigo_eol: "0001",
                nome: "EMEF Teste",
                sigla: "EMEF",
            },
        },
    ],
    email: "a@b.com",
    cpf: "12345678900",
};

type UseUserSelector = (state: { user: typeof fakeUser }) => unknown;

function mockUseUserStore() {
    return {
        useUserStore: (selector: UseUserSelector) =>
            selector({
                user: fakeUser,
            }),
    };
}

function mockUseOcorrenciaFormStore() {
    const mockStoreState = {
        formData: {},
        savedFormData: {},
        setFormData: vi.fn(),
        setSavedFormData: vi.fn(),
        setOcorrenciaUuid: vi.fn(),
        ocorrenciaUuid: null,
        reset: vi.fn(),
    };

    return {
        useOcorrenciaFormStore: (
            selector?: (state: typeof mockStoreState) => unknown
        ) => {
            if (typeof selector === "function") {
                return selector(mockStoreState);
            }
            return mockStoreState;
        },
    };
}

function mockUseCadastrarOcorrencia() {
    return {
        useCadastrarOcorrencia: () => ({
            mutateAsync: async () => ({
                success: true,
                data: { uuid: "test-uuid" },
            }),
            isPending: false,
        }),
    };
}

function mockUseSecaoInicial() {
    return {
        useSecaoInicial: () => ({
            mutateAsync: async () => ({
                success: true,
                data: { uuid: "test-uuid" },
            }),
            isPending: false,
        }),
    };
}

function mockUseAtualizarSecaoInicial() {
    return {
        useAtualizarSecaoInicial: () => ({
            mutateAsync: async () => ({
                success: true,
            }),
            isPending: false,
        }),
    };
}

function mockUseAtualizarSecaoFurtoRoubo() {
    return {
        useAtualizarSecaoFurtoRoubo: () => ({
            mutate: vi.fn(),
            mutateAsync: vi.fn(),
            isPending: false,
        }),
    };
}

function createDynamicStoreMock() {
    let currentFormData = {};

    const mockStoreState = {
        get formData() {
            return currentFormData;
        },
        savedFormData: {},
        setFormData: vi.fn((data) => {
            currentFormData = data;
        }),
        setSavedFormData: vi.fn(),
        setOcorrenciaUuid: vi.fn(),
        ocorrenciaUuid: null,
        reset: vi.fn(),
    };

    return {
        useOcorrenciaFormStore: (
            selector?: (state: typeof mockStoreState) => unknown
        ) => {
            if (typeof selector === "function") {
                return selector(mockStoreState);
            }
            return mockStoreState;
        },
    };
}

describe("CadastrarOcorrencia", () => {
    it("deve renderizar o PageHeader com o título correto", () => {
        renderWithClient(<CadastrarOcorrencia />);
        const heading = screen.getByRole("heading", {
            name: /Nova ocorrência/i,
        });
        expect(heading).toBeInTheDocument();
    });

    it("deve renderizar o Stepper com os passos corretos", () => {
        renderWithClient(<CadastrarOcorrencia />);
        expect(screen.getByText("Cadastro de ocorrência")).toBeInTheDocument();
        expect(screen.getByText("Fase 02")).toBeInTheDocument();
        expect(screen.getByText("Fase 03")).toBeInTheDocument();
        expect(screen.getByText("Anexos")).toBeInTheDocument();
    });

    it("avança de step quando a mutation do filho retorna sucesso (integração)", async () => {
        vi.resetModules();

        vi.doMock("@/stores/useUserStore", mockUseUserStore);
        vi.doMock("@/stores/useOcorrenciaFormStore", createDynamicStoreMock);
        vi.doMock("@/hooks/useCadastrarOcorrencia", mockUseCadastrarOcorrencia);
        vi.doMock("@/hooks/useSecaoInicial", mockUseSecaoInicial);
        vi.doMock(
            "@/hooks/useAtualizarSecaoInicial",
            mockUseAtualizarSecaoInicial
        );
        vi.doMock("@/hooks/useTiposOcorrencia", mockUseTiposOcorrencia);
        vi.doMock(
            "@/hooks/useAtualizarSecaoFurtoRoubo",
            mockUseAtualizarSecaoFurtoRoubo
        );

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia />);

        const dateInput = screen.getByLabelText(
            /Quando a ocorrência aconteceu\?\*/i
        );
        fireEvent.change(dateInput, { target: { value: "2025-10-02" } });

        const radioSim = screen.getByRole("radio", { name: /Sim/ });
        fireEvent.click(radioSim);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());
        fireEvent.click(nextButton);

        const checks = await screen.findAllByTestId("check-icon");
        expect(checks.length).toBeGreaterThanOrEqual(1);
    });

    it("deve avançar do step 2 (SecaoNaoFurtoERoubo) para o step 3 ao clicar em Próximo", async () => {
        vi.resetModules();

        vi.doMock("@/stores/useUserStore", mockUseUserStore);
        vi.doMock(
            "@/stores/useOcorrenciaFormStore",
            mockUseOcorrenciaFormStore
        );
        vi.doMock("@/hooks/useCadastrarOcorrencia", mockUseCadastrarOcorrencia);
        vi.doMock("@/hooks/useSecaoInicial", mockUseSecaoInicial);
        vi.doMock(
            "@/hooks/useAtualizarSecaoInicial",
            mockUseAtualizarSecaoInicial
        );
        vi.doMock("@/hooks/useTiposOcorrencia", mockUseTiposOcorrencia);
        vi.doMock(
            "@/hooks/useAtualizarSecaoFurtoRoubo",
            mockUseAtualizarSecaoFurtoRoubo
        );

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia />);

        const dateInput = screen.getByLabelText(
            /Quando a ocorrência aconteceu\?\*/i
        );
        fireEvent.change(dateInput, { target: { value: "2025-10-02" } });

        const radioNao = screen.getByRole("radio", { name: /Não/ });
        fireEvent.click(radioNao);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(
                screen.getByText("Qual o tipo de ocorrência?*")
            ).toBeInTheDocument();
        });

        const multiSelectButton = screen.getByRole("button", {
            name: /selecione os tipos de ocorrência/i,
        });
        fireEvent.click(multiSelectButton);

        const opcaoViolencia = await screen.findByRole("option", {
            name: /violência física/i,
        });
        fireEvent.click(opcaoViolencia);

        const envolvidosButton = screen.getByRole("button", {
            name: /selecione os envolvidos/i,
        });
        fireEvent.click(envolvidosButton);

        const opcaoAluno = await screen.findByRole("option", {
            name: /aluno/i,
        });
        fireEvent.click(opcaoAluno);

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        fireEvent.change(descricaoField, {
            target: {
                value: "Descrição detalhada da ocorrência com mais de dez caracteres",
            },
        });

        const radioInfoAgressorSim = screen.getByRole("radio", {
            name: /Sim/,
        });
        fireEvent.click(radioInfoAgressorSim);

        const nextButtonStep2 = screen.getByRole("button", {
            name: /Próximo/i,
        });
        await waitFor(() => expect(nextButtonStep2).toBeEnabled());
        fireEvent.click(nextButtonStep2);

        await waitFor(() => {
            expect(
                screen.queryByText("Qual o tipo de ocorrência?*")
            ).not.toBeInTheDocument();
        });
    });

    it("deve voltar do step 2 (SecaoNaoFurtoERoubo) para o step 1 ao clicar em Anterior", async () => {
        vi.resetModules();

        vi.doMock("@/stores/useUserStore", mockUseUserStore);
        vi.doMock(
            "@/stores/useOcorrenciaFormStore",
            mockUseOcorrenciaFormStore
        );
        vi.doMock("@/hooks/useCadastrarOcorrencia", mockUseCadastrarOcorrencia);
        vi.doMock("@/hooks/useSecaoInicial", mockUseSecaoInicial);
        vi.doMock(
            "@/hooks/useAtualizarSecaoInicial",
            mockUseAtualizarSecaoInicial
        );
        vi.doMock("@/hooks/useTiposOcorrencia", mockUseTiposOcorrencia);
        vi.doMock(
            "@/hooks/useAtualizarSecaoFurtoRoubo",
            mockUseAtualizarSecaoFurtoRoubo
        );

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia />);

        const dateInput = screen.getByLabelText(
            /Quando a ocorrência aconteceu\?\*/i
        );
        fireEvent.change(dateInput, { target: { value: "2025-10-02" } });

        const radioNao = screen.getByRole("radio", { name: /Não/ });
        fireEvent.click(radioNao);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(
                screen.getByText("Qual o tipo de ocorrência?*")
            ).toBeInTheDocument();
        });

        const previousButton = screen.getByRole("button", {
            name: /Anterior/i,
        });
        fireEvent.click(previousButton);

        await waitFor(() => {
            expect(
                screen.getByLabelText(/Quando a ocorrência aconteceu\?\*/i)
            ).toBeInTheDocument();
        });

        expect(
            screen.queryByText("Qual o tipo de ocorrência?*")
        ).not.toBeInTheDocument();
    });

    it("deve avançar do step 2 (SecaoFurtoERoubo) para o step 3 ao clicar em Próximo", async () => {
        vi.resetModules();

        vi.doMock("@/stores/useUserStore", mockUseUserStore);
        vi.doMock("@/stores/useOcorrenciaFormStore", createDynamicStoreMock);
        vi.doMock("@/hooks/useCadastrarOcorrencia", mockUseCadastrarOcorrencia);
        vi.doMock("@/hooks/useSecaoInicial", mockUseSecaoInicial);
        vi.doMock(
            "@/hooks/useAtualizarSecaoInicial",
            mockUseAtualizarSecaoInicial
        );
        vi.doMock("@/hooks/useTiposOcorrencia", mockUseTiposOcorrencia);
        vi.doMock(
            "@/hooks/useAtualizarSecaoFurtoRoubo",
            mockUseAtualizarSecaoFurtoRoubo
        );

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia />);

        const dateInput = screen.getByLabelText(
            /Quando a ocorrência aconteceu\?\*/i
        );
        fireEvent.change(dateInput, { target: { value: "2025-10-02" } });

        const radioSim = screen.getByRole("radio", { name: /Sim/ });
        fireEvent.click(radioSim);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(
                screen.getByText("Qual o tipo de ocorrência?*")
            ).toBeInTheDocument();
        });

        const multiSelectButton = screen.getByRole("button", {
            name: /selecione os tipos de ocorrência/i,
        });
        fireEvent.click(multiSelectButton);

        const opcaoViolencia = await screen.findByRole("option", {
            name: /violência física/i,
        });
        fireEvent.click(opcaoViolencia);

        const descricaoField = screen.getByPlaceholderText("Descreva aqui...");
        fireEvent.change(descricaoField, {
            target: {
                value: "Descrição detalhada da ocorrência com mais de dez caracteres",
            },
        });

        const radioSmartSampa = screen.getByRole("radio", {
            name: /A UE não faz parte do Smart Sampa/i,
        });
        fireEvent.click(radioSmartSampa);

        const nextButtonStep2 = screen.getByRole("button", {
            name: /Próximo/i,
        });
        await waitFor(() => expect(nextButtonStep2).toBeEnabled());
        fireEvent.click(nextButtonStep2);

        await waitFor(() => {
            expect(
                screen.queryByText("Qual o tipo de ocorrência?*")
            ).not.toBeInTheDocument();
        });
    });

    it("deve voltar do step 2 (SecaoFurtoERoubo) para o step 1 ao clicar em Anterior", async () => {
        vi.resetModules();

        vi.doMock("@/stores/useUserStore", mockUseUserStore);
        vi.doMock("@/stores/useOcorrenciaFormStore", createDynamicStoreMock);
        vi.doMock("@/hooks/useCadastrarOcorrencia", mockUseCadastrarOcorrencia);
        vi.doMock("@/hooks/useSecaoInicial", mockUseSecaoInicial);
        vi.doMock(
            "@/hooks/useAtualizarSecaoInicial",
            mockUseAtualizarSecaoInicial
        );
        vi.doMock("@/hooks/useTiposOcorrencia", mockUseTiposOcorrencia);
        vi.doMock(
            "@/hooks/useAtualizarSecaoFurtoRoubo",
            mockUseAtualizarSecaoFurtoRoubo
        );

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia />);

        const dateInput = screen.getByLabelText(
            /Quando a ocorrência aconteceu\?\*/i
        );
        fireEvent.change(dateInput, { target: { value: "2025-10-02" } });

        const radioSim = screen.getByRole("radio", { name: /Sim/ });
        fireEvent.click(radioSim);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(
                screen.getByText(
                    /Unidade Educacional é contemplada pelo Smart Sampa\?/i
                )
            ).toBeInTheDocument();
        });

        const previousButton = screen.getByRole("button", {
            name: /Anterior/i,
        });
        fireEvent.click(previousButton);

        await waitFor(() => {
            expect(
                screen.getByLabelText(/Quando a ocorrência aconteceu\?\*/i)
            ).toBeInTheDocument();
        });

        expect(
            screen.queryByText(
                /Unidade Educacional é contemplada pelo Smart Sampa\?/i
            )
        ).not.toBeInTheDocument();
    });

    it("deve renderizar SecaoFurtoERoubo quando tipoOcorrencia é Sim", async () => {
        vi.resetModules();

        vi.doMock("@/stores/useUserStore", mockUseUserStore);
        vi.doMock("@/stores/useOcorrenciaFormStore", createDynamicStoreMock);
        vi.doMock("@/hooks/useCadastrarOcorrencia", mockUseCadastrarOcorrencia);
        vi.doMock("@/hooks/useSecaoInicial", mockUseSecaoInicial);
        vi.doMock(
            "@/hooks/useAtualizarSecaoInicial",
            mockUseAtualizarSecaoInicial
        );
        vi.doMock("@/hooks/useTiposOcorrencia", mockUseTiposOcorrencia);
        vi.doMock(
            "@/hooks/useAtualizarSecaoFurtoRoubo",
            mockUseAtualizarSecaoFurtoRoubo
        );

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia />);

        const dateInput = screen.getByLabelText(
            /Quando a ocorrência aconteceu\?\*/i
        );
        fireEvent.change(dateInput, { target: { value: "2025-10-02" } });

        const radioSim = screen.getByRole("radio", { name: /Sim/ });
        fireEvent.click(radioSim);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(
                screen.getByText(
                    /Unidade Educacional é contemplada pelo Smart Sampa\?/i
                )
            ).toBeInTheDocument();
        });
    });

    it("deve exibir todas as opções de Smart Sampa no SecaoFurtoERoubo", async () => {
        vi.resetModules();

        vi.doMock("@/stores/useUserStore", mockUseUserStore);
        vi.doMock("@/stores/useOcorrenciaFormStore", createDynamicStoreMock);
        vi.doMock("@/hooks/useCadastrarOcorrencia", mockUseCadastrarOcorrencia);
        vi.doMock("@/hooks/useSecaoInicial", mockUseSecaoInicial);
        vi.doMock(
            "@/hooks/useAtualizarSecaoInicial",
            mockUseAtualizarSecaoInicial
        );
        vi.doMock("@/hooks/useTiposOcorrencia", mockUseTiposOcorrencia);
        vi.doMock(
            "@/hooks/useAtualizarSecaoFurtoRoubo",
            mockUseAtualizarSecaoFurtoRoubo
        );

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia />);

        const dateInput = screen.getByLabelText(
            /Quando a ocorrência aconteceu\?\*/i
        );
        fireEvent.change(dateInput, { target: { value: "2025-10-02" } });

        const radioSim = screen.getByRole("radio", { name: /Sim/ });
        fireEvent.click(radioSim);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.getByText("Sim e houve dano")).toBeInTheDocument();
            expect(
                screen.getByText("Sim, mas não houve dano")
            ).toBeInTheDocument();
            expect(
                screen.getByText("A UE não faz parte do Smart Sampa")
            ).toBeInTheDocument();
        });
    });

    it("deve renderizar SecaoNaoFurtoERoubo quando tipoOcorrencia é Não", async () => {
        vi.resetModules();

        vi.doMock("@/stores/useUserStore", mockUseUserStore);
        vi.doMock(
            "@/stores/useOcorrenciaFormStore",
            mockUseOcorrenciaFormStore
        );
        vi.doMock("@/hooks/useCadastrarOcorrencia", mockUseCadastrarOcorrencia);
        vi.doMock("@/hooks/useSecaoInicial", mockUseSecaoInicial);
        vi.doMock(
            "@/hooks/useAtualizarSecaoInicial",
            mockUseAtualizarSecaoInicial
        );
        vi.doMock("@/hooks/useTiposOcorrencia", mockUseTiposOcorrencia);
        vi.doMock(
            "@/hooks/useAtualizarSecaoFurtoRoubo",
            mockUseAtualizarSecaoFurtoRoubo
        );

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia />);

        const dateInput = screen.getByLabelText(
            /Quando a ocorrência aconteceu\?\*/i
        );
        fireEvent.change(dateInput, { target: { value: "2025-10-02" } });

        const radioNao = screen.getByRole("radio", { name: /Não/ });
        fireEvent.click(radioNao);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Existem informações sobre o agressor e/ou vítima?*"
                )
            ).toBeInTheDocument();
        });

        expect(
            screen.queryByText(
                /Unidade Educacional é contemplada pelo Smart Sampa\?/i
            )
        ).not.toBeInTheDocument();
    });

    describe("handleClick - botão voltar do PageHeader", () => {
        it("deve resetar a store e invalidar queries ao clicar no botão voltar", async () => {
            const mockReset = vi.fn();
            const mockInvalidateQueries = vi.fn().mockResolvedValue(undefined);

            const customQueryClient = new QueryClient();
            vi.spyOn(customQueryClient, "invalidateQueries").mockImplementation(
                mockInvalidateQueries
            );

            const testUuid = "test-uuid-123";

            const mockStoreWithUuid = {
                formData: {},
                savedFormData: {},
                setFormData: vi.fn(),
                setSavedFormData: vi.fn(),
                setOcorrenciaUuid: vi.fn(),
                ocorrenciaUuid: testUuid,
                reset: mockReset,
            };

            vi.doMock("@/stores/useUserStore", mockUseUserStore);
            vi.doMock("@/stores/useOcorrenciaFormStore", () => ({
                useOcorrenciaFormStore: (
                    selector?: (state: typeof mockStoreWithUuid) => unknown
                ) => {
                    if (typeof selector === "function") {
                        return selector(mockStoreWithUuid);
                    }
                    return mockStoreWithUuid;
                },
            }));
            vi.doMock("@/hooks/useSecaoInicial", mockUseSecaoInicial);
            vi.doMock(
                "@/hooks/useAtualizarSecaoInicial",
                mockUseAtualizarSecaoInicial
            );
            vi.doMock("@/hooks/useTiposOcorrencia", mockUseTiposOcorrencia);

            const actualReactQuery = await vi.importActual(
                "@tanstack/react-query"
            );
            vi.doMock("@tanstack/react-query", () => ({
                ...(actualReactQuery as object),
                useQueryClient: () => customQueryClient,
            }));

            vi.resetModules();
            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;

            render(
                <QueryClientProvider client={customQueryClient}>
                    <CadastrarOcorrencia />
                </QueryClientProvider>
            );

            const voltarButton = screen.getByRole("link", { name: /Voltar/i });
            fireEvent.click(voltarButton);

            await waitFor(() => {
                expect(mockReset).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(mockInvalidateQueries).toHaveBeenCalledWith({
                    queryKey: ["ocorrencia", testUuid],
                });
            });
        });
    });
});
