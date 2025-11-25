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
    mutateAsyncMock.mockResolvedValue({
      success: false,
      error: "Falha no servidor",
    });
    setup();
    const input = screen.getByTestId("input-motivo");
    await userEvent.type(input, "Motivo válido");
    await userEvent.click(screen.getByRole("button", { name: /Finalizar/i }));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "error",
        title: "Erro ao finalizar etapa",
        description: "Falha no servidor",
      });
    });
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

  it("retorna dados do mockDREApiResponse quando perfilUsuario é 'dre'", async () => {
    setup(true, "dre");
    const input = screen.getByTestId("input-motivo");
    await userEvent.type(input, "Motivo válido");
    const finalizarButton = screen.getByRole("button", { name: /Finalizar/i });
    await userEvent.click(finalizarButton);
    await waitFor(() => {
      expect(screen.getByText("GIPE-2025/0099")).toBeInTheDocument();
    });
  });

  it("não faz nada quando perfilUsuario não é reconhecido", async () => {
    setup(true, "perfilInexistente");
    const input = screen.getByTestId("input-motivo");
    await userEvent.type(input, "Motivo válido");
    const finalizarButton = screen.getByRole("button", { name: /Finalizar/i });
    await userEvent.click(finalizarButton);
    await waitFor(() => {
      expect(screen.getByText("Conclusão de etapa")).toBeInTheDocument();
    });
  });

  it("renderiza null para campos que não incluem o perfilUsuario", async () => {
    setup(true, "perfilInexistente");
    mutateAsyncMock.mockResolvedValue({
      success: true,
      data: { protocolo_da_intercorrencia: "PROTO-123" },
    });
    const input = screen.getByTestId("input-motivo");
    await userEvent.type(input, "Motivo válido");
    await userEvent.click(screen.getByRole("button", { name: /Finalizar/i }));
    await waitFor(() => {
      const camposRenderizados = screen.queryAllByText(
        /Responsável|CPF|E-mail|Perfil de acesso|Diretoria Regional|Unidade Educacional/
      );
      expect(camposRenderizados.length).toBe(0);
    });
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

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("renderiza todos os campos para perfil 'diretor' com dados completos", async () => {
    mutateAsyncMock.mockResolvedValue({
      success: true,
      data: {
        uuid: "abc123",
        responsavel_nome: "João Silva",
        responsavel_cpf: "123.456.789-00",
        responsavel_email: "joao@email.com",
        perfil_acesso: "diretor",
        nome_dre: "DRE Sul",
        nome_unidade: "EMEF Teste",
        protocolo_da_intercorrencia: "PROTO-2025-001",
        unidade_codigo_eol: "123",
        dre_codigo_eol: "456",
        finalizado_diretor_em: "",
        finalizado_diretor_por: "",
        motivo_encerramento_ue: "",
        status_display: "finalizado",
        status_extra: "finalizado"
      },
    });

    setup(true, "diretor");
    
    const input = screen.getByTestId("input-motivo");
    await userEvent.type(input, "Motivo válido para finalizar");
    await userEvent.click(screen.getByRole("button", { name: /Finalizar/i }));

    await waitFor(() => {
      expect(screen.getByText("Ocorrência registrada com sucesso!")).toBeInTheDocument();
    });

    expect(screen.getByTestId("campo-responsavel_nome")).toHaveTextContent("João Silva");
    expect(screen.getByTestId("campo-responsavel_cpf")).toHaveTextContent("123.456.789-00");
    expect(screen.getByTestId("campo-responsavel_email")).toHaveTextContent("joao@email.com");
    expect(screen.getByTestId("campo-perfil_acesso")).toHaveTextContent("diretor");
    expect(screen.getByTestId("campo-nome_dre")).toHaveTextContent("DRE Sul");
    expect(screen.getByTestId("campo-nome_unidade")).toHaveTextContent("EMEF Teste");
  });

  it("renderiza campos para perfil 'assistente' com dados completos", async () => {
    mutateAsyncMock.mockResolvedValue({
      success: true,
      data: {
        uuid: "xyz789",
        responsavel_nome: "Maria Santos",
        responsavel_cpf: "987.654.321-00",
        responsavel_email: "maria@email.com",
        perfil_acesso: "assistente",
        nome_dre: "DRE Norte",
        nome_unidade: "EMEI Exemplo",
        protocolo_da_intercorrencia: "PROTO-2025-002",
        unidade_codigo_eol: "789",
        dre_codigo_eol: "012",
        finalizado_diretor_em: "",
        finalizado_diretor_por: "",
        motivo_encerramento_ue: "",
        status_display: "finalizado",
        status_extra: "finalizado"
      },
    });

    setup(true, "assistente");
    
    const input = screen.getByTestId("input-motivo");
    await userEvent.type(input, "Motivo de encerramento válido");
    await userEvent.click(screen.getByRole("button", { name: /Finalizar/i }));

    await waitFor(() => {
      expect(screen.getByText("Ocorrência registrada com sucesso!")).toBeInTheDocument();
    });

    expect(screen.getByTestId("campo-responsavel_nome")).toHaveTextContent("Maria Santos");
    expect(screen.getByTestId("campo-responsavel_cpf")).toHaveTextContent("987.654.321-00");
    expect(screen.getByTestId("campo-responsavel_email")).toHaveTextContent("maria@email.com");
    expect(screen.getByTestId("campo-perfil_acesso")).toHaveTextContent("assistente");
    expect(screen.getByTestId("campo-nome_dre")).toHaveTextContent("DRE Norte");
    expect(screen.getByTestId("campo-nome_unidade")).toHaveTextContent("EMEI Exemplo");
  });

  it("renderiza campos para perfil 'dre' exibindo apenas campos permitidos", async () => {
    setup(true, "dre");
    
    const input = screen.getByTestId("input-motivo");
    await userEvent.type(input, "Motivo válido DRE");
    await userEvent.click(screen.getByRole("button", { name: /Finalizar/i }));

    await waitFor(() => {
      expect(screen.getByText("Ocorrência registrada com sucesso!")).toBeInTheDocument();
    });

    expect(screen.getByTestId("campo-responsavel_nome")).toHaveTextContent("Juliana Martins");
    expect(screen.getByTestId("campo-responsavel_cpf")).toHaveTextContent("987.654.321");
    expect(screen.getByTestId("campo-responsavel_email")).toHaveTextContent("juliana.martins@sme.prefeitura.sp.gov.br");
    expect(screen.getByTestId("campo-nome_dre")).toHaveTextContent("DRE Butantã");
    
    expect(screen.queryByTestId("campo-perfil_acesso")).not.toBeInTheDocument();
    expect(screen.queryByTestId("campo-nome_unidade")).not.toBeInTheDocument();
  });

  it("renderiza campos vazios quando apiData tem valores null ou undefined", async () => {
    mutateAsyncMock.mockResolvedValue({
      success: true,
      data: {
        uuid: "test-uuid",
        responsavel_nome: null,
        responsavel_cpf: undefined,
        responsavel_email: "",
        perfil_acesso: "diretor",
        nome_dre: null,
        nome_unidade: undefined,
        protocolo_da_intercorrencia: "PROTO-2025-003",
        unidade_codigo_eol: "111",
        dre_codigo_eol: "222",
        finalizado_diretor_em: "",
        finalizado_diretor_por: "",
        motivo_encerramento_ue: "",
        status_display: "finalizado",
        status_extra: "finalizado"
      },
    });

    setup(true, "diretor");
    
    const input = screen.getByTestId("input-motivo");
    await userEvent.type(input, "Motivo com campos vazios");
    await userEvent.click(screen.getByRole("button", { name: /Finalizar/i }));

    await waitFor(() => {
      expect(screen.getByText("Ocorrência registrada com sucesso!")).toBeInTheDocument();
    });

    const campoNome = screen.getByTestId("campo-responsavel_nome");
    expect(campoNome).toHaveTextContent("Responsável:");
    
    const campoCpf = screen.getByTestId("campo-responsavel_cpf");
    expect(campoCpf).toHaveTextContent("CPF:");
  });
});