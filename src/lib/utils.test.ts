import { describe, it, expect } from "vitest";
import { cn, numberToBRL } from "./utils";

describe("cn", () => {
    it("combina classes simples", () => {
        expect(cn("a", "b")).toBe("a b");
    });
    it("remove falsy mas mantém duplicadas", () => {
        expect(cn("a", false, null, undefined, "b", "a")).toBe("a b a");
    });
    it("aceita array de classes", () => {
        expect(cn(["a", "b"], "c")).toBe("a b c");
    });
    it("retorna string vazia se nada válido", () => {
        expect(cn(null, false, undefined)).toBe("");
    });
});

describe("numberToBRL", () => {
    it("formata número inteiro", () => {
        expect(numberToBRL(1234)).toBe("R$ 1.234,00");
    });
    it("formata número decimal", () => {
        expect(numberToBRL(1234.56)).toBe("R$ 1.234,56");
    });
    it("formata zero", () => {
        expect(numberToBRL(0)).toBe("R$ 0,00");
    });
    it("formata número negativo", () => {
        expect(numberToBRL(-10.5)).toBe("-R$ 10,50");
    });
});
