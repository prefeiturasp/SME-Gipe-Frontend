import { describe, it, expect } from "vitest";
import { matchDre, matchNomeUe } from "./filters";

describe("TabelaOcorrencias/filters", () => {
    describe("matchDre", () => {
        it("deve retornar true se o DRE do item incluir o DRE do filtro", () => {
            expect(matchDre("DRE - Capela do Socorro", "Capela")).toBe(true);
        });

        it("deve retornar true se o DRE do filtro estiver vazio", () => {
            expect(matchDre("DRE - Capela do Socorro", "")).toBe(true);
        });

        it("deve retornar false se o DRE do item não incluir o DRE do filtro", () => {
            expect(matchDre("DRE - Capela do Socorro", "Itaquera")).toBe(false);
        });

        it("deve ignorar acentos e maiúsculas/minúsculas", () => {
            expect(
                matchDre("DRE - Capela do Socorro", "capela do socorro")
            ).toBe(true);
            expect(matchDre("DRE - Itaquera", "itaquéra")).toBe(true);
        });
    });

    describe("matchNomeUe", () => {
        it("deve retornar true se o nome da UE do item incluir o nome da UE do filtro", () => {
            expect(matchNomeUe("EMEF Prof. João", "João")).toBe(true);
        });

        it("deve retornar true se o nome da UE do filtro estiver vazio", () => {
            expect(matchNomeUe("EMEF Prof. João", "")).toBe(true);
        });

        it("deve retornar false se o nome da UE do item não incluir o nome da UE do filtro", () => {
            expect(matchNomeUe("EMEF Prof. João", "Maria")).toBe(false);
        });

        it("deve ignorar acentos e maiúsculas/minúsculas", () => {
            expect(matchNomeUe("EMEF Prof. João", "joao")).toBe(true);
            expect(matchNomeUe("CEU Água Azul", "agua azul")).toBe(true);
        });
    });
});
