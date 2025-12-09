import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import { useOcorrencias } from "./useOcorrencias";
import { getOcorrenciasAction } from "@/actions/ocorrencias";
import { useUserStore, type User } from "@/stores/useUserStore";
import { useUserPermissions } from "@/hooks/useUserPermissions";

vi.mock("@/actions/ocorrencias");
vi.mock("@/stores/useUserStore");
vi.mock("@/hooks/useUserPermissions");

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
        useUserPermissionsMock.mockReturnValue({
            isPontoFocal: false,
            isGipe: false,
            isAssistenteOuDiretor: true,
        });
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

    it("deve filtrar ocorrências para Ponto Focal - excluindo status em_preenchimento_diretor", async () => {
        const mockUser = { username: "pontofocal" } as User;
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
                    tipos_ocorrencia: [{ uuid: "1", nome: "Tipo 1" }],
                    status_extra: "Em andamento",
                    status: "em_preenchimento_diretor",
                },
                {
                    id: 2,
                    uuid: "uuid-2",
                    data_ocorrencia: "2025-10-08T14:00:00",
                    unidade_codigo_eol: "unit-2",
                    nome_dre: "dre-2",
                    nome_unidade: "Nome teste 2",
                    tipos_ocorrencia: [{ uuid: "2", nome: "Tipo 2" }],
                    status_extra: "Enviado para DRE",
                    status: "enviado_para_dre",
                },
                {
                    id: 3,
                    uuid: "uuid-3",
                    data_ocorrencia: "2025-10-08T16:00:00",
                    unidade_codigo_eol: "unit-3",
                    nome_dre: "dre-3",
                    nome_unidade: "Nome teste 3",
                    tipos_ocorrencia: [{ uuid: "3", nome: "Tipo 3" }],
                    status_extra: "Finalizada",
                    status: "finalizada",
                },
            ],
        };

        useUserStoreMock.mockImplementation(
            <T,>(selector: (state: { user: User | null }) => T) =>
                selector({ user: mockUser })
        );
        useUserPermissionsMock.mockReturnValue({
            isPontoFocal: true,
            isGipe: false,
            isAssistenteOuDiretor: false,
        });
        getOcorrenciasActionMock.mockResolvedValueOnce(mockApiResponse);

        const { result } = renderHook(() => useOcorrencias(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toHaveLength(2);
        expect(result.current.data?.[0].statusId).toBe("enviado_para_dre");
        expect(result.current.data?.[1].statusId).toBe("finalizada");
        expect(
            result.current.data?.find(
                (o) => o.statusId === "em_preenchimento_diretor"
            )
        ).toBeUndefined();
    });

    it("deve filtrar ocorrências para GIPE - apenas enviado_para_gipe e finalizada", async () => {
        const mockUser = { username: "gipeuser" } as User;
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
                    tipos_ocorrencia: [{ uuid: "1", nome: "Tipo 1" }],
                    status_extra: "Em preenchimento",
                    status: "em_preenchimento_diretor",
                },
                {
                    id: 2,
                    uuid: "uuid-2",
                    data_ocorrencia: "2025-10-08T14:00:00",
                    unidade_codigo_eol: "unit-2",
                    nome_dre: "dre-2",
                    nome_unidade: "Nome teste 2",
                    tipos_ocorrencia: [{ uuid: "2", nome: "Tipo 2" }],
                    status_extra: "Enviado para DRE",
                    status: "enviado_para_dre",
                },
                {
                    id: 3,
                    uuid: "uuid-3",
                    data_ocorrencia: "2025-10-08T16:00:00",
                    unidade_codigo_eol: "unit-3",
                    nome_dre: "dre-3",
                    nome_unidade: "Nome teste 3",
                    tipos_ocorrencia: [{ uuid: "3", nome: "Tipo 3" }],
                    status_extra: "Enviado para GIPE",
                    status: "enviado_para_gipe",
                },
                {
                    id: 4,
                    uuid: "uuid-4",
                    data_ocorrencia: "2025-10-08T18:00:00",
                    unidade_codigo_eol: "unit-4",
                    nome_dre: "dre-4",
                    nome_unidade: "Nome teste 4",
                    tipos_ocorrencia: [{ uuid: "4", nome: "Tipo 4" }],
                    status_extra: "Finalizada",
                    status: "finalizada",
                },
            ],
        };

        useUserStoreMock.mockImplementation(
            <T,>(selector: (state: { user: User | null }) => T) =>
                selector({ user: mockUser })
        );
        useUserPermissionsMock.mockReturnValue({
            isPontoFocal: false,
            isGipe: true,
            isAssistenteOuDiretor: false,
        });
        getOcorrenciasActionMock.mockResolvedValueOnce(mockApiResponse);

        const { result } = renderHook(() => useOcorrencias(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toHaveLength(2);
        expect(result.current.data?.[0].statusId).toBe("enviado_para_gipe");
        expect(result.current.data?.[1].statusId).toBe("finalizada");
    });

    it("deve retornar todas as ocorrências para Assistente ou Diretor", async () => {
        const mockUser = { username: "diretor" } as User;
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
                    tipos_ocorrencia: [{ uuid: "1", nome: "Tipo 1" }],
                    status_extra: "Em preenchimento",
                    status: "em_preenchimento_diretor",
                },
                {
                    id: 2,
                    uuid: "uuid-2",
                    data_ocorrencia: "2025-10-08T14:00:00",
                    unidade_codigo_eol: "unit-2",
                    nome_dre: "dre-2",
                    nome_unidade: "Nome teste 2",
                    tipos_ocorrencia: [{ uuid: "2", nome: "Tipo 2" }],
                    status_extra: "Enviado para DRE",
                    status: "enviado_para_dre",
                },
                {
                    id: 3,
                    uuid: "uuid-3",
                    data_ocorrencia: "2025-10-08T16:00:00",
                    unidade_codigo_eol: "unit-3",
                    nome_dre: "dre-3",
                    nome_unidade: "Nome teste 3",
                    tipos_ocorrencia: [{ uuid: "3", nome: "Tipo 3" }],
                    status_extra: "Finalizada",
                    status: "finalizada",
                },
            ],
        };

        useUserStoreMock.mockImplementation(
            <T,>(selector: (state: { user: User | null }) => T) =>
                selector({ user: mockUser })
        );
        useUserPermissionsMock.mockReturnValue({
            isPontoFocal: false,
            isGipe: false,
            isAssistenteOuDiretor: true,
        });
        getOcorrenciasActionMock.mockResolvedValueOnce(mockApiResponse);

        const { result } = renderHook(() => useOcorrencias(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toHaveLength(3);
        expect(result.current.data?.map((o) => o.id)).toEqual([1, 2, 3]);
    });
});
