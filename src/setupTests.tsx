import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Mock do ResizeObserver usado por Radix/cmdk
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

(global as typeof globalThis).ResizeObserver = ResizeObserver;

vi.mock("next/image", () => ({
    default: (props: Record<string, unknown>) => {
        // eslint-disable-next-line @next/next/no-img-element, @typescript-eslint/no-unused-vars
        const { priority, fetchPriority, fill, ...rest } = props || {};
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={typeof rest.alt === "string" ? rest.alt : ""} {...rest} />
        );
    },
}));

// Limpa o estado após cada teste
afterEach(() => {
    cleanup();
});
