import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InformacoesAdicionais from "./index";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useCategoriasDisponiveis } from "@/hooks/useCategoriasDisponiveis";

vi.mock("@/stores/useOcorrenciaFormStore");
vi.mock("@/hooks/useCategoriasDisponiveis");

describe("InformacoesAdicionais", () => {
  const mockOnPrevious = vi.fn();
  const mockOnNext = vi.fn();
  const mockSetFormData = vi.fn();

  const queryClient = new QueryClient();

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <InformacoesAdicionais
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      </QueryClientProvider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useOcorrenciaFormStore).mockReturnValue({
      formData: {},
      setFormData: mockSetFormData,
    });
    vi.mocked(useCategoriasDisponiveis).mockReturnValue({
      data: {
        motivo_ocorrencia: [{ label: "Bullying", value: "bullying" }],
        genero: [{ label: "Masculino", value: "masculino" }],
        grupo_etnico_racial: [{ label: "Pardo", value: "pardo" }],
        etapa_escolar: [{ label: "Ensino Fundamental II", value: "ensino_fundamental_2" }],
        frequencia_escolar: [{ label: "Regular", value: "regular" }],
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      refetch: vi.fn(),
      isSuccess: true,
    } as unknown as ReturnType<typeof useCategoriasDisponiveis>);
  });

  it("deve renderizar todos os campos do formulário", () => {
    renderComponent();

    expect(screen.getByLabelText(/Qual o nome da pessoa agressora\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Qual a idade da pessoa agressora\?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite o CEP\.\.\./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Logradouro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Número da residência/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Complemento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Estado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bairro/i)).toBeInTheDocument();
    expect(screen.getByText(/O que motivou a ocorrência\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Qual o gênero\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Qual o grupo étnico-racial\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Qual a etapa escolar\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Qual a frequência escolar\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Como é a interação da pessoa agressora/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quais as redes de proteção/i)).toBeInTheDocument();
    expect(screen.getByText(/A ocorrência foi notificada ao Conselho Tutelar\?/i)).toBeInTheDocument();
    expect(screen.getByText(/A ocorrência foi acompanhada pelo NAAPA\?/i)).toBeInTheDocument();
  });

  it("deve renderizar os botões Anterior e Próximo", () => {
    renderComponent();

    expect(screen.getByRole("button", { name: /Anterior/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Próximo/i })).toBeInTheDocument();
  });

  it("deve chamar onPrevious ao clicar no botão Anterior", async () => {
    const user = userEvent.setup();
    renderComponent();

    const anteriorButton = screen.getByRole("button", { name: /Anterior/i });
    await user.click(anteriorButton);

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    expect(mockSetFormData).toHaveBeenCalled();
  });

  it("deve formatar o CEP corretamente ao digitar", async () => {
    const user = userEvent.setup();
    renderComponent();

    const cepInput = screen.getByPlaceholderText(/Digite o CEP\.\.\./i);
    await user.type(cepInput, "01310100");

    await waitFor(() => {
      expect(cepInput).toHaveValue("01310-100");
    });
  });

  it("deve preencher os campos com dados do store", () => {
    vi.mocked(useOcorrenciaFormStore).mockReturnValue({
      formData: {
        nomeAgressor: "João Silva",
        idadeAgressor: "25",
        cep: "01310-100",
        logradouro: "Avenida Paulista",
        numero: "1578",
        complemento: "Apto 101",
        estado: "SP",
        cidade: "São Paulo",
        bairro: "Bela Vista",
        motivoOcorrencia: ["bullying"],
        genero: "masculino",
        grupoEtnicoRacial: "pardo",
        etapaEscolar: "ensino_fundamental_2",
        frequenciaEscolar: "regular",
        interacaoAmbienteEscolar: "Boa interação",
        redesProtecao: "CRAS",
        notificadoConselhoTutelar: "Sim",
        acompanhadoNAAPA: "Não",
      },
      setFormData: mockSetFormData,
    });

    renderComponent();

    expect(screen.getByLabelText(/Qual o nome da pessoa agressora\?/i)).toHaveValue("João Silva");
    expect(screen.getByLabelText(/Qual a idade da pessoa agressora\?/i)).toHaveValue(25);
    expect(screen.getByPlaceholderText(/Digite o CEP\.\.\./i)).toHaveValue("01310-100");
    expect(screen.getByLabelText(/Logradouro/i)).toHaveValue("Avenida Paulista");
    expect(screen.getByLabelText(/Número da residência/i)).toHaveValue("1578");
    expect(screen.getByLabelText(/Complemento/i)).toHaveValue("Apto 101");
    expect(screen.getByLabelText(/Cidade/i)).toHaveValue("São Paulo");
    expect(screen.getByLabelText(/Bairro/i)).toHaveValue("Bela Vista");
  });

  it("deve validar campos obrigatórios", async () => {
    const user = userEvent.setup();
    renderComponent();

    const proximoButton = screen.getByRole("button", { name: /Próximo/i });
    expect(proximoButton).toBeDisabled();

    const nomeInput = screen.getByLabelText(/Qual o nome da pessoa agressora\?/i);
    await user.type(nomeInput, "João Silva");

    expect(proximoButton).toBeDisabled();
  });

  it("deve exibir mensagem de ajuda para motivo de ocorrência", () => {
    renderComponent();
    expect(screen.getByText(/Se necessário, selecione mais de uma opção/i)).toBeInTheDocument();
  });

  it("deve preencher campos do formulário", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/Qual o nome da pessoa agressora\?/i), "João Silva");
    await user.type(screen.getByLabelText(/Qual a idade da pessoa agressora\?/i), "25");

    expect(screen.getByLabelText(/Qual o nome da pessoa agressora\?/i)).toHaveValue("João Silva");
    expect(screen.getByLabelText(/Qual a idade da pessoa agressora\?/i)).toHaveValue(25);
  });

  it("deve limitar o CEP a 9 caracteres", async () => {
    const user = userEvent.setup();
    renderComponent();

    const cepInput = screen.getByPlaceholderText(/Digite o CEP\.\.\./i);
    await user.type(cepInput, "0131010012345");

    await waitFor(() => {
      expect(cepInput).toHaveValue("01310-100");
    });
  });

  it("deve selecionar opção Não para Conselho Tutelar", async () => {
    const user = userEvent.setup();
    renderComponent();

    const radioNao = screen.getAllByRole("radio", { name: /Não/i });
    await user.click(radioNao[0]);

    expect(radioNao[0]).toBeChecked();
  });

  it("deve selecionar opção Não para NAAPA", async () => {
    const user = userEvent.setup();
    renderComponent();

    const radioNao = screen.getAllByRole("radio", { name: /Não/i });
    await user.click(radioNao[1]);

    expect(radioNao[1]).toBeChecked();
  });

  it("deve chamar onNext e setFormData ao submeter formulário válido", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/Qual o nome da pessoa agressora\?/i), "João Silva");
    await user.type(screen.getByLabelText(/Qual a idade da pessoa agressora\?/i), "25");
    await user.type(screen.getByPlaceholderText(/Digite o CEP\.\.\./i), "01310100");

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Digite o CEP\.\.\./i)).toHaveValue("01310-100");
    });

    await user.type(screen.getByLabelText(/Logradouro/i), "Avenida Paulista");
    await user.type(screen.getByLabelText(/Número da residência/i), "1578");
    await user.type(screen.getByLabelText(/Cidade/i), "São Paulo");
    await user.type(screen.getByLabelText(/Bairro/i), "Bela Vista");
    await user.type(screen.getByLabelText(/Como é a interação da pessoa agressora/i), "Boa interação com todos");
    await user.type(screen.getByLabelText(/Quais as redes de proteção/i), "CRAS e Conselho Tutelar");

    const radioSim = screen.getAllByRole("radio", { name: /Sim/i });
    await user.click(radioSim[0]);
    await user.click(radioSim[1]);

    const estadoTrigger = screen.getByRole("combobox", { name: /Estado/i });
    await user.click(estadoTrigger);
    const spOption = await screen.findByRole("option", { name: /São Paulo/i });
    await user.click(spOption);

    const motivoButton = screen.getByRole("button", { name: /Selecione/i });
    await user.click(motivoButton);
    const bullyingOption = await screen.findByText(/Bullying/i);
    await user.click(bullyingOption);

    const generoTrigger = screen.getByRole("combobox", { name: /Qual o gênero\?/i });
    await user.click(generoTrigger);
    const masculinoOption = await screen.findByRole("option", { name: /Masculino/i });
    await user.click(masculinoOption);

    const grupoTrigger = screen.getByRole("combobox", { name: /Qual o grupo étnico-racial\?/i });
    await user.click(grupoTrigger);
    const pardoOption = await screen.findByRole("option", { name: /Pardo/i });
    await user.click(pardoOption);

    const etapaTrigger = screen.getByRole("combobox", { name: /Qual a etapa escolar\?/i });
    await user.click(etapaTrigger);
    const fundamentalOption = await screen.findByRole("option", { name: /Ensino Fundamental II/i });
    await user.click(fundamentalOption);

    const frequenciaTrigger = screen.getByRole("combobox", { name: /Qual a frequência escolar\?/i });
    await user.click(frequenciaTrigger);
    const regularOptions = await screen.findAllByRole("option", { name: /Regular/i });
    await user.click(regularOptions.at(-1)!);

    await waitFor(() => {
      const proximoButton = screen.getByRole("button", { name: /Próximo/i });
      expect(proximoButton).not.toBeDisabled();
    });

    const proximoButton = screen.getByRole("button", { name: /Próximo/i });
    await user.click(proximoButton);

    await waitFor(() => {
      expect(mockSetFormData).toHaveBeenCalledWith(
        expect.objectContaining({
          nomeAgressor: "João Silva",
          idadeAgressor: "25",
          cep: "01310-100",
          cidade: "São Paulo",
        })
      );
      expect(mockOnNext).toHaveBeenCalled();
    });
  });

  it("deve chamar formatCep corretamente com menos de 5 números", async () => {
    const user = userEvent.setup();
    renderComponent();

    const cepInput = screen.getByPlaceholderText(/Digite o CEP\.\.\./i);
    await user.type(cepInput, "1234");

    await waitFor(() => {
      expect(cepInput).toHaveValue("1234");
    });
  });

  it("deve permitir clicar no botão Pesquisar CEP", async () => {
    const user = userEvent.setup();
    renderComponent();

    const pesquisarCepButton = screen.getByRole("button", { name: /Pesquisar CEP/i });
    await user.click(pesquisarCepButton);
  });

  it("deve lidar com categoriasDisponiveis indefinidas", () => {
    vi.mocked(useCategoriasDisponiveis).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      refetch: vi.fn(),
      isSuccess: true,
    } as unknown as ReturnType<typeof useCategoriasDisponiveis>);

    renderComponent();

    expect(screen.getByText(/O que motivou a ocorrência\?/i)).toBeInTheDocument();
  });
});