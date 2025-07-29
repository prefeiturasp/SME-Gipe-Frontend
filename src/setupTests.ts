import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Mock do ResizeObserver usado por Radix/cmdk
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

(global as typeof globalThis).ResizeObserver = ResizeObserver;

// Limpa o estado após cada teste
afterEach(() => {
    cleanup();
});
