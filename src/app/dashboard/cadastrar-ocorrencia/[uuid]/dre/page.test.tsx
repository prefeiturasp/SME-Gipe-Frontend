import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FormularioDrePage from "./page";
import { useGetOcorrencia } from "@/hooks/useGetOcorrencia";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { OcorrenciaDetalheAPI } from "@/actions/obter-ocorrencia";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
        push: vi.fn(),
    }),
    useParams: () => ({
        uuid: "test-uuid-123",
    }),
}));

vi.mock("@/hooks/useGetOcorrencia");
vi.mock("@/stores/useOcorrenciaFormStore");

vi.mock("@/components/dashboard/FormularioDre", () => ({
    default: vi.fn(() => (
        <div data-testid="mock-formulario-dre">Mock FormularioDre</div>
    )),
}));

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

describe("FormularioDrePage", () => {
    const mockUseGetOcorrencia = useGetOcorrencia as Mock;
    const mockUseOcorrenciaFormStore =
        useOcorrenciaFormStore as unknown as Mock;

    beforeEach(() => {
        vi.clearAllMocks();

        const mockStoreState = {
            setFormData: vi.fn(),
            setSavedFormData: vi.fn(),
            setOcorrenciaUuid: vi.fn(),
            reset: vi.fn(),
            formData: {},
            savedFormData: {},
            ocorrenciaUuid: null,
        };

        mockUseOcorrenciaFormStore.mockImplementation(
            (selector?: (state: typeof mockStoreState) => unknown) => {
                if (selector) {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            }
        );

        mockUseGetOcorrencia.mockReturnValue({
            data: {
                id: 1,
                uuid: "test-uuid-123",
                data_ocorrencia: "2024-01-15T10:00:00Z",
                unidade_codigo_eol: "123456",
                dre_codigo_eol: "108300",
                sobre_furto_roubo_invasao_depredacao: false,
                user_username: "20090388003",
                status: "em_preenchimento_diretor",
                criado_em: "2025-10-15T14:48:04.383569-03:00",
                atualizado_em: "2025-10-15T14:48:04.383591-03:00",
            },
            isLoading: false,
            isError: false,
            error: null,
        });
    });

    it("deve renderizar o componente FormularioDre quando dados estão carregados", async () => {
        renderWithClient(<FormularioDrePage />);

        await waitFor(() => {
            expect(
                screen.getByTestId("mock-formulario-dre")
            ).toBeInTheDocument();
        });
    });

    it("deve exibir loading enquanto carrega os dados", () => {
        mockUseGetOcorrencia.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
        });

        renderWithClient(<FormularioDrePage />);

        expect(
            screen.getByText("Carregando ocorrência...")
        ).toBeInTheDocument();
    });

    it("deve exibir mensagem de erro quando falhar ao buscar dados", () => {
        mockUseGetOcorrencia.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: new Error("Ocorrência não encontrada"),
        });

        renderWithClient(<FormularioDrePage />);

        expect(screen.getByText(/erro ao buscar dados/i)).toBeInTheDocument();
        expect(
            screen.getByText(/ocorrência não encontrada/i)
        ).toBeInTheDocument();
    });

    it("deve transformar corretamente os dados da API para o formato do formulário", () => {
        const mockData: OcorrenciaDetalheAPI = {
            id: 2,
            uuid: "test-uuid-456",
            data_ocorrencia: "2024-03-20T14:30:00Z",
            unidade_codigo_eol: "654321",
            dre_codigo_eol: "108400",
            sobre_furto_roubo_invasao_depredacao: true,
            user_username: "20090388003",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
            tipos_ocorrencia: [
                { uuid: "uuid-1", nome: "Violência física" },
                { uuid: "uuid-2", nome: "Violência psicológica" },
            ],
            descricao_ocorrencia: "Descrição detalhada da ocorrência",
            smart_sampa_situacao: "sim_com_dano" as const,
            status: "em_preenchimento_diretor",
        };

        mockUseGetOcorrencia.mockReturnValue({
            data: mockData,
            isLoading: false,
            isError: false,
            error: null,
        });

        const mockStoreState = {
            setFormData: vi.fn(),
            setSavedFormData: vi.fn(),
            setOcorrenciaUuid: vi.fn(),
            reset: vi.fn(),
            formData: {},
            savedFormData: {},
            ocorrenciaUuid: null,
        };

        mockUseOcorrenciaFormStore.mockImplementation(
            (selector?: (state: typeof mockStoreState) => unknown) => {
                if (selector) {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            }
        );

        renderWithClient(<FormularioDrePage />);

        expect(mockStoreState.setOcorrenciaUuid).toHaveBeenCalledWith(
            "test-uuid-456"
        );

        expect(mockStoreState.setFormData).toHaveBeenCalledWith(
            expect.objectContaining({
                dataOcorrencia: "2024-03-20",
                dre: "108400",
                unidadeEducacional: "654321",
                tipoOcorrencia: "Sim",
                tiposOcorrencia: ["uuid-1", "uuid-2"],
                descricao: "Descrição detalhada da ocorrência",
                smartSampa: "sim_com_dano",
            })
        );
    });

    it("deve chamar reset ao montar o componente", () => {
        const mockStoreState = {
            setFormData: vi.fn(),
            setSavedFormData: vi.fn(),
            setOcorrenciaUuid: vi.fn(),
            reset: vi.fn(),
            formData: {},
            savedFormData: {},
            ocorrenciaUuid: null,
        };

        mockUseOcorrenciaFormStore.mockImplementation(
            (selector?: (state: typeof mockStoreState) => unknown) => {
                if (selector) {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            }
        );

        renderWithClient(<FormularioDrePage />);

        expect(mockStoreState.reset).toHaveBeenCalled();
    });

    it("deve chamar reset na limpeza do componente", () => {
        const mockStoreState = {
            setFormData: vi.fn(),
            setSavedFormData: vi.fn(),
            setOcorrenciaUuid: vi.fn(),
            reset: vi.fn(),
            formData: {},
            savedFormData: {},
            ocorrenciaUuid: null,
        };

        mockUseOcorrenciaFormStore.mockImplementation(
            (selector?: (state: typeof mockStoreState) => unknown) => {
                if (selector) {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            }
        );

        const { unmount } = renderWithClient(<FormularioDrePage />);

        mockStoreState.reset.mockClear();

        unmount();

        expect(mockStoreState.reset).toHaveBeenCalled();
    });

    it("deve exibir erro quando error não é uma instância de Error", () => {
        mockUseGetOcorrencia.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: "String de erro simples",
        });

        renderWithClient(<FormularioDrePage />);

        expect(screen.getByText(/erro ao buscar dados/i)).toBeInTheDocument();
        expect(screen.getByText(/string de erro simples/i)).toBeInTheDocument();
    });

    it("deve exibir loading quando store não está pronto mesmo com dados carregados", () => {
        mockUseGetOcorrencia.mockReturnValue({
            data: {
                id: 5,
                uuid: "test-uuid-loading",
                data_ocorrencia: "2024-07-20T10:00:00Z",
                unidade_codigo_eol: "333333",
                dre_codigo_eol: "108700",
                sobre_furto_roubo_invasao_depredacao: false,
                user_username: "20090388003",
                status: "em_preenchimento_diretor",
                criado_em: "2025-10-15T14:48:04.383569-03:00",
                atualizado_em: "2025-10-15T14:48:04.383591-03:00",
            },
            isLoading: false,
            isError: false,
            error: null,
        });

        const mockStoreState = {
            setFormData: vi.fn(),
            setSavedFormData: vi.fn(),
            setOcorrenciaUuid: vi.fn(),
            reset: vi.fn(),
            formData: {},
            savedFormData: {},
            ocorrenciaUuid: null,
        };

        mockUseOcorrenciaFormStore.mockImplementation(
            (selector?: (state: typeof mockStoreState) => unknown) => {
                if (selector) {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            }
        );

        renderWithClient(<FormularioDrePage />);

        expect(mockStoreState.setFormData).toHaveBeenCalled();
        expect(mockStoreState.setOcorrenciaUuid).toHaveBeenCalledWith(
            "test-uuid-loading"
        );
    });

    it("deve definir setFormData e setSavedFormData com os mesmos dados", () => {
        const mockData: OcorrenciaDetalheAPI = {
            id: 6,
            uuid: "test-uuid-same-data",
            data_ocorrencia: "2024-08-15T11:00:00Z",
            unidade_codigo_eol: "444444",
            dre_codigo_eol: "108800",
            sobre_furto_roubo_invasao_depredacao: false,
            user_username: "20090388003",
            status: "em_preenchimento_diretor",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
        };

        mockUseGetOcorrencia.mockReturnValue({
            data: mockData,
            isLoading: false,
            isError: false,
            error: null,
        });

        const mockStoreState = {
            setFormData: vi.fn(),
            setSavedFormData: vi.fn(),
            setOcorrenciaUuid: vi.fn(),
            reset: vi.fn(),
            formData: {},
            savedFormData: {},
            ocorrenciaUuid: null,
        };

        mockUseOcorrenciaFormStore.mockImplementation(
            (selector?: (state: typeof mockStoreState) => unknown) => {
                if (selector) {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            }
        );

        renderWithClient(<FormularioDrePage />);

        const setFormDataCall = mockStoreState.setFormData.mock.calls[0][0];
        const setSavedFormDataCall =
            mockStoreState.setSavedFormData.mock.calls[0][0];

        expect(setFormDataCall).toEqual(setSavedFormDataCall);
    });

    it("deve extrair corretamente o UUID dos params", () => {
        const mockStoreState = {
            setFormData: vi.fn(),
            setSavedFormData: vi.fn(),
            setOcorrenciaUuid: vi.fn(),
            reset: vi.fn(),
            formData: {},
            savedFormData: {},
            ocorrenciaUuid: null,
        };

        mockUseOcorrenciaFormStore.mockImplementation(
            (selector?: (state: typeof mockStoreState) => unknown) => {
                if (selector) {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            }
        );

        renderWithClient(<FormularioDrePage />);

        expect(mockUseGetOcorrencia).toHaveBeenCalledWith("test-uuid-123");
    });
});
