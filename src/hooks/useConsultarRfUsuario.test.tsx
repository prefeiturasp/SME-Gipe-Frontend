import * as consultarRfUsuarioModule from "@/actions/consultar-rf-usuario";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useConsultarRfUsuario } from "./useConsultarRfUsuario";

vi.mock("@/actions/consultar-rf-usuario");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    Wrapper.displayName = "QueryClientWrapper";
    return Wrapper;
};

describe("useConsultarRfUsuario", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve consultar RF com sucesso", async () => {
        const rf = "1234567";
        const mockResult = {
            success: true as const,
            data: {
                cpf: "12345678900",
                nome: "João Silva",
                codigoRf: "1234567",
                email: "joao.silva@exemplo.com",
                dreCodigo: "DRE-001",
                emailValido: true,
            },
        };

        vi.spyOn(
            consultarRfUsuarioModule,
            "consultarRfUsuarioAction",
        ).mockResolvedValue(mockResult);

        const { result } = renderHook(() => useConsultarRfUsuario(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(rf);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
        expect(
            consultarRfUsuarioModule.consultarRfUsuarioAction,
        ).toHaveBeenCalledWith(rf);
    });

    it("deve retornar erro quando RF não for encontrado", async () => {
        const rf = "9999999";
        const mockError = {
            success: false as const,
            error: "RF não encontrado",
        };

        vi.spyOn(
            consultarRfUsuarioModule,
            "consultarRfUsuarioAction",
        ).mockResolvedValue(mockError);

        const { result } = renderHook(() => useConsultarRfUsuario(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(rf);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockError);
    });

    it("deve indicar loading durante a consulta", async () => {
        const rf = "1234567";
        const mockResult = {
            success: true as const,
            data: {
                cpf: "12345678900",
                nome: "João Silva",
                codigoRf: "1234567",
                email: "joao.silva@exemplo.com",
                dreCodigo: null,
                emailValido: true,
            },
        };

        vi.spyOn(
            consultarRfUsuarioModule,
            "consultarRfUsuarioAction",
        ).mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(mockResult), 100);
            });
        });

        const { result } = renderHook(() => useConsultarRfUsuario(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isPending).toBe(false);

        result.current.mutate(rf);

        await waitFor(() => expect(result.current.isPending).toBe(true));

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.isPending).toBe(false);
    });

    it("deve lidar com erro de autenticação", async () => {
        const rf = "1234567";
        const mockError = {
            success: false as const,
            error: "Token de autenticação não encontrado",
        };

        vi.spyOn(
            consultarRfUsuarioModule,
            "consultarRfUsuarioAction",
        ).mockResolvedValue(mockError);

        const { result } = renderHook(() => useConsultarRfUsuario(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(rf);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockError);
    });

    it("deve permitir múltiplas consultas sequenciais", async () => {
        const rf1 = "1111111";
        const rf2 = "2222222";

        const mockResult1 = {
            success: true as const,
            data: {
                cpf: "11111111111",
                nome: "Primeiro Usuário",
                codigoRf: rf1,
                email: "primeiro@exemplo.com",
                dreCodigo: "DRE-001",
                emailValido: true,
            },
        };

        const mockResult2 = {
            success: true as const,
            data: {
                cpf: "22222222222",
                nome: "Segundo Usuário",
                codigoRf: rf2,
                email: "segundo@exemplo.com",
                dreCodigo: "DRE-002",
                emailValido: true,
            },
        };

        const consultarSpy = vi
            .spyOn(consultarRfUsuarioModule, "consultarRfUsuarioAction")
            .mockResolvedValueOnce(mockResult1)
            .mockResolvedValueOnce(mockResult2);

        const { result } = renderHook(() => useConsultarRfUsuario(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(rf1);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(mockResult1);

        result.current.mutate(rf2);
        await waitFor(() => {
            return result.current.data === mockResult2;
        });
        expect(result.current.data).toEqual(mockResult2);

        expect(consultarSpy).toHaveBeenCalledTimes(2);
        expect(consultarSpy).toHaveBeenNthCalledWith(1, rf1);
        expect(consultarSpy).toHaveBeenNthCalledWith(2, rf2);
    });
});
