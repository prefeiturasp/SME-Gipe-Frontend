import "./__tests__/setup";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { renderWithClient, mockUseUserStore } from "./__tests__/helpers";

vi.mock("./SecaoInicial", () => ({
    default: vi.fn(({ onSuccess }) => (
        <div>
            <span>Mock SecaoInicial</span>
            <button onClick={onSuccess}>Próximo</button>
        </div>
    )),
}));

vi.mock("./SecaoFurtoERoubo", () => ({
    default: vi.fn(({ onNext, onPrevious }) => (
        <div>
            <span>Mock SecaoFurtoERoubo</span>
            <button onClick={onNext}>Próximo</button>
            <button onClick={onPrevious}>Anterior</button>
        </div>
    )),
}));

vi.mock("./SecaoNaoFurtoERoubo", () => ({
    default: vi.fn(({ onNext, onPrevious }) => (
        <div>
            <span>Mock SecaoNaoFurtoERoubo</span>
            <button onClick={onNext}>Próximo</button>
            <button onClick={onPrevious}>Anterior</button>
        </div>
    )),
}));

vi.mock("./SecaoFinal", () => ({
    default: vi.fn(({ onNext, onPrevious }) => (
        <div>
            <span>Mock SecaoFinal</span>
            <button onClick={onNext}>Próximo</button>
            <button onClick={onPrevious}>Anterior</button>
        </div>
    )),
}));

vi.mock("../PageHeader/PageHeader", () => ({
    default: vi.fn(({ onClickBack }) => (
        <div>
            <button onClick={onClickBack}>Voltar</button>
        </div>
    )),
}));

vi.mock("@/components/stepper/Stepper", () => ({
    Stepper: vi.fn(({ steps, currentStep }) => (
        <div data-testid="mock-stepper">
            <span data-testid="current-step">{currentStep}</span>
            {steps.map((step: { label: string }) => (
                <span key={step.label}>{step.label}</span>
            ))}
        </div>
    )),
}));

const mockReset = vi.fn();
const mockInvalidateQueries = vi.fn();
const queryClient = new QueryClient();

const setupStoreMock = (
    formData: Record<string, unknown>,
    uuid: string | null = null
) => {
    const mockStore = {
        formData,
        ocorrenciaUuid: uuid,
        reset: mockReset,
        setFormData: vi.fn(),
        setSavedFormData: vi.fn(),
        setOcorrenciaUuid: vi.fn(),
        savedFormData: {},
    };

    vi.doMock("@/stores/useOcorrenciaFormStore", () => ({
        useOcorrenciaFormStore: (
            selector?: (state: typeof mockStore) => unknown
        ) => {
            if (typeof selector === "function") {
                return selector(mockStore);
            }
            return mockStore;
        },
    }));
};

vi.doMock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query");
    return {
        ...(actual as object),
        useQueryClient: () => ({
            ...queryClient,
            invalidateQueries: mockInvalidateQueries,
        }),
    };
});

vi.doMock("@/stores/useUserStore", mockUseUserStore);

describe("CadastrarOcorrencia - Coordenador de Steps", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockInvalidateQueries.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.resetModules();
    });

    it("1. deve renderizar SecaoInicial no step 1 por padrão", async () => {
        setupStoreMock({});

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia />);

        expect(screen.getByText("Mock SecaoInicial")).toBeInTheDocument();
        expect(screen.getByTestId("current-step")).toHaveTextContent("1");
    });

    it("2. deve navegar para SecaoFurtoERoubo (step 2) se tipoOcorrencia é 'Sim'", async () => {
        setupStoreMock({ tipoOcorrencia: "Sim" });

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia />);

        fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

        await waitFor(() => {
            expect(
                screen.getByText("Mock SecaoFurtoERoubo")
            ).toBeInTheDocument();
        });
        expect(screen.getByTestId("current-step")).toHaveTextContent("2");
    });

    it("3. deve navegar para SecaoNaoFurtoERoubo (step 2) se tipoOcorrencia é 'Não'", async () => {
        setupStoreMock({ tipoOcorrencia: "Não" });

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia />);

        fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

        await waitFor(() => {
            expect(
                screen.getByText("Mock SecaoNaoFurtoERoubo")
            ).toBeInTheDocument();
        });
        expect(screen.getByTestId("current-step")).toHaveTextContent("2");
    });

    it("4. deve navegar para SecaoFinal (step 3) ao avançar do step 2 (Não furto/roubo)", async () => {
        setupStoreMock({ tipoOcorrencia: "Não" });

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia initialStep={2} />);

        expect(
            screen.getByText("Mock SecaoNaoFurtoERoubo")
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

        await waitFor(() => {
            expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
        });
        expect(screen.getByTestId("current-step")).toHaveTextContent("3");
    });

    it("4b. deve navegar para SecaoFinal (step 3) ao avançar do step 2 (Furto/roubo)", async () => {
        setupStoreMock({ tipoOcorrencia: "Sim" });

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia initialStep={2} />);

        expect(screen.getByText("Mock SecaoFurtoERoubo")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

        await waitFor(() => {
            expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
        });
        expect(screen.getByTestId("current-step")).toHaveTextContent("3");
    });

    it("5. deve voltar para SecaoInicial (step 1) ao retroceder do step 2 (Furto/roubo)", async () => {
        setupStoreMock({ tipoOcorrencia: "Sim" });

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia initialStep={2} />);

        expect(screen.getByText("Mock SecaoFurtoERoubo")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

        await waitFor(() => {
            expect(screen.getByText("Mock SecaoInicial")).toBeInTheDocument();
        });
        expect(screen.getByTestId("current-step")).toHaveTextContent("1");
    });

    it("5a. deve voltar para SecaoInicial (step 1) ao retroceder do step 2 (Não furto/roubo)", async () => {
        setupStoreMock({ tipoOcorrencia: "Não" });

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia initialStep={2} />);

        expect(
            screen.getByText("Mock SecaoNaoFurtoERoubo")
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

        await waitFor(() => {
            expect(screen.getByText("Mock SecaoInicial")).toBeInTheDocument();
        });
        expect(screen.getByTestId("current-step")).toHaveTextContent("1");
    });

    it("5b. deve avançar do step 3 ao clicar em Próximo na SecaoFinal", async () => {
        setupStoreMock({ possuiInfoAgressorVitima: "Não" });

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia initialStep={3} />);

        expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
        expect(screen.getByTestId("current-step")).toHaveTextContent("3");

        fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

        await waitFor(() => {
            expect(screen.getByTestId("current-step")).toHaveTextContent("4");
        });
    });

    it("5c. deve voltar para step 2 ao clicar em Anterior na SecaoFinal", async () => {
        setupStoreMock({ tipoOcorrencia: "Sim" });

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia initialStep={3} />);

        expect(screen.getByText("Mock SecaoFinal")).toBeInTheDocument();
        expect(screen.getByTestId("current-step")).toHaveTextContent("3");

        fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

        await waitFor(() => {
            expect(
                screen.getByText("Mock SecaoFurtoERoubo")
            ).toBeInTheDocument();
        });
        expect(screen.getByTestId("current-step")).toHaveTextContent("2");
    });

    it("6. deve chamar reset e invalidateQueries ao clicar no 'Voltar' do PageHeader", async () => {
        const testUuid = "uuid-123";
        setupStoreMock({}, testUuid);

        const mod = await import("./index");
        const CadastrarOcorrencia = mod.default;
        renderWithClient(<CadastrarOcorrencia />);

        const voltarButton = screen.getByRole("button", { name: "Voltar" });
        fireEvent.click(voltarButton);

        await waitFor(() => {
            expect(mockReset).toHaveBeenCalledTimes(1);
            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ["ocorrencia", testUuid],
            });
        });
    });

    describe("7. Labels Dinâmicos do Stepper", () => {
        it("deve exibir 'Fase 02' quando tipoOcorrencia não está definido", async () => {
            setupStoreMock({});

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            expect(screen.getByText("Fase 02")).toBeInTheDocument();
        });

        it("deve exibir 'Formulário patrimonial' se tipoOcorrencia é 'Sim'", async () => {
            setupStoreMock({ tipoOcorrencia: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            expect(
                screen.getByText("Formulário patrimonial")
            ).toBeInTheDocument();
        });

        it("deve exibir 'Formulário geral' se tipoOcorrencia é 'Não'", async () => {
            setupStoreMock({ tipoOcorrencia: "Não" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia />);

            expect(screen.getByText("Formulário geral")).toBeInTheDocument();
        });

        it("deve exibir 'Informações adicionais' no step 3 se possuiInfoAgressorVitima é 'Sim'", async () => {
            setupStoreMock({ possuiInfoAgressorVitima: "Sim" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={3} />);

            expect(
                screen.getByText("Informações adicionais")
            ).toBeInTheDocument();
        });

        it("deve exibir 'Seção final' no step 3 se possuiInfoAgressorVitima é 'Não'", async () => {
            setupStoreMock({ possuiInfoAgressorVitima: "Não" });

            const mod = await import("./index");
            const CadastrarOcorrencia = mod.default;
            renderWithClient(<CadastrarOcorrencia initialStep={3} />);

            expect(screen.getByText("Seção final")).toBeInTheDocument();
        });
    });
});
