import { hasColumnFlag } from "./data-table";
import type { Header, Cell } from "@tanstack/react-table";

describe("hasColumnFlag", () => {
    it("retorna 'true' quando node.column existe", () => {
        const node = {
            column: { id: "col-1" },
            id: "fallback",
        } as unknown as Header<unknown, unknown>;
        expect(hasColumnFlag(node)).toBe("true");
    });

    it("retorna 'false' quando node.column nao existe", () => {
        const node = { id: "fallback" } as unknown as Cell<unknown, unknown>;
        expect(hasColumnFlag(node)).toBe("false");
    });
});
