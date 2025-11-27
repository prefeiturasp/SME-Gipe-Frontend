import { describe, it, expect, vi, beforeEach } from "vitest";
import * as baixarAnexoAction from "@/actions/baixar-anexo";

vi.mock("@/actions/baixar-anexo");
vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
}));

type MutationParams = { uuid: string; nomeArquivo: string };
type BaixarReturnSuccess = { success: true; url: string; nomeArquivo: string };
type BaixarReturnFail = { success: false; error: string };

describe("useBaixarAnexo", () => {
  const mockParams: MutationParams = {
    uuid: "test-uuid-123",
    nomeArquivo: "documento.pdf",
  };

  const setupMockMutation = () => {
    const mockUseMutation = vi.fn().mockImplementation((options) => ({
      mutate: vi.fn(),
      mutateAsync: options.mutationFn,
      isLoading: false,
      isSuccess: false,
      isError: false,
    }));

    return mockUseMutation;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    global.URL.createObjectURL = vi.fn(() => "blob-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  it("realiza download com sucesso", async () => {
    const retorno: BaixarReturnSuccess = {
      success: true,
      url: "https://teste.com/file",
      nomeArquivo: "arquivo.pdf",
    };

    vi.spyOn(baixarAnexoAction, "baixarAnexo").mockResolvedValue(retorno);

    global.fetch = vi.fn().mockResolvedValue({
      blob: async () => new Blob(["conteúdo"]),
    } as unknown as Response);

    const useMutation = setupMockMutation();
    (await import("@tanstack/react-query")).useMutation = useMutation;

    const { useBaixarAnexo } = await import("./useBaixarAnexo");
    const mutation = useBaixarAnexo();

    const result = await mutation.mutateAsync(mockParams);

    expect(baixarAnexoAction.baixarAnexo).toHaveBeenCalledWith(mockParams.uuid);
    expect(fetch).toHaveBeenCalledWith("https://teste.com/file");
    expect(result).toBe(true);
  });

  it("lança erro quando baixarAnexo retorna failure", async () => {
    const retorno: BaixarReturnFail = { success: false, error: "Falhou" };

    vi.spyOn(baixarAnexoAction, "baixarAnexo").mockResolvedValue(retorno);

    const useMutation = setupMockMutation();
    (await import("@tanstack/react-query")).useMutation = useMutation;

    const { useBaixarAnexo } = await import("./useBaixarAnexo");
    const mutation = useBaixarAnexo();

    await expect(mutation.mutateAsync(mockParams)).rejects.toThrow("Falhou");
  });

  it("cria Blob a partir de ArrayBuffer quando necessário", async () => {
    const retorno: BaixarReturnSuccess = {
      success: true,
      url: "https://teste.com/file",
      nomeArquivo: "arquivo.pdf",
    };

    const mockArrayBuffer = new ArrayBuffer(8);
    vi.spyOn(baixarAnexoAction, "baixarAnexo").mockResolvedValue(retorno);

    global.fetch = vi.fn().mockResolvedValue({
      blob: async () => new Blob([mockArrayBuffer]),
    } as unknown as Response);

    const useMutation = setupMockMutation();
    (await import("@tanstack/react-query")).useMutation = useMutation;

    const { useBaixarAnexo } = await import("./useBaixarAnexo");
    const mutation = useBaixarAnexo();

    await mutation.mutateAsync(mockParams);

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
  });

  it("retorna o objeto da mutation quando useMutation é chamado", async () => {
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

    (await import("@tanstack/react-query")).useMutation = mockUseMutation;

    const { useBaixarAnexo } = await import("./useBaixarAnexo");
    const result = useBaixarAnexo();

    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
    });
    expect(result).toEqual(mockMutationResult);
  });
});
