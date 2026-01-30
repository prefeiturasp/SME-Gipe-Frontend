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

if (typeof window !== "undefined") {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
    // jsdom não implementa scrollIntoView; Radix Select usa ao abrir conteúdo
    // Mock para evitar erros durante os testes
    (
        window.HTMLElement.prototype as unknown as {
            scrollIntoView: () => void;
        }
    ).scrollIntoView = vi.fn();

    // jsdom não implementa scrollTo; usado em vários componentes
    // Mock para evitar warnings durante os testes
    window.scrollTo = vi.fn();

    // jsdom não implementa navegação via <a> click para downloads
    // Mock para evitar erros ao baixar arquivos nos testes
    window.HTMLAnchorElement.prototype.click = vi.fn();
}

// Limpa o estado após cada teste
afterEach(() => {
    cleanup();
});
