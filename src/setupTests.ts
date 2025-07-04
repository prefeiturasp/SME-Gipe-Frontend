import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Limpa o estado após cada teste (importante para evitar vazamento de memória)
afterEach(() => {
    cleanup();
});
