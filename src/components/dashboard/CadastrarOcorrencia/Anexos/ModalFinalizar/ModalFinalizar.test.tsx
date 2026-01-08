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

    function setup(open = true, perfilUsuario = "diretor") {
        return render(
            <ModalFinalizar
                open={open}
                onOpenChange={onOpenChange}
                perfilUsuario={perfilUsuario}
            />
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
    });

    it("Renderiza o modal corretamente na primeira fase", () => {
        setup();
        expect(screen.getByText("Conclusão de etapa")).toBeInTheDocument();
        expect(screen.getByTestId("input-motivo")).toBeInTheDocument();
    });

    it("Mostra erro ao tentar enviar com texto insuficiente", async () => {
        setup();
        const input = screen.getByTestId("input-motivo");
        const button = screen.getByRole("button", { name: /Finalizar/i });

        await userEvent.type(input, "oi");
        await userEvent.click(button);

        expect(
            await screen.findByText(
                "O motivo deve ter pelo menos 5 caracteres."
            )
        ).toBeInTheDocument();
    });

    it("Habilita o botão quando o texto é válido", async () => {
        setup();
        const input = screen.getByTestId("input-motivo");
        const button = screen.getByRole("button", { name: /Finalizar/i });

        await userEvent.type(input, "Motivo válido");

        await waitFor(() => {
            expect(button).toBeEnabled();
        });
    });

    // === UE ===
    it("Chama mutateAsync UE com os parâmetros corretos", async () => {
        mutateAsyncMock.mockResolvedValue({
            success: true,
            data: { protocolo_da_intercorrencia: "PROTO-123", uuid: "abc" },
        });

        setup(true, "diretor");

        const input = screen.getByTestId("input-motivo");
        await userEvent.type(input, "Motivo válido");

        const button = screen.getByRole("button", { name: /Finalizar/i });
        await userEvent.click(button);

        await waitFor(() =>
            expect(mutateAsyncMock).toHaveBeenCalledWith({
                ocorrenciaUuid: "uuid-abc-123",
                body: {
                    unidade_codigo_eol: "123456",
                    dre_codigo_eol: "DRE-01",
                    motivo_encerramento_ue: "Motivo válido",
                },
            })
        );
    });

    it("exibe toast de erro quando UE falha", async () => {
        mutateAsyncMock.mockResolvedValue({
            success: false,
            error: "Falha no servidor",
        });

        setup();

        const input = screen.getByTestId("input-motivo");
        await userEvent.type(input, "Motivo válido");
        await userEvent.click(
            screen.getByRole("button", { name: /Finalizar/i })
        );

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                variant: "error",
                title: "Erro ao finalizar etapa",
                description: "Falha no servidor",
            });
        });
    });

    // === DRE ===
    it("retorna dados do mockDREApiResponse quando perfilUsuario é 'dre'", async () => {
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

        const input = screen.getByTestId("input-motivo");
        await userEvent.type(input, "Motivo válido");

        const finalizarButton = screen.getByRole("button", {
            name: /Finalizar/i,
        });
        await userEvent.click(finalizarButton);

        await waitFor(() => {
            expect(
                screen.getByText("Ocorrência registrada com sucesso!")
            ).toBeInTheDocument();
            expect(screen.getByText("GIPE-2025/0099")).toBeInTheDocument();
        });

        expect(mutateAsyncDreMock).toHaveBeenCalledWith({
            ocorrenciaUuid: "uuid-abc-123",
            body: {
                unidade_codigo_eol: "123456",
                dre_codigo_eol: "DRE-01",
                motivo_encerramento_dre: "Motivo válido",
            },
        });
    });

    it("exibe toast de erro quando DRE falha", async () => {
        mutateAsyncDreMock.mockResolvedValue({
            success: false,
            error: "Falha no servidor DRE",
        });

        setup(true, "dre");

        const input = screen.getByTestId("input-motivo");
        await userEvent.type(input, "Motivo válido");

        const finalizarButton = screen.getByRole("button", {
            name: /Finalizar/i,
        });
        await userEvent.click(finalizarButton);

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                variant: "error",
                title: "Erro ao finalizar etapa",
                description: "Falha no servidor DRE",
            });
        });
    });

    // === GIPE ===
    it("Chama mutateAsync GIPE com os parâmetros corretos", async () => {
        mutateAsyncGipeMock.mockResolvedValue({
            success: true,
            data: {
                uuid: "gipe-123",
                protocolo_da_intercorrencia: "GIPE-2025/0100",
            },
        });

        setup(true, "gipe");

        const input = screen.getByTestId("input-motivo");
        await userEvent.type(input, "Motivo GIPE válido");

        const button = screen.getByRole("button", { name: /Finalizar/i });
        await userEvent.click(button);

        await waitFor(() => {
            expect(mutateAsyncGipeMock).toHaveBeenCalledWith({
                ocorrenciaUuid: "uuid-abc-123",
                body: {
                    unidade_codigo_eol: "123456",
                    dre_codigo_eol: "DRE-01",
                    motivo_encerramento_gipe: "Motivo GIPE válido",
                },
            });
        });

        await waitFor(() =>
            expect(
                screen.getByText("Ocorrência registrada com sucesso!")
            ).toBeInTheDocument()
        );
        expect(screen.getByText("GIPE-2025/0100")).toBeInTheDocument();
    });

    it("exibe toast de erro quando GIPE falha", async () => {
        mutateAsyncGipeMock.mockResolvedValue({
            success: false,
            error: "Falha no servidor GIPE",
        });

        setup(true, "gipe");

        const input = screen.getByTestId("input-motivo");
        await userEvent.type(input, "Motivo GIPE válido");

        await userEvent.click(
            screen.getByRole("button", { name: /Finalizar/i })
        );

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                variant: "error",
                title: "Erro ao finalizar etapa",
                description: "Falha no servidor GIPE",
            });
        });
    });

    // === Comportamento geral ===
    it("não faz nada quando perfilUsuario não é reconhecido", async () => {
        setup(true, "perfilInexistente");

        const input = screen.getByTestId("input-motivo");
        await userEvent.type(input, "Motivo válido");

        await userEvent.click(
            screen.getByRole("button", { name: /Finalizar/i })
        );

        await waitFor(() => {
            expect(screen.getByText("Conclusão de etapa")).toBeInTheDocument();
        });

        expect(mutateAsyncMock).not.toHaveBeenCalled();
        expect(mutateAsyncDreMock).not.toHaveBeenCalled();
        expect(mutateAsyncGipeMock).not.toHaveBeenCalled();
    });

    it("O botão Finalizar fica desabilitado quando isPending=true", async () => {
        isPendingFlag = true;
        isPendingFlagDre = true;
        isPendingFlagGipe = true;

        setup();
        const btn = screen.getByRole("button", { name: /Finalizar/i });
        expect(btn).toBeDisabled();
    });

    it("Fecha modal ao clicar em Voltar na primeira fase", async () => {
        const onOpenChangeMock = vi.fn();

        render(
            <ModalFinalizar
                open={true}
                onOpenChange={onOpenChangeMock}
                perfilUsuario="diretor"
            />
        );

        const voltarButton = screen.getByRole("button", { name: /Voltar/i });
        await userEvent.click(voltarButton);

        expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });

    it("Fecha modal ao clicar no X (botão de fechar do Dialog)", async () => {
        const onOpenChangeMock = vi.fn();

        render(
            <ModalFinalizar
                open={true}
                onOpenChange={onOpenChangeMock}
                perfilUsuario="diretor"
            />
        );

        const closeButton = screen.getByRole("button", { name: /close/i });
        await userEvent.click(closeButton);

        expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });

    it("Fecha modal ao clicar em Fechar na segunda fase", async () => {
        mutateAsyncMock.mockResolvedValue({
            success: true,
            data: {
                uuid: "mock-uuid",
                protocolo_da_intercorrencia: "PROTO-XYZ",
                responsavel_nome: "Fulano",
                nome_dre: "DRE CENTRAL",
            },
        });

        setup();

        await userEvent.type(
            screen.getByTestId("input-motivo"),
            "Motivo válido para teste"
        );

        await userEvent.click(
            screen.getByRole("button", { name: /Finalizar/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Ocorrência registrada com sucesso!")
            ).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole("button", { name: /Fechar/i }));

        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
});
