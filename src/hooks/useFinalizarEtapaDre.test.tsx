import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useFinalizarEtapaDre } from "./useFinalizarEtapaDre";
import * as finalizarEtapaModule from "@/actions/finalizar-etapa-dre";

vi.mock("@/actions/finalizar-etapa-dre", () => ({
  finalizarEtapaDre: vi.fn(),
}));

describe("useFinalizarEtapaDre", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockParams = {
    ocorrenciaUuid: "uuid-123",
    body: {
      unidade_codigo_eol: "123456",
      dre_codigo_eol: "DRE-01",
      motivo_encerramento_ue: "Encerrado pela direção",
    },
  };

  it("deve chamar finalizarEtapaDre com os parâmetros corretos", async () => {
    const mockResponse = {
      success: true,
      data: {
        protocolo_da_intercorrencia: "Protocolo X",
      },
    };

    vi.mocked(finalizarEtapaModule.finalizarEtapaDre).mockResolvedValue(
      mockResponse as never
    );

    const { result } = renderHook(() => useFinalizarEtapaDre(), { wrapper });

    result.current.mutate(mockParams);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(finalizarEtapaModule.finalizarEtapaDre).toHaveBeenCalledWith(
      mockParams.ocorrenciaUuid,
      mockParams.body
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it("deve retornar erro quando a mutation falhar", async () => {
    const mockError = new Error("Erro ao finalizar etapa DRE");

    vi.mocked(finalizarEtapaModule.finalizarEtapaDre).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFinalizarEtapaDre(), { wrapper });

    result.current.mutate(mockParams);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });

  it("deve ter isPending como true durante execução", async () => {
    const delayedPromise = new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, data: {} }), 150)
    );

    vi.mocked(finalizarEtapaModule.finalizarEtapaDre).mockReturnValue(
      delayedPromise as never
    );

    const { result } = renderHook(() => useFinalizarEtapaDre(), { wrapper });

    result.current.mutate(mockParams);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("deve retornar response de erro quando success = false", async () => {
    const mockErrorResponse = {
      success: false,
      error: "Erro ao finalizar etapa DRE",
    };

    vi.mocked(finalizarEtapaModule.finalizarEtapaDre).mockResolvedValue(
      mockErrorResponse as never
    );

    const { result } = renderHook(() => useFinalizarEtapaDre(), { wrapper });

    result.current.mutate(mockParams);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockErrorResponse);
  });
});