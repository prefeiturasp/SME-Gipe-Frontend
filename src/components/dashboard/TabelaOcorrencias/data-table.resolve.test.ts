import { resolveColId } from "./data-table";
import type { Header, Cell } from "@tanstack/react-table";

describe("resolveColId", () => {
    it("retorna column.id quando existe", () => {
        const node = {
            column: { id: "col-1" },
            id: "fallback",
        } as unknown as Header<unknown, unknown>;
        expect(resolveColId(node)).toBe("col-1");
    });

    it("retorna id quando column não existe", () => {
        const node = { id: "fallback" } as unknown as Cell<unknown, unknown>;
        expect(resolveColId(node)).toBe("fallback");
    });
});
