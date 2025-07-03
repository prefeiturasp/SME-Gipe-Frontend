import { describe, it, expect, vi } from "vitest";
import axiosInstance from "./axios";

describe("axiosInstance", () => {
    it("deve ter a baseURL igual à variável de ambiente", async () => {
        process.env.AUTENTICA_CORESSO_API_URL = "https://api.exemplo.com";
        vi.resetModules();
        const instance = (await import("./axios")).default;
        expect(instance.defaults.baseURL).toBe("https://api.exemplo.com");
    });

    it("deve ser uma instância do axios", () => {
        expect(axiosInstance).toHaveProperty("interceptors");
        expect(typeof axiosInstance.get).toBe("function");
        expect(typeof axiosInstance.post).toBe("function");
    });
});
