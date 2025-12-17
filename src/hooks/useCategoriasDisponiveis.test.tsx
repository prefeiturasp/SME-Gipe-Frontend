import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useCategoriasDisponiveis } from "./useCategoriasDisponiveis";
import * as categoriasActions from "@/actions/categorias-disponiveis";

vi.mock("@/actions/categorias-disponiveis");

describe("useCategoriasDisponiveis", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("deve retornar os dados corretamente quando a API retorna sucesso", async () => {
    const mockResponse: { success: true; data: categoriasActions.CategoriasDisponiveisAPI } = {
      success: true,
      data: {
        motivo_ocorrencia: [{ label: "Bullying", value: "bullying" }],
        genero: [{ label: "Masculino", value: "masculino" }],
        grupo_etnico_racial: [{ label: "Pardo", value: "pardo" }],
        etapa_escolar: [{ label: "Ensino Fundamental II", value: "ensino_fundamental_2" }],
        frequencia_escolar: [{ label: "Regular", value: "regular" }],
      },
    };

    vi.mocked(categoriasActions.getCategoriasDisponiveisAction).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCategoriasDisponiveis(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse.data);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);
    });
  });

  it("deve lançar erro quando a API retorna falha", async () => {
    const mockErrorResponse: { success: false; error: string } = {
      success: false,
      error: "Erro na API",
    };

    vi.mocked(categoriasActions.getCategoriasDisponiveisAction).mockResolvedValue(mockErrorResponse);

    const { result } = renderHook(() => useCategoriasDisponiveis(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe("Erro na API");
    });
  });
});
