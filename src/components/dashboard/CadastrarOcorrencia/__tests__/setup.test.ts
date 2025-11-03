import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Setup - next/navigation mock", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it("deve mockar useRouter do next/navigation", async () => {
        await import("./setup");

        const { useRouter } = await import("next/navigation");

        const router = useRouter();

        expect(router).toBeDefined();
        expect(router.back).toBeDefined();
        expect(typeof router.back).toBe("function");
    });

    it("deve permitir chamar router.back sem erros", async () => {
        await import("./setup");

        const { useRouter } = await import("next/navigation");
        const router = useRouter();

        expect(() => router.back()).not.toThrow();
    });

    it("deve retornar o mesmo mock em múltiplas chamadas", async () => {
        await import("./setup");

        const { useRouter } = await import("next/navigation");

        const router1 = useRouter();
        const router2 = useRouter();

        expect(router1).toBeDefined();
        expect(router2).toBeDefined();
        expect(typeof router1.back).toBe("function");
        expect(typeof router2.back).toBe("function");
    });
});
