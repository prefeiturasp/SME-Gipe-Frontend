import { describe, it, expect, vi, beforeEach } from "vitest";
import * as cookieUtils from "./cookieUtils";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

vi.mock("js-cookie", () => ({
    __esModule: true,
    default: {
        set: vi.fn(),
        get: vi.fn(),
        remove: vi.fn(),
    },
    set: vi.fn(),
    get: vi.fn(),
    remove: vi.fn(),
}));

const cookiesMock = Cookies as unknown as {
    set: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
};

describe("cookieUtils", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("setEncryptedCookie deve criptografar e setar o cookie", () => {
        const spy = vi.spyOn(CryptoJS.AES, "encrypt");
        cookieUtils.setEncryptedCookie("key", { foo: "bar" });
        expect(spy).toHaveBeenCalled();
        expect(cookiesMock.set).toHaveBeenCalled();
    });

    it("getDecryptedCookie deve descriptografar e retornar o valor", () => {
        const value = { foo: "bar" };
        const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(value),
            process.env.NEXTAUTH_SECRET || "default-secret-key"
        ).toString();
        cookiesMock.get.mockReturnValue(encrypted);
        const result = cookieUtils.getDecryptedCookie<{ foo: string }>("key");
        expect(result).toEqual(value);
    });

    it("getDecryptedCookie retorna null se não houver cookie", () => {
        cookiesMock.get.mockReturnValue(undefined);
        const result = cookieUtils.getDecryptedCookie("key");
        expect(result).toBeNull();
    });

    it("removeCookie remove o cookie", () => {
        cookieUtils.removeCookie("key");
        expect(cookiesMock.remove).toHaveBeenCalledWith("key", { path: "/" });
    });

    it("setPlainCookie deve setar o cookie simples", () => {
        cookieUtils.setPlainCookie("key", "value");
        expect(cookiesMock.set).toHaveBeenCalledWith(
            "key",
            "value",
            expect.objectContaining({ path: "/" })
        );
    });

    it("getPlainCookie retorna o valor do cookie simples", () => {
        cookiesMock.get.mockReturnValue("abc");
        expect(cookieUtils.getPlainCookie("key")).toBe("abc");
    });

    it("getDecryptedCookie retorna null se JSON.parse lançar erro", () => {
        cookiesMock.get.mockReturnValue("encrypted");
        const originalDecrypt = CryptoJS.AES.decrypt;
        // Simula um valor que não é JSON válido
        vi.spyOn(CryptoJS.AES, "decrypt").mockReturnValueOnce({
            words: [],
            sigBytes: 0,
            toString: () => "not-a-json",
        } as unknown as CryptoJS.lib.WordArray);
        // Força JSON.parse a lançar
        const originalParse = JSON.parse;
        global.JSON.parse = () => {
            throw new Error("invalid json");
        };
        const result = cookieUtils.getDecryptedCookie("key");
        expect(result).toBeNull();
        // Restaura mocks
        CryptoJS.AES.decrypt = originalDecrypt;
        global.JSON.parse = originalParse;
    });
});
