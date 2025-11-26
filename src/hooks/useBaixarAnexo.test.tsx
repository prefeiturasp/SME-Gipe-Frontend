import { describe, it, expect, vi, beforeEach } from "vitest";
import * as baixarAnexoAction from "@/actions/baixar-anexo";

vi.mock("@/actions/baixar-anexo");
vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
}));

type MutationFn = NonNullable<
  import("@tanstack/react-query").UseMutationOptions<
    boolean, // retorno da mutation
    Error,
    { uuid: string; nomeArquivo: string }
  >["mutationFn"]
>;

describe("useBaixarAnexo", () => {
  const mockParams = {
    uuid: "test-uuid-123",
    nomeArquivo: "documento.pdf",
  };

    // Função auxiliar para criar o mock e capturar a mutationFn
    const setupMutationMock = () => {
    const mockUseMutation = vi.fn().mockImplementation((options: { mutationFn: MutationFn }) => {
        return {
        mutate: vi.fn(),
        mutateAsync: options.mutationFn, // ← Retorna a mutationFn aqui
        isLoading: false,
        isSuccess: false,
        isError: false,
        };
    });

    return { mockUseMutation };
    };
  const mockBlob = new Blob(["conteúdo do arquivo"], { type: "application/pdf" });

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock das APIs do DOM
    global.URL.createObjectURL = vi.fn(() => "mock-url");
    global.URL.revokeObjectURL = vi.fn();
    
    // Mock do document.createElement
    const mockLink = {
      href: "",
      download: "",
      click: vi.fn(),
      remove: vi.fn(),
    };

    vi.spyOn(document, "createElement").mockReturnValue(mockLink as unknown as HTMLElement);
    vi.spyOn(document.body, "appendChild").mockReturnValue(mockLink as unknown as HTMLElement);
  });

    it("deve executar o fluxo completo de download com sucesso", async () => {
    vi.spyOn(baixarAnexoAction, "baixarAnexo").mockResolvedValue(mockBlob);

    const { mockUseMutation } = setupMutationMock();

    const reactQuery = await import("@tanstack/react-query");
    reactQuery.useMutation = mockUseMutation;

    const { useBaixarAnexo } = await import("./useBaixarAnexo");
    const mutation = useBaixarAnexo();

    const result = await mutation.mutateAsync(mockParams);

    // Verificações
    expect(baixarAnexoAction.baixarAnexo).toHaveBeenCalledWith(mockParams.uuid);
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("mock-url");
    expect(result).toBe(true);
  });

  it("deve configurar o link de download corretamente", async () => {
    const mockLink = {
      href: "",
      download: "",
      click: vi.fn(),
      remove: vi.fn(),
    };

    vi.spyOn(document, "createElement").mockReturnValue(mockLink as unknown as HTMLElement);
    vi.spyOn(baixarAnexoAction, "baixarAnexo").mockResolvedValue(mockBlob);

    const { mockUseMutation } = setupMutationMock();

    const reactQuery = await import("@tanstack/react-query");
    reactQuery.useMutation = mockUseMutation;

    const { useBaixarAnexo } = await import("./useBaixarAnexo");
    const mutation = useBaixarAnexo();

    await mutation.mutateAsync(mockParams);

    expect(mockLink.href).toBe("mock-url");
    expect(mockLink.download).toBe(mockParams.nomeArquivo);
    expect(mockLink.click).toHaveBeenCalled();
    expect(mockLink.remove).toHaveBeenCalled();
  });

 it("deve lidar com erro ao baixar o anexo", async () => {
    const errorMessage = "Erro ao baixar anexo";
    vi.spyOn(baixarAnexoAction, "baixarAnexo").mockRejectedValue(new Error(errorMessage));

    const { mockUseMutation } = setupMutationMock();

    const reactQuery = await import("@tanstack/react-query");
    reactQuery.useMutation = mockUseMutation;

    const { useBaixarAnexo } = await import("./useBaixarAnexo");
    const mutation = useBaixarAnexo();

    await expect(mutation.mutateAsync(mockParams)).rejects.toThrow(errorMessage);
    expect(baixarAnexoAction.baixarAnexo).toHaveBeenCalledWith(mockParams.uuid);
    });

  it("deve criar o Blob corretamente com ArrayBuffer", async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    vi.spyOn(baixarAnexoAction, "baixarAnexo").mockResolvedValue(mockArrayBuffer);

    const { mockUseMutation } = setupMutationMock();


    const reactQuery = await import("@tanstack/react-query");
    reactQuery.useMutation = mockUseMutation;

    const { useBaixarAnexo } = await import("./useBaixarAnexo");
    const mutation = useBaixarAnexo();

    await mutation.mutateAsync(mockParams);

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(
      new Blob([mockArrayBuffer])
    );
  });

  it("deve retornar o hook com as propriedades corretas", async () => {
    const mockMutationResult = {
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isLoading: false,
      isSuccess: false,
      isError: false,
      data: undefined,
      error: null,
    };

    const mockUseMutation = vi.fn().mockReturnValue(mockMutationResult);

    const reactQuery = await import("@tanstack/react-query");
    reactQuery.useMutation = mockUseMutation;

    const { useBaixarAnexo } = await import("./useBaixarAnexo");
    const result = useBaixarAnexo();

    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
    });
    expect(result).toEqual(mockMutationResult);
  });
});