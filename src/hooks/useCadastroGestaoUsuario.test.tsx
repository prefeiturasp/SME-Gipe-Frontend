import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCadastroGestaoUsuario } from "./useCadastroGestaoUsuario";
import * as cadastroGestaoUsuarioModule from "@/actions/cadastro-gestao-usuario";
import type { CadastroGestaoUsuarioRequest } from "@/actions/cadastro-gestao-usuario";

vi.mock("@/actions/cadastro-gestao-usuario");

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

describe("useCadastroGestaoUsuario", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve cadastrar usuário com sucesso", async () => {
        const mockRequest: CadastroGestaoUsuarioRequest = {
            username: "123456",
            name: "João Silva",
            email: "joao@exemplo.com",
            cpf: "12345678901",
            cargo: 1,
            rede: "DIRETA",
            unidades: ["dre-1", "ue-1"],
            is_app_admin: false,
        };

        const mockResult = {
            success: true,
        };

        vi.spyOn(
            cadastroGestaoUsuarioModule,
            "cadastroGestaoUsuarioAction"
        ).mockResolvedValue(mockResult);

        const { result } = renderHook(() => useCadastroGestaoUsuario(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
        expect(
            cadastroGestaoUsuarioModule.cadastroGestaoUsuarioAction
        ).toHaveBeenCalledWith(mockRequest);
    });

    it("deve cadastrar usuário GIPE sem CPF", async () => {
        const mockRequest: CadastroGestaoUsuarioRequest = {
            username: "joao.silva",
            name: "João Silva GIPE",
            email: "joao.gipe@exemplo.com",
            cargo: 2,
            rede: "DIRETA",
            unidades: ["dre-1"],
            is_app_admin: false,
        };

        const mockResult = {
            success: true,
        };

        vi.spyOn(
            cadastroGestaoUsuarioModule,
            "cadastroGestaoUsuarioAction"
        ).mockResolvedValue(mockResult);

        const { result } = renderHook(() => useCadastroGestaoUsuario(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
        expect(mockRequest.cpf).toBeUndefined();
    });

    it("deve lidar com erro de email duplicado", async () => {
        const mockRequest: CadastroGestaoUsuarioRequest = {
            username: "123456",
            name: "João Silva",
            email: "duplicado@exemplo.com",
            cpf: "12345678901",
            cargo: 1,
            rede: "DIRETA",
            unidades: ["dre-1"],
            is_app_admin: false,
        };

        const mockResult = {
            success: false,
            error: "Email já cadastrado",
            field: "email",
        };

        vi.spyOn(
            cadastroGestaoUsuarioModule,
            "cadastroGestaoUsuarioAction"
        ).mockResolvedValue(mockResult);

        const { result } = renderHook(() => useCadastroGestaoUsuario(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
        expect(result.current.data?.success).toBe(false);
        expect(result.current.data?.field).toBe("email");
    });

    it("deve lidar com erro genérico do servidor", async () => {
        const mockRequest: CadastroGestaoUsuarioRequest = {
            username: "123456",
            name: "João Silva",
            email: "joao@exemplo.com",
            cargo: 1,
            rede: "DIRETA",
            unidades: ["dre-1"],
            is_app_admin: false,
        };

        const mockResult = {
            success: false,
            error: "Erro interno no servidor",
        };

        vi.spyOn(
            cadastroGestaoUsuarioModule,
            "cadastroGestaoUsuarioAction"
        ).mockResolvedValue(mockResult);

        const { result } = renderHook(() => useCadastroGestaoUsuario(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
        expect(result.current.data?.success).toBe(false);
    });

    it("deve cadastrar usuário administrador", async () => {
        const mockRequest: CadastroGestaoUsuarioRequest = {
            username: "admin.user",
            name: "Admin User",
            email: "admin@exemplo.com",
            cargo: 2,
            rede: "DIRETA",
            unidades: [],
            is_app_admin: true,
        };

        const mockResult = {
            success: true,
        };

        vi.spyOn(
            cadastroGestaoUsuarioModule,
            "cadastroGestaoUsuarioAction"
        ).mockResolvedValue(mockResult);

        const { result } = renderHook(() => useCadastroGestaoUsuario(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
        expect(mockRequest.is_app_admin).toBe(true);
    });

    it("deve cadastrar usuário de rede INDIRETA", async () => {
        const mockRequest: CadastroGestaoUsuarioRequest = {
            username: "maria.santos",
            name: "Maria Santos",
            email: "maria@exemplo.com",
            cpf: "98765432100",
            cargo: 3,
            rede: "INDIRETA",
            unidades: ["dre-2", "ue-5"],
            is_app_admin: false,
        };

        const mockResult = {
            success: true,
        };

        vi.spyOn(
            cadastroGestaoUsuarioModule,
            "cadastroGestaoUsuarioAction"
        ).mockResolvedValue(mockResult);

        const { result } = renderHook(() => useCadastroGestaoUsuario(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockRequest);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResult);
        expect(mockRequest.rede).toBe("INDIRETA");
    });

    it("deve retornar mutation em estado idle inicialmente", () => {
        const { result } = renderHook(() => useCadastroGestaoUsuario(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isPending).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.data).toBeUndefined();
    });
});
