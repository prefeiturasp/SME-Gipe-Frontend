import { describe, it, expect } from "vitest";
import apiAnexos from "./axios-anexos";

describe("apiAnexos", () => {
    it("deve estar configurado com a baseURL correta", () => {
        expect(apiAnexos.defaults.baseURL).toBe(
            process.env.NEXT_PUBLIC_API_ANEXOS_URL
        );
    });

    it("deve ser uma instância do axios", () => {
        expect(apiAnexos).toBeDefined();
        expect(apiAnexos.get).toBeDefined();
        expect(apiAnexos.post).toBeDefined();
        expect(apiAnexos.put).toBeDefined();
        expect(apiAnexos.delete).toBeDefined();
    });
});
