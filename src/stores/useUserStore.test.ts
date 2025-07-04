import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/cookieUtils", () => ({
    setEncryptedCookie: vi.fn(),
    getDecryptedCookie: vi.fn(),
    removeCookie: vi.fn(),
}));

import {
    setEncryptedCookie,
    getDecryptedCookie,
    removeCookie,
} from "@/lib/cookieUtils";

const user = { name: "Fulano", email: "fulano@email.com", role: "admin" };

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
        // Import dinâmico para garantir que o mock é usado na inicialização
        const { useUserStore: newStore } = await import("./useUserStore");
        expect(newStore.getState().user).toEqual(user);
        // Limpa o estado para não afetar outros testes
        newStore.setState({ user: null });
    });

    it("setUser salva no cookie e atualiza o estado", async () => {
        const { useUserStore } = await import("./useUserStore");
        useUserStore.getState().setUser(user);
        expect(setEncryptedCookie).toHaveBeenCalledWith("user_data", user, 1);
        expect(useUserStore.getState().user).toEqual(user);
        useUserStore.setState({ user: null });
    });

    it("clearUser remove cookie e limpa o estado", async () => {
        const { useUserStore } = await import("./useUserStore");
        useUserStore.setState({ user });
        useUserStore.getState().clearUser();
        expect(removeCookie).toHaveBeenCalledWith("user_data");
        expect(useUserStore.getState().user).toBeNull();
    });
});
