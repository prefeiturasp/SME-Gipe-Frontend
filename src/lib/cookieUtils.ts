import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.NEXTAUTH_SECRET || "default-secret-key";

export function setEncryptedCookie<T>(key: string, value: T, expires = 1) {
    const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(value),
        ENCRYPTION_KEY
    ).toString();
    Cookies.set(key, encrypted, {
        secure: true,
        sameSite: "Strict",
        expires,
        path: "/",
    });
}

export function getDecryptedCookie<T>(key: string): T | null {
    try {
        const encrypted = Cookies.get(key);
        if (!encrypted) return null;
        const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted) as T;
    } catch {
        return null;
    }
}

export function removeCookie(key: string) {
    Cookies.remove(key, { path: "/" });
}

export function setPlainCookie(key: string, value: string, expires = 1) {
    Cookies.set(key, value, {
        secure: true,
        sameSite: "Strict",
        expires,
        path: "/",
    });
}

export function getPlainCookie(key: string): string | undefined {
    return Cookies.get(key);
}
