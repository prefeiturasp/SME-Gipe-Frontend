import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { useUserPermissions } from "./useUserPermissions";
import {
    PERFIL_GIPE,
    PERFIL_PONTO_FOCAL,
    PERFIL_ASSISTENTE_DIRETOR,
    PERFIL_DIRETOR,
} from "@/const";

interface MockUser {
    identificador: string;
    nome: string;
    perfil_acesso: { nome: string; codigo: number };
}

let mockUser: MockUser | null = null;

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: (
        selector: (state: {
            user: MockUser | null;
            setUser: Mock;
            clearUser: Mock;
        }) => unknown
    ) =>
        selector({
            user: mockUser,
            setUser: vi.fn() as Mock,
            clearUser: vi.fn() as Mock,
        }),
}));

const createMockUser = (codigo: number): MockUser => ({
    identificador: "12345",
    nome: "Test User",
    perfil_acesso: { nome: "Test Profile", codigo },
});

describe("useUserPermissions", () => {
    beforeEach(() => {
        mockUser = createMockUser(PERFIL_GIPE);
    });

    it("deve retornar isGipe como true para o perfil GIPE", () => {
        mockUser = createMockUser(PERFIL_GIPE);
        const { result } = renderHook(() => useUserPermissions());

        expect(result.current.isGipe).toBe(true);
        expect(result.current.isPontoFocal).toBe(false);
        expect(result.current.isAssistenteOuDiretor).toBe(false);
    });

    it("deve retornar isPontoFocal como true para o perfil Ponto Focal", () => {
        mockUser = createMockUser(PERFIL_PONTO_FOCAL);
        const { result } = renderHook(() => useUserPermissions());

        expect(result.current.isGipe).toBe(false);
        expect(result.current.isPontoFocal).toBe(true);
        expect(result.current.isAssistenteOuDiretor).toBe(false);
    });

    it("deve retornar isAssistenteOuDiretor como true para o perfil Assistente", () => {
        mockUser = createMockUser(PERFIL_ASSISTENTE_DIRETOR);
        const { result } = renderHook(() => useUserPermissions());

        expect(result.current.isGipe).toBe(false);
        expect(result.current.isPontoFocal).toBe(false);
        expect(result.current.isAssistenteOuDiretor).toBe(true);
    });

    it("deve retornar isAssistenteOuDiretor como true para o perfil Diretor", () => {
        mockUser = createMockUser(PERFIL_DIRETOR);
        const { result } = renderHook(() => useUserPermissions());

        expect(result.current.isGipe).toBe(false);
        expect(result.current.isPontoFocal).toBe(false);
        expect(result.current.isAssistenteOuDiretor).toBe(true);
    });

    it("deve retornar todas as permissões como false se o usuário não estiver logado", () => {
        mockUser = null;
        const { result } = renderHook(() => useUserPermissions());

        expect(result.current.isGipe).toBe(false);
        expect(result.current.isPontoFocal).toBe(false);
        expect(result.current.isAssistenteOuDiretor).toBe(false);
    });

    it("deve retornar todas as permissões como false para um perfil desconhecido", () => {
        mockUser = createMockUser(9999);
        const { result } = renderHook(() => useUserPermissions());

        expect(result.current.isGipe).toBe(false);
        expect(result.current.isPontoFocal).toBe(false);
        expect(result.current.isAssistenteOuDiretor).toBe(false);
    });
});
