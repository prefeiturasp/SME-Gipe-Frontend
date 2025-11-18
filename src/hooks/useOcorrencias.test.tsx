import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import { useOcorrencias } from "./useOcorrencias";
import { getOcorrenciasAction } from "@/actions/ocorrencias";
import { useUserStore, type User } from "@/stores/useUserStore";

vi.mock("@/actions/ocorrencias");
vi.mock("@/stores/useUserStore");

const getOcorrenciasActionMock = getOcorrenciasAction as Mock;
const useUserStoreMock = useUserStore as unknown as Mock;

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    Wrapper.displayName = "QueryClientProvider";
    return Wrapper;
};

describe("useOcorrencias", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("não deve chamar a action se o usuário não estiver definido", () => {
        useUserStoreMock.mockReturnValue(null);

        renderHook(() => useOcorrencias(), { wrapper: createWrapper() });

        expect(getOcorrenciasActionMock).not.toHaveBeenCalled();
    });

    it("deve chamar a action e retornar os dados transformados", async () => {
        const mockUser = { username: "testuser" } as User;
        const mockApiResponse = {
            success: true,
            data: [
                {
                    id: 1,
                    uuid: "uuid-1",
                    data_ocorrencia: "2025-10-08T12:00:00",
                    unidade_codigo_eol: "unit-1",
                    nome_dre: "dre-1",
                    nome_unidade: "Nome teste",
                    tipos_ocorrencia: [{ uuid: "1", nome: "Agressão física" }],
                    status_extra: "Finalizada",
                },
            ],
        };

        useUserStoreMock.mockImplementation(
            <T,>(selector: (state: { user: User | null }) => T) =>
                selector({ user: mockUser })
        );

        getOcorrenciasActionMock.mockResolvedValueOnce(mockApiResponse);

        const { result } = renderHook(() => useOcorrencias(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true), {
            timeout: 2000,
        });

        expect(getOcorrenciasActionMock).toHaveBeenCalledTimes(1);
        expect(result.current.data).toHaveLength(1);
        expect(result.current.data?.[0]).toMatchObject({
            id: 1,
            uuid: "uuid-1",
            codigoEol: "unit-1",
            dre: "dre-1",
            nomeUe: "Nome teste",
            tipoOcorrencia: "Agressão física",
            status: "Finalizada",
        });
    });

    it("deve lançar um erro se a action falhar", async () => {
        const mockUser = { username: "testuser" } as User;
        const mockApiResponse = {
            success: false,
            error: "Falha na API",
        };

        useUserStoreMock.mockReturnValue(mockUser);
        getOcorrenciasActionMock.mockResolvedValue(mockApiResponse);

        const { result } = renderHook(() => useOcorrencias(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toEqual(new Error("Falha na API"));
    });
});
