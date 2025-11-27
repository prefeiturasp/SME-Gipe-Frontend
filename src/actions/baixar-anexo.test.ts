import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { cookies } from "next/headers";
import apiAnexos from "@/lib/axios-anexos";
import { baixarAnexo } from "./baixar-anexo";
import { AxiosError } from "axios";
import { AxiosHeaders } from "axios";

const headers = new AxiosHeaders();

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/lib/axios-anexos");

const cookiesMock = cookies as unknown as Mock;

describe("baixarAnexo action", () => {
  const uuid = "file-123-uuid";

  beforeEach(() => {
    vi.clearAllMocks();
    cookiesMock.mockReturnValue({
      get: vi.fn().mockReturnValue({ value: "token-123" }),
    });
  });

  it("deve retornar URL e nome do arquivo corretamente", async () => {
    vi.spyOn(apiAnexos, "get").mockResolvedValue({
      data: { url_download: "https://teste/download", nome_arquivo: "arquivo.pdf" },
    });

    const result = await baixarAnexo(uuid);

    expect(result).toEqual({
      success: true,
      url: "https://teste/download",
      nomeArquivo: "arquivo.pdf",
    });

    expect(apiAnexos.get).toHaveBeenCalledWith(`/anexos/${uuid}/url-download/`, {
      headers: { Authorization: "Bearer token-123" },
    });
  });

  it("deve retornar erro se não houver token", async () => {
    cookiesMock.mockReturnValue({
      get: vi.fn().mockReturnValue(undefined),
    });

    const result = await baixarAnexo(uuid);

    expect(result).toEqual({
      success: false,
      error: "Usuário não autenticado. Token não encontrado.",
    });
    expect(apiAnexos.get).not.toHaveBeenCalled();
  });

  it("deve retornar erro 401 corretamente", async () => {
    const error = new AxiosError("unauthorized");
    // simular response com status 401
    (error as unknown as { response?: { status?: number } }).response = { status: 401 };

    vi.spyOn(apiAnexos, "get").mockRejectedValue(error);

    const result = await baixarAnexo(uuid);

    expect(result).toEqual({
      success: false,
      error: "Não autorizado. Faça login novamente.",
    });
  });

  it("deve retornar erro 404 corretamente", async () => {
    const error = new AxiosError("not found");
    (error as unknown as { response?: { status?: number } }).response = { status: 404 };

    vi.spyOn(apiAnexos, "get").mockRejectedValue(error);

    const result = await baixarAnexo(uuid);

    expect(result).toEqual({
      success: false,
      error: "Arquivo não encontrado",
    });
  });

  it("deve retornar erro 500 corretamente", async () => {
    const error = new AxiosError("server error");
    (error as unknown as { response?: { status?: number } }).response = { status: 500 };

    vi.spyOn(apiAnexos, "get").mockRejectedValue(error);

    const result = await baixarAnexo(uuid);

    expect(result).toEqual({
      success: false,
      error: "Erro interno no servidor",
    });
  });

  it("deve retornar mensagem adequada quando error.message existir", async () => {
    const error = new AxiosError("Erro inesperado");
    vi.spyOn(apiAnexos, "get").mockRejectedValue(error);

    const result = await baixarAnexo(uuid);

    expect(result).toEqual({
      success: false,
      error: "Erro inesperado",
    });
  });

  it("deve retornar erro 500 corretamente (linha 48-49)", async () => {
    const error = new AxiosError("erro servidor");

    const mockResponse: AxiosError["response"] = {
      status: 500,
      data: {},
      statusText: "Internal Server Error",
      headers: {},
      config: {
        headers: headers,
        url: "",
        method: "get"
      }
    };

    error.response = mockResponse;

    vi.spyOn(apiAnexos, "get").mockRejectedValueOnce(error);

    const result = await baixarAnexo(uuid);

    expect(result).toEqual({
      success: false,
      error: "Erro interno no servidor",
    });
  });
});
