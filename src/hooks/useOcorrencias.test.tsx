import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import { useOcorrencias } from "./useOcorrencias";
import { getOcorrenciasAction } from "@/actions/ocorrencias";
import { useUserStore, type User } from "@/stores/useUserStore";
import { useUserPermissions } from "./useUserPermissions";

vi.mock("@/actions/ocorrencias");
vi.mock("@/stores/useUserStore");
vi.mock("./useUserPermissions");

const getOcorrenciasActionMock = getOcorrenciasAction as Mock;
const useUserStoreMock = useUserStore as unknown as Mock;
const useUserPermissionsMock = useUserPermissions as Mock;

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
        useUserPermissionsMock.mockReturnValue({});

        renderHook(() => useOcorrencias(), { wrapper: createWrapper() });

        expect(getOcorrenciasActionMock).not.toHaveBeenCalled();
    });

    it("deve chamar a action e retornar os dados transformados", async () => {
        const mockUser = { username: "testuser" } as User;
        const mockPermissions = {
            isGipe: true,
            isPontoFocal: false,
            isAssistenteOuDiretor: false,
        };
        const mockApiResponse = {
            success: true,
            data: [
                {
                    id: 1,
                    uuid: "uuid-1",
                    data_ocorrencia: "2025-10-08T12:00:00Z",
                    unidade_codigo_eol: "unit-1",
                    dre_codigo_eol: "dre-1",
                },
            ],
        };

        useUserStoreMock.mockReturnValue(mockUser);
        useUserPermissionsMock.mockReturnValue(mockPermissions);
        getOcorrenciasActionMock.mockResolvedValue(mockApiResponse);

        const { result } = renderHook(() => useOcorrencias(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(getOcorrenciasActionMock).toHaveBeenCalledWith({});
        expect(result.current.data).toEqual([
            expect.objectContaining({
                id: 1,
                uuid: "uuid-1",
                codigoEol: "unit-1",
                dre: "dre-1",
                dataHora: "08/10/2025 - 12:00",
            }),
        ]);
    });

    it("deve lançar um erro se a action falhar", async () => {
        const mockUser = { username: "testuser" } as User;
        const mockPermissions = { isGipe: true };
        const mockApiResponse = {
            success: false,
            error: "Falha na API",
        };

        useUserStoreMock.mockReturnValue(mockUser);
        useUserPermissionsMock.mockReturnValue(mockPermissions);
        getOcorrenciasActionMock.mockResolvedValue(mockApiResponse);

        const { result } = renderHook(() => useOcorrencias(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toEqual(new Error("Falha na API"));
    });
});
