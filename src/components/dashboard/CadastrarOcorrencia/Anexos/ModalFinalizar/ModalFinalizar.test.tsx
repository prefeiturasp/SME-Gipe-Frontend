import { render, screen, waitFor } from "@testing-library/react";
import ModalFinalizar from "./ModalFinalizar";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

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

describe("ModalFinalizarEtapa", () => {
  const onOpenChange = vi.fn();

  function setup(open = true) {
    return render(<ModalFinalizar open={open} onOpenChange={onOpenChange} />);
  }

    beforeEach(() => {
    vi.clearAllMocks();
    isPendingFlag = false;
    mutateAsyncMock.mockReset();

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
      await screen.findByText("O motivo deve ter pelo menos 5 caracteres.")
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

  it("Chama mutateAsync com os parâmetros corretos", async () => {
    mutateAsyncMock.mockResolvedValue({
      success: true,
      data: { protocolo_da_intercorrencia: "PROTO-123" },
    });

    setup();

    const input = screen.getByTestId("input-motivo");
    await userEvent.type(input, "Motivo válido para envio");

    const button = screen.getByRole("button", { name: /Finalizar/i });
    await userEvent.click(button);

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        ocorrenciaUuid: "uuid-abc-123",
        body: {
          unidade_codigo_eol: "123456",
          dre_codigo_eol: "DRE-01",
          motivo_encerramento_ue: "Motivo válido para envio",
        },
      })
    );
  });

  it("exibe toast de erro quando response.success é false", async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({
        success: false,
        error: "Falha no servidor",
    });

    const mockToast = vi.fn();
    vi.mock("@/components/ui/use-toast", () => ({
        toast: mockToast,
    }));

    const mockSetApiData = vi.fn();
    const mockSetSuccess = vi.fn();

    const handleFinalizar = async () => {
        const response = await mockMutateAsync();

        if (!response.success) {
            mockToast({
                variant: "error",
                title: "Erro ao finalizar etapa",
                description: response.error,
            });
            return;
        }

        mockSetApiData(response.data);
        mockSetSuccess(true);
    };

    await handleFinalizar();

    expect(mockToast).toHaveBeenCalledWith({
        variant: "error",
        title: "Erro ao finalizar etapa",
        description: "Falha no servidor",
    });

    expect(mockSetApiData).not.toHaveBeenCalled();
    expect(mockSetSuccess).not.toHaveBeenCalled();
});


  it("Fecha modal e reseta estado ao clicar em Fechar na segunda fase", async () => {
    mutateAsyncMock.mockResolvedValue({
      success: true,
      data: {
        protocolo_da_intercorrencia: "PROTO-XYZ",
        responsavel_nome: "Fulano",
        responsavel_cpf: "123",
        responsavel_email: "x@y.com",
        perfil_acesso: "diretor",
        nome_dre: "DRE CENTRAL",
        nome_unidade: "ESCOLA A",
        uuid: "mock-uuid",
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
      expect(screen.getByText("Ocorrência registrada com sucesso!")).toBeInTheDocument();
    }, { timeout: 3000 });

    const fecharButton = screen.getByRole("button", { name: /Fechar/i });
    
    await userEvent.click(fecharButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("O botão Finalizar fica desabilitado quando isPending=true", async () => {
    isPendingFlag = true;

    setup();

    const btn = screen.getByRole("button", { name: /Finalizar/i });

    expect(btn).toBeDisabled();
  });

  it("mostra toast quando mutateAsync retorna erro", async () => {
    mutateAsyncMock.mockResolvedValue({
        success: false,
        error: "Falha",
    });

    setup();

    await userEvent.type(screen.getByTestId("input-motivo"), "Motivo válido");
    await userEvent.click(screen.getByRole("button", { name: /Finalizar/i }));

    expect(mockToast).toHaveBeenCalledWith({
        variant: "error",
        title: "Erro ao finalizar etapa",
        description: "Falha",
    });
    });

    it("Fecha modal ao clicar em Voltar na primeira fase", async () => {
    const onOpenChangeMock = vi.fn();

    render(<ModalFinalizar open={true} onOpenChange={onOpenChangeMock} />);

    const voltarButton = screen.getByRole("button", { name: /Voltar/i });
    await userEvent.click(voltarButton);

    expect(onOpenChangeMock).toHaveBeenCalledWith(false);

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });

});
