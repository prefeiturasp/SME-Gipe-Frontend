import { OcorrenciaDetalheAPI } from "@/actions/obter-ocorrencia";
import { useGetOcorrencia } from "@/hooks/useGetOcorrencia";
import { useGetOcorrenciaDre } from "@/hooks/useGetOcorrenciaDre";
import { useGetOcorrenciaGipe } from "@/hooks/useGetOcorrenciaGipe";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import EditarOcorrenciaPage from "./page";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
    useParams: () => ({
        uuid: "test-uuid-123",
    }),
}));

vi.mock("@/hooks/useGetOcorrencia");
vi.mock("@/hooks/useGetOcorrenciaDre");
vi.mock("@/hooks/useGetOcorrenciaGipe");
vi.mock("@/stores/useOcorrenciaFormStore");

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );
};

describe("EditarOcorrenciaPage", () => {
    const mockUseGetOcorrencia = useGetOcorrencia as Mock;
    const mockUseGetOcorrenciaDre = useGetOcorrenciaDre as Mock;
    const mockUseGetOcorrenciaGipe = useGetOcorrenciaGipe as Mock;
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
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

        mockUseGetOcorrenciaDre.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
            error: null,
        });

        mockUseGetOcorrenciaGipe.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
            error: null,
        });
    });

    it("deve renderizar o componente CadastrarOcorrencia com os elementos principais", () => {
        renderWithClient(<EditarOcorrenciaPage />);

        expect(
            screen.getByRole("heading", {
                name: /intercorrências institucionais/i,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: /nova ocorrência/i }),
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /preencha as informações abaixo para registrar uma nova ocorrência/i,
            ),
        ).toBeInTheDocument();

        expect(screen.getByText("Cadastro de ocorrência")).toBeInTheDocument();
        expect(screen.getByText("Fase 02")).toBeInTheDocument();
        expect(screen.getByText("Fase 03")).toBeInTheDocument();
        expect(screen.getByText("Anexos")).toBeInTheDocument();
    });

    it("deve exibir 'Formulário patrimonial' quando tipoOcorrencia é Sim", async () => {
        const mockData: OcorrenciaDetalheAPI = {
            id: 1,
            uuid: "test-uuid",
            data_ocorrencia: "2025-10-15",
            descricao_ocorrencia: "Descrição da ocorrência",
            tipos_ocorrencia: [{ uuid: "tipo-1", nome: "Tipo 1" }],
            unidade_codigo_eol: "094765",
            dre_codigo_eol: "108300",
            sobre_furto_roubo_invasao_depredacao: true,
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

        let currentFormData = {};
        const mockStoreState = {
            setFormData: vi.fn((data) => {
                currentFormData = data;
            }),
            setSavedFormData: vi.fn(),
            setOcorrenciaUuid: vi.fn(),
            reset: vi.fn(),
            get formData() {
                return currentFormData;
            },
            savedFormData: {},
            ocorrenciaUuid: null,
        };

        mockUseOcorrenciaFormStore.mockImplementation(
            (selector?: (state: typeof mockStoreState) => unknown) => {
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        await waitFor(() => {
            expect(
                screen.getByText("Formulário patrimonial"),
            ).toBeInTheDocument();
        });
    });

    it("deve exibir 'Formulário geral' quando tipoOcorrencia é Não", async () => {
        const mockData: OcorrenciaDetalheAPI = {
            id: 2,
            uuid: "test-uuid",
            data_ocorrencia: "2025-10-15",
            descricao_ocorrencia: "Descrição da ocorrência",
            tipos_ocorrencia: [{ uuid: "tipo-1", nome: "Tipo 1" }],
            unidade_codigo_eol: "094765",
            dre_codigo_eol: "108300",
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

        let currentFormData = {};
        const mockStoreState = {
            setFormData: vi.fn((data) => {
                currentFormData = data;
            }),
            setSavedFormData: vi.fn(),
            setOcorrenciaUuid: vi.fn(),
            reset: vi.fn(),
            get formData() {
                return currentFormData;
            },
            savedFormData: {},
            ocorrenciaUuid: null,
        };

        mockUseOcorrenciaFormStore.mockImplementation(
            (selector?: (state: typeof mockStoreState) => unknown) => {
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        await waitFor(() => {
            expect(screen.getByText("Formulário geral")).toBeInTheDocument();
        });
    });

    it("deve exibir loading enquanto carrega os dados", () => {
        mockUseGetOcorrencia.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
        });

        renderWithClient(<EditarOcorrenciaPage />);

        expect(
            screen.getByText("Carregando ocorrência..."),
        ).toBeInTheDocument();
    });

    it("deve exibir mensagem de erro quando falhar ao buscar dados", () => {
        mockUseGetOcorrencia.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: new Error("Ocorrência não encontrada"),
        });

        renderWithClient(<EditarOcorrenciaPage />);

        expect(screen.getByText(/erro ao buscar dados/i)).toBeInTheDocument();
        expect(
            screen.getByText(/ocorrência não encontrada/i),
        ).toBeInTheDocument();
    });

    it("deve transformar corretamente os dados da API para o formato do formulário", () => {
        const mockData = {
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
            smart_sampa_situacao: "sim" as const,
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        expect(mockStoreState.setOcorrenciaUuid).toHaveBeenCalledWith(
            "test-uuid-456",
        );

        expect(mockStoreState.setFormData).toHaveBeenCalledWith(
            expect.objectContaining({
                dataOcorrencia: "2024-03-20",
                dre: "108400",
                unidadeEducacional: "654321",
                tipoOcorrencia: "Sim",
                tiposOcorrencia: ["uuid-1", "uuid-2"],
                descricao: "Descrição detalhada da ocorrência",
                smartSampa: "Sim",
            }),
        );
    });

    it("deve transformar corretamente quando sobre_furto_roubo_invasao_depredacao é false", () => {
        const mockData = {
            id: 3,
            uuid: "test-uuid-789",
            data_ocorrencia: "2024-05-10T09:00:00Z",
            unidade_codigo_eol: "111111",
            dre_codigo_eol: "108500",
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        expect(mockStoreState.setFormData).toHaveBeenCalledWith(
            expect.objectContaining({
                tipoOcorrencia: "Não",
            }),
        );
    });

    it("deve lidar com smartSampa inválido ignorando o valor", () => {
        const mockData = {
            id: 4,
            uuid: "test-uuid-invalid",
            data_ocorrencia: "2024-06-15T12:00:00Z",
            unidade_codigo_eol: "222222",
            dre_codigo_eol: "108600",
            sobre_furto_roubo_invasao_depredacao: false,
            user_username: "20090388003",
            status: "em_preenchimento_diretor",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
            smart_sampa_situacao: "valor-invalido" as "sim" | "nao",
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        const callArgs = mockStoreState.setFormData.mock.calls[0][0];
        expect(callArgs).not.toHaveProperty("smartSampa");
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        const { unmount } = renderWithClient(<EditarOcorrenciaPage />);

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

        renderWithClient(<EditarOcorrenciaPage />);

        expect(screen.getByText(/erro ao buscar dados/i)).toBeInTheDocument();
        expect(
            screen.getByText((content, element) => {
                return (
                    element?.textContent === "String de erro simples" ||
                    content.includes("String de erro simples")
                );
            }),
        ).toBeInTheDocument();
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        expect(mockStoreState.setFormData).toHaveBeenCalled();
        expect(mockStoreState.setOcorrenciaUuid).toHaveBeenCalledWith(
            "test-uuid-loading",
        );
    });

    it("deve lidar com data_ocorrencia vazia", () => {
        const mockData = {
            id: 6,
            uuid: "test-uuid-empty-date",
            data_ocorrencia: "",
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        expect(mockStoreState.setFormData).toHaveBeenCalledWith(
            expect.objectContaining({
                dataOcorrencia: "",
            }),
        );
    });

    it("deve transformar todos os campos da SecaoFinal quando todos estiverem presentes", () => {
        const mockData = {
            id: 10,
            uuid: "test-uuid-completo",
            data_ocorrencia: "2024-11-25T16:30:00Z",
            unidade_codigo_eol: "888888",
            dre_codigo_eol: "109200",
            sobre_furto_roubo_invasao_depredacao: false,
            user_username: "20090388003",
            status: "em_preenchimento_diretor",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
            comunicacao_seguranca_publica: "sim_pm" as const,
            protocolo_acionado: "alerta" as const,
            declarante_detalhes: {
                uuid: "declarante-uuid-456",
                declarante: "NAAPA",
            },
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        expect(mockStoreState.setFormData).toHaveBeenCalledWith(
            expect.objectContaining({
                comunicacaoSeguranca: "Sim, com a PM",
                protocoloAcionado: "Alerta",
                declarante: "declarante-uuid-456",
            }),
        );
    });

    it("deve renderizar CadastrarOcorrencia quando status é 'em_preenchimento_diretor'", async () => {
        const mockData = {
            id: 11,
            uuid: "test-uuid-preenchimento",
            data_ocorrencia: "2024-11-25T16:30:00Z",
            unidade_codigo_eol: "999999",
            dre_codigo_eol: "109300",
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

        let currentFormData = {};
        const mockStoreState = {
            setFormData: vi.fn((data) => {
                currentFormData = data;
            }),
            setSavedFormData: vi.fn(),
            setOcorrenciaUuid: vi.fn(),
            reset: vi.fn(),
            get formData() {
                return currentFormData;
            },
            savedFormData: {},
            ocorrenciaUuid: null,
        };

        mockUseOcorrenciaFormStore.mockImplementation(
            (selector?: (state: typeof mockStoreState) => unknown) => {
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        await waitFor(() => {
            expect(
                screen.getByRole("heading", { name: /nova ocorrência/i }),
            ).toBeInTheDocument();
        });

        expect(
            screen.queryByRole("heading", { name: /visualizar ocorrência/i }),
        ).not.toBeInTheDocument();
    });

    it("deve renderizar VisualizarOcorrencia quando status não é 'em_preenchimento_diretor'", async () => {
        const mockData = {
            id: 12,
            uuid: "test-uuid-finalizado",
            data_ocorrencia: "2024-11-25T16:30:00Z",
            unidade_codigo_eol: "101010",
            dre_codigo_eol: "109400",
            sobre_furto_roubo_invasao_depredacao: false,
            user_username: "20090388003",
            status: "finalizado",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
        };

        mockUseGetOcorrencia.mockReturnValue({
            data: mockData,
            isLoading: false,
            isError: false,
            error: null,
        });

        mockUseGetOcorrenciaDre.mockReturnValue({
            data: {
                id: 1,
                uuid: "test-uuid-finalizado",
                unidade_codigo_eol: "101010",
                dre_codigo_eol: "109400",
                status: "finalizado",
                status_display: "Finalizado",
                status_extra: "",
                acionamento_seguranca_publica: false,
                interlocucao_sts: false,
                info_complementar_sts: "",
                interlocucao_cpca: false,
                info_complementar_cpca: "",
                interlocucao_supervisao_escolar: false,
                info_complementar_supervisao_escolar: "",
                interlocucao_naapa: false,
                info_complementar_naapa: "",
            },
            isLoading: false,
            isError: false,
            error: null,
        });

        let currentFormData = {};
        const mockStoreState = {
            setFormData: vi.fn((data) => {
                currentFormData = data;
            }),
            setSavedFormData: vi.fn(),
            setOcorrenciaUuid: vi.fn(),
            reset: vi.fn(),
            get formData() {
                return currentFormData;
            },
            savedFormData: {},
            ocorrenciaUuid: null,
        };

        mockUseOcorrenciaFormStore.mockImplementation(
            (selector?: (state: typeof mockStoreState) => unknown) => {
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        await waitFor(() => {
            expect(
                screen.getByRole("heading", { name: /Nova ocorrência/i }),
            ).toBeInTheDocument();
        });
    });

    it("deve renderizar VisualizarOcorrencia quando status é 'aguardando_validacao'", async () => {
        const mockData = {
            id: 13,
            uuid: "test-uuid-aguardando",
            data_ocorrencia: "2024-11-25T16:30:00Z",
            unidade_codigo_eol: "111111",
            dre_codigo_eol: "109500",
            sobre_furto_roubo_invasao_depredacao: false,
            user_username: "20090388003",
            status: "aguardando_validacao",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
        };

        mockUseGetOcorrencia.mockReturnValue({
            data: mockData,
            isLoading: false,
            isError: false,
            error: null,
        });

        mockUseGetOcorrenciaDre.mockReturnValue({
            data: {
                id: 1,
                uuid: "test-uuid-aguardando",
                unidade_codigo_eol: "111111",
                dre_codigo_eol: "109500",
                status: "aguardando_validacao",
                status_display: "Aguardando validação",
                status_extra: "",
                acionamento_seguranca_publica: false,
                interlocucao_sts: false,
                info_complementar_sts: "",
                interlocucao_cpca: false,
                info_complementar_cpca: "",
                interlocucao_supervisao_escolar: false,
                info_complementar_supervisao_escolar: "",
                interlocucao_naapa: false,
                info_complementar_naapa: "",
            },
            isLoading: false,
            isError: false,
            error: null,
        });

        let currentFormData = {};
        const mockStoreState = {
            setFormData: vi.fn((data) => {
                currentFormData = data;
            }),
            setSavedFormData: vi.fn(),
            setOcorrenciaUuid: vi.fn(),
            reset: vi.fn(),
            get formData() {
                return currentFormData;
            },
            savedFormData: {},
            ocorrenciaUuid: null,
        };

        mockUseOcorrenciaFormStore.mockImplementation(
            (selector?: (state: typeof mockStoreState) => unknown) => {
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        await waitFor(() => {
            expect(
                screen.getByRole("heading", { name: /Nova ocorrência/i }),
            ).toBeInTheDocument();
        });
    });

    it("deve carregar dados do GIPE quando status é 'enviado_para_gipe'", async () => {
        const mockDataUe = {
            id: 1,
            uuid: "test-uuid-gipe",
            data_ocorrencia: "2024-12-01T10:00:00Z",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            sobre_furto_roubo_invasao_depredacao: false,
            user_username: "20090388003",
            status: "enviado_para_gipe",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
        };

        const mockDataDre = {
            uuid: "test-uuid-gipe",
            agressao_fisica: true,
            agressao_verbal: false,
        };

        const mockDataGipe = {
            uuid: "test-uuid-gipe",
            envolvido: "estudante",
            tipos_ocorrencia_detalhes: [
                { uuid: "tipo-uuid-1", nome: "Violência física" },
            ],
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "verbal",
            motivacao_ocorrencia: ["bullying"],
            etapa_escolar: "fundamental_i",
            info_sobre_interacoes_virtuais_pessoa_agressora: "Info virtual",
            encaminhamentos_gipe: "Encaminhamentos GIPE",
        };

        mockUseGetOcorrencia.mockReturnValue({
            data: mockDataUe,
            isLoading: false,
            isError: false,
            error: null,
        });

        mockUseGetOcorrenciaDre.mockReturnValue({
            data: mockDataDre,
            isLoading: false,
            isError: false,
            error: null,
        });

        mockUseGetOcorrenciaGipe.mockReturnValue({
            data: mockDataGipe,
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        await waitFor(() => {
            expect(mockStoreState.setFormData).toHaveBeenCalledWith(
                expect.objectContaining({
                    ameacaRealizada: "verbal",
                    etapaEscolar: "fundamental_i",
                    encaminhamentos: "Encaminhamentos GIPE",
                    envolveArmaOuAtaque: "sim",
                    informacoesInteracoesVirtuais: "Info virtual",
                }),
            );
        });

        expect(mockUseGetOcorrenciaGipe).toHaveBeenCalledWith("test-uuid-123", {
            enabled: true,
        });
    });

    it("não deve carregar dados do GIPE quando status não é 'enviado_para_gipe'", () => {
        const mockData = {
            id: 2,
            uuid: "test-uuid-sem-gipe",
            data_ocorrencia: "2024-12-01T10:00:00Z",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
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

        mockUseGetOcorrenciaGipe.mockReturnValue({
            data: undefined,
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        expect(mockUseGetOcorrenciaGipe).toHaveBeenCalledWith("test-uuid-123", {
            enabled: false,
        });
    });

    it("deve exibir loading enquanto aguarda dados do GIPE", () => {
        const mockData = {
            id: 3,
            uuid: "test-uuid-loading-gipe",
            data_ocorrencia: "2024-12-01T10:00:00Z",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            sobre_furto_roubo_invasao_depredacao: false,
            user_username: "20090388003",
            status: "enviado_para_gipe",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
        };

        mockUseGetOcorrencia.mockReturnValue({
            data: mockData,
            isLoading: false,
            isError: false,
            error: null,
        });

        mockUseGetOcorrenciaDre.mockReturnValue({
            data: { uuid: "test-uuid-loading-gipe" },
            isLoading: false,
            isError: false,
            error: null,
        });

        mockUseGetOcorrenciaGipe.mockReturnValue({
            data: undefined,
            isLoading: true,
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        expect(
            screen.getByText("Carregando ocorrência..."),
        ).toBeInTheDocument();
    });

    it("deve carregar dados do GIPE quando status é 'finalizada'", async () => {
        const mockData = {
            id: 5,
            uuid: "test-uuid-finalizada",
            data_ocorrencia: "2024-12-01T10:00:00Z",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            sobre_furto_roubo_invasao_depredacao: false,
            user_username: "20090388003",
            status: "finalizada",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
        };

        mockUseGetOcorrencia.mockReturnValue({
            data: mockData,
            isLoading: false,
            isError: false,
            error: null,
        });

        mockUseGetOcorrenciaDre.mockReturnValue({
            data: { uuid: "test-uuid-finalizada" },
            isLoading: false,
            isError: false,
            error: null,
        });

        mockUseGetOcorrenciaGipe.mockReturnValue({
            data: undefined,
            isLoading: true,
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        expect(
            screen.getByText("Carregando ocorrência..."),
        ).toBeInTheDocument();
    });

    it("deve combinar dados de UE, DRE e GIPE quando todos estiverem disponíveis", async () => {
        const mockDataUe = {
            id: 4,
            uuid: "test-uuid-completo",
            data_ocorrencia: "2024-12-01T10:00:00Z",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "108300",
            sobre_furto_roubo_invasao_depredacao: false,
            user_username: "20090388003",
            status: "enviado_para_gipe",
            criado_em: "2025-10-15T14:48:04.383569-03:00",
            atualizado_em: "2025-10-15T14:48:04.383591-03:00",
            tipos_ocorrencia: [{ uuid: "tipo-ue-1", nome: "Tipo UE" }],
        };

        const mockDataDre = {
            uuid: "test-uuid-completo",
            agressao_fisica: true,
            agressao_verbal: true,
        };

        const mockDataGipe = {
            uuid: "test-uuid-completo",
            envolvido: "professor",
            tipos_ocorrencia_detalhes: [
                { uuid: "tipo-gipe-1", nome: "Tipo GIPE 1" },
                { uuid: "tipo-gipe-2", nome: "Tipo GIPE 2" },
            ],
        };

        mockUseGetOcorrencia.mockReturnValue({
            data: mockDataUe,
            isLoading: false,
            isError: false,
            error: null,
        });

        mockUseGetOcorrenciaDre.mockReturnValue({
            data: mockDataDre,
            isLoading: false,
            isError: false,
            error: null,
        });

        mockUseGetOcorrenciaGipe.mockReturnValue({
            data: mockDataGipe,
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
                if (typeof selector === "function") {
                    return selector(mockStoreState);
                }
                return mockStoreState;
            },
        );

        renderWithClient(<EditarOcorrenciaPage />);

        await waitFor(() => {
            expect(mockStoreState.setFormData).toHaveBeenCalledWith(
                expect.objectContaining({
                    tiposOcorrencia: ["tipo-ue-1"],
                }),
            );
        });
    });
});
