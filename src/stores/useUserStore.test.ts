import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/cookieUtils", () => ({
    setEncryptedCookie: vi.fn(),
    getDecryptedCookie: vi.fn(),
    removeCookie: vi.fn(),
}));

vi.mock("@/actions/logout", () => ({
    logoutAction: vi.fn(),
}));

import {
    setEncryptedCookie,
    getDecryptedCookie,
    removeCookie,
} from "@/lib/cookieUtils";

import { logoutAction } from "@/actions/logout";

const user = {
    identificador: "12345678900",
    nome: "Fulano",
    email: "fulano@email.com",
    cargo: "admin",
    perfil_acesso: "ADMIN",
    unidade: [{ nomeUnidade: "Unidade Teste", codigo: "fake-uuid" }] as [
        { nomeUnidade: string; codigo: string }
    ],
    cpf: "12345678900",
};

describe("useUserStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("estado inicial lê do cookie", async () => {
        (
            getDecryptedCookie as unknown as {
                mockReturnValue: (v: unknown) => void;
            }
        ).mockReturnValue(user);
        const { useUserStore: newStore } = await import("./useUserStore");
        expect(newStore.getState().user).toEqual(user);
        newStore.setState({ user: null });
    });

    it("setUser salva no cookie e atualiza o estado", async () => {
        const { useUserStore } = await import("./useUserStore");
        useUserStore.getState().setUser(user);
        expect(setEncryptedCookie).toHaveBeenCalledWith("user_data", user, 1);
        expect(useUserStore.getState().user).toEqual(user);
        useUserStore.setState({ user: null });
    });

    it("clearUser remove cookie e chama a action de logout", async () => {
        const { useUserStore } = await import("./useUserStore");
        useUserStore.setState({ user });
        useUserStore.getState().clearUser();
        expect(logoutAction).toHaveBeenCalled();
        expect(removeCookie).toHaveBeenCalledWith("user_data");
        expect(useUserStore.getState().user).toBeNull();
    });
});
