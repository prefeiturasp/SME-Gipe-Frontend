import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ModalFinalizar from "./ModalFinalizar";

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

let mockStoreReturn = {
    formData: {
        unidadeEducacional: "123456",
        dre: "DRE-01",
    },
    ocorrenciaUuid: "uuid-abc-123",
};

vi.mock("@/stores/useOcorrenciaFormStore", () => ({
    useOcorrenciaFormStore: () => mockStoreReturn,
}));

// Mocks para UE
const mutateAsyncMock = vi.fn();
let isPendingFlag = false;
vi.mock("@/hooks/useFinalizarEtapa", () => ({
    useFinalizarEtapa: () => ({
        mutateAsync: mutateAsyncMock,
        get isPending() {
            return isPendingFlag;
        },
    }),
}));

// Mocks para DRE
const mutateAsyncDreMock = vi.fn();
let isPendingFlagDre = false;
vi.mock("@/hooks/useFinalizarEtapaDre", () => ({
    useFinalizarEtapaDre: () => ({
        mutateAsync: mutateAsyncDreMock,
        get isPending() {
            return isPendingFlagDre;
        },
    }),
}));

// Mocks para GIPE
const mutateAsyncGipeMock = vi.fn();
let isPendingFlagGipe = false;
vi.mock("@/hooks/useFinalizarEtapaGipe", () => ({
    useFinalizarEtapaGipe: () => ({
        mutateAsync: mutateAsyncGipeMock,
        get isPending() {
            return isPendingFlagGipe;
        },
    }),
}));

describe("ModalFinalizarEtapa", () => {
    const onOpenChange = vi.fn();

    function setup(open = true, etapa = "diretor") {
        return render(
            <ModalFinalizar
                open={open}
                onOpenChange={onOpenChange}
                etapa={etapa}
            />,
        );
    }

    beforeEach(() => {
        vi.clearAllMocks();
        isPendingFlag = false;
        isPendingFlagDre = false;
        isPendingFlagGipe = false;

        mutateAsyncMock.mockReset();
        mutateAsyncDreMock.mockReset();
        mutateAsyncGipeMock.mockReset();

        mockStoreReturn = {
            formData: {
                unidadeEducacional: "123456",
                dre: "DRE-01",
            },
            ocorrenciaUuid: "uuid-abc-123",
        };

        mutateAsyncMock.mockResolvedValue({
            success: true,
            data: {
                uuid: "mock-uuid",
                protocolo_da_intercorrencia: "PROTO-123",
            },
        });
        mutateAsyncDreMock.mockResolvedValue({
            success: true,
            data: {
                uuid: "dre-uuid",
                protocolo_da_intercorrencia: "PROTO-DRE",
            },
        });
        mutateAsyncGipeMock.mockResolvedValue({
            success: true,
            data: {
                uuid: "gipe-uuid",
                protocolo_da_intercorrencia: "PROTO-GIPE",
            },
        });
    });

    it("chama a API automaticamente ao abrir o modal com perfil diretor", async () => {
        setup(true, "diretor");

        await waitFor(() =>
            expect(mutateAsyncMock).toHaveBeenCalledWith({
                ocorrenciaUuid: "uuid-abc-123",
                body: {
                    unidade_codigo_eol: "123456",
                    dre_codigo_eol: "DRE-01",
                },
            }),
        );
    });

    it("chama a API automaticamente ao abrir o modal com perfil assistente", async () => {
        setup(true, "assistente");

        await waitFor(() =>
            expect(mutateAsyncMock).toHaveBeenCalledWith({
                ocorrenciaUuid: "uuid-abc-123",
                body: {
                    unidade_codigo_eol: "123456",
                    dre_codigo_eol: "DRE-01",
                },
            }),
        );
    });

    it("chama a API automaticamente ao abrir o modal com perfil dre", async () => {
        setup(true, "dre");

        await waitFor(() =>
            expect(mutateAsyncDreMock).toHaveBeenCalledWith({
                ocorrenciaUuid: "uuid-abc-123",
                body: {
                    unidade_codigo_eol: "123456",
                    dre_codigo_eol: "DRE-01",
                },
            }),
        );
    });

    it("chama a API automaticamente ao abrir o modal com perfil gipe", async () => {
        setup(true, "gipe");

        await waitFor(() =>
            expect(mutateAsyncGipeMock).toHaveBeenCalledWith({
                ocorrenciaUuid: "uuid-abc-123",
                body: {
                    unidade_codigo_eol: "123456",
                    dre_codigo_eol: "DRE-01",
                },
            }),
        );
    });

    it("notifica loading ao iniciar finalização", async () => {
        mutateAsyncMock.mockReturnValue(new Promise(() => {}));
        const onLoadingChange = vi.fn();
        render(
            <ModalFinalizar
                open={true}
                onOpenChange={onOpenChange}
                etapa="diretor"
                onLoadingChange={onLoadingChange}
            />,
        );

        await waitFor(() => {
            expect(onLoadingChange).toHaveBeenCalledWith(true);
        });
    });

    it("exibe a tela de sucesso com protocolo após finalização UE", async () => {
        mutateAsyncMock.mockResolvedValue({
            success: true,
            data: {
                uuid: "mock-uuid",
                protocolo_da_intercorrencia: "PROTO-123",
                responsavel_nome: "Fulano",
                responsavel_cpf: "12345678900",
                responsavel_email: "fulano@test.com",
                perfil_acesso: "diretor",
                nome_dre: "DRE CENTRAL",
                nome_unidade: "Escola XPTO",
            },
        });

        setup(true, "diretor");

        await waitFor(() => {
            expect(
                screen.getByText("Ocorrência registrada com sucesso!"),
            ).toBeInTheDocument();
        });

        expect(screen.getByText("PROTO-123")).toBeInTheDocument();
        expect(
            screen.getByTestId("campo-responsavel_nome"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("campo-nome_unidade")).toBeInTheDocument();
    });

    it("exibe a tela de sucesso com protocolo após finalização DRE", async () => {
        mutateAsyncDreMock.mockResolvedValue({
            success: true,
            data: {
                uuid: "dre-123",
                protocolo_da_intercorrencia: "GIPE-2025/0099",
                responsavel_nome: "Juliana Martins",
                responsavel_cpf: "987.654.321",
                responsavel_email: "juliana.martins@sme.prefeitura.sp.gov.br",
                nome_dre: "DRE Butantã",
            },
        });

        setup(true, "dre");

        await waitFor(() => {
            expect(
                screen.getByText("Ocorrência registrada com sucesso!"),
            ).toBeInTheDocument();
            expect(screen.getByText("GIPE-2025/0099")).toBeInTheDocument();
        });
    });

    it("exibe a tela de sucesso com protocolo após finalização GIPE", async () => {
        mutateAsyncGipeMock.mockResolvedValue({
            success: true,
            data: {
                uuid: "gipe-123",
                protocolo_da_intercorrencia: "GIPE-2025/0100",
            },
        });

        setup(true, "gipe");

        await waitFor(() => {
            expect(
                screen.getByText("Ocorrência registrada com sucesso!"),
            ).toBeInTheDocument();
            expect(screen.getByText("GIPE-2025/0100")).toBeInTheDocument();
        });
    });

    it("exibe toast de erro e fecha o modal quando UE falha", async () => {
        mutateAsyncMock.mockResolvedValue({
            success: false,
            error: "Falha no servidor",
        });

        setup(true, "diretor");

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                variant: "error",
                title: "Erro ao finalizar etapa",
                description: "Falha no servidor",
            });
        });

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("exibe toast de erro e fecha o modal quando DRE falha", async () => {
        mutateAsyncDreMock.mockResolvedValue({
            success: false,
            error: "Falha no servidor DRE",
        });

        setup(true, "dre");

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                variant: "error",
                title: "Erro ao finalizar etapa",
                description: "Falha no servidor DRE",
            });
        });

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("exibe toast de erro e fecha o modal quando GIPE falha", async () => {
        mutateAsyncGipeMock.mockResolvedValue({
            success: false,
            error: "Falha no servidor GIPE",
        });

        setup(true, "gipe");

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                variant: "error",
                title: "Erro ao finalizar etapa",
                description: "Falha no servidor GIPE",
            });
        });

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("exibe toast de erro quando a API lança exceção inesperada", async () => {
        mutateAsyncMock.mockRejectedValue(new Error("Network error"));

        setup(true, "diretor");

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                variant: "error",
                title: "Erro ao finalizar etapa",
                description: "Ocorreu um erro inesperado. Tente novamente.",
            });
        });

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("não chama a API quando etapa não é reconhecido", async () => {
        setup(true, "perfilInexistente");

        await waitFor(() => {
            expect(mutateAsyncMock).not.toHaveBeenCalled();
            expect(mutateAsyncDreMock).not.toHaveBeenCalled();
            expect(mutateAsyncGipeMock).not.toHaveBeenCalled();
        });
    });

    it("fecha o modal e redireciona ao dashboard ao clicar em Fechar", async () => {
        mutateAsyncMock.mockResolvedValue({
            success: true,
            data: {
                uuid: "mock-uuid",
                protocolo_da_intercorrencia: "PROTO-XYZ",
                responsavel_nome: "Fulano",
                nome_dre: "DRE CENTRAL",
            },
        });

        setup(true, "diretor");

        await waitFor(() => {
            expect(
                screen.getByText("Ocorrência registrada com sucesso!"),
            ).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole("button", { name: /Fechar/i }));

        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });

    it("não chama a API quando o modal está fechado", () => {
        setup(false, "diretor");

        expect(mutateAsyncMock).not.toHaveBeenCalled();
    });

    it("notifica fim do loading após finalização com sucesso", async () => {
        const onLoadingChange = vi.fn();
        render(
            <ModalFinalizar
                open={true}
                onOpenChange={onOpenChange}
                etapa="diretor"
                onLoadingChange={onLoadingChange}
            />,
        );

        await waitFor(() => {
            expect(onLoadingChange).toHaveBeenCalledWith(false);
        });
    });

    it("notifica fim do loading após erro na finalização", async () => {
        mutateAsyncMock.mockResolvedValue({
            success: false,
            error: "Falha no servidor",
        });
        const onLoadingChange = vi.fn();
        render(
            <ModalFinalizar
                open={true}
                onOpenChange={onOpenChange}
                etapa="diretor"
                onLoadingChange={onLoadingChange}
            />,
        );

        await waitFor(() => {
            expect(onLoadingChange).toHaveBeenCalledWith(false);
        });
    });

    it("chama onOpenChange(false) ao fechar o dialog pelo botão X", async () => {
        mutateAsyncMock.mockResolvedValue({
            success: true,
            data: {
                uuid: "mock-uuid",
                protocolo_da_intercorrencia: "PROTO-XYZ",
                responsavel_nome: "Fulano",
            },
        });

        const onOpenChangeMock = vi.fn();
        render(
            <ModalFinalizar
                open={true}
                onOpenChange={onOpenChangeMock}
                etapa="diretor"
            />,
        );

        await waitFor(() => {
            expect(
                screen.getByText("Ocorrência registrada com sucesso!"),
            ).toBeInTheDocument();
        });

        const closeButton = screen.getByRole("button", { name: /close/i });
        await userEvent.click(closeButton);

        expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
});
