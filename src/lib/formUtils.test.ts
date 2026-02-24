import { describe, expect, it } from "vitest";
import {
    compareArrays,
    filterValidTiposOcorrencia,
    hasFormDataChanged,
} from "./formUtils";

describe("formUtils", () => {
    describe("compareArrays", () => {
        it("deve retornar false quando os arrays são iguais", () => {
            const arr1 = ["a", "b", "c"];
            const arr2 = ["a", "b", "c"];

            expect(compareArrays(arr1, arr2)).toBe(false);
        });

        it("deve retornar false quando os arrays têm os mesmos elementos em ordem diferente", () => {
            const arr1 = ["c", "b", "a"];
            const arr2 = ["a", "b", "c"];

            expect(compareArrays(arr1, arr2)).toBe(false);
        });

        it("deve retornar true quando os arrays têm tamanhos diferentes", () => {
            const arr1 = ["a", "b"];
            const arr2 = ["a", "b", "c"];

            expect(compareArrays(arr1, arr2)).toBe(true);
        });

        it("deve retornar true quando os arrays têm elementos diferentes", () => {
            const arr1 = ["a", "b", "c"];
            const arr2 = ["a", "b", "d"];

            expect(compareArrays(arr1, arr2)).toBe(true);
        });

        it("deve retornar true quando o segundo array é undefined", () => {
            const arr1 = ["a", "b", "c"];

            expect(compareArrays(arr1)).toBe(true);
        });

        it("deve retornar false quando ambos os arrays estão vazios", () => {
            expect(compareArrays([], [])).toBe(false);
        });
    });

    describe("hasFormDataChanged", () => {
        it("deve retornar false quando não há mudanças em valores primitivos", () => {
            const current = {
                nome: "João",
                idade: 30,
                ativo: true,
            };
            const reference = {
                nome: "João",
                idade: 30,
                ativo: true,
            };

            expect(hasFormDataChanged(current, reference)).toBe(false);
        });

        it("deve retornar true quando há mudanças em valores primitivos", () => {
            const current = {
                nome: "João",
                idade: 30,
            };
            const reference = {
                nome: "Maria",
                idade: 30,
            };

            expect(hasFormDataChanged(current, reference)).toBe(true);
        });

        it("deve retornar true quando referenceData é undefined", () => {
            const current = {
                nome: "João",
            };

            expect(hasFormDataChanged(current, undefined)).toBe(true);
        });

        it("deve retornar true quando referenceData está vazio", () => {
            const current = {
                nome: "João",
            };

            expect(hasFormDataChanged(current, {})).toBe(true);
        });

        it("deve comparar arrays corretamente quando especificado", () => {
            const current = {
                nome: "João",
                tags: ["a", "b", "c"],
            };
            const reference = {
                nome: "João",
                tags: ["c", "b", "a"],
            };

            expect(hasFormDataChanged(current, reference, ["tags"])).toBe(
                false,
            );
        });

        it("deve detectar mudanças em arrays", () => {
            const current = {
                nome: "João",
                tags: ["a", "b", "c"],
            };
            const reference = {
                nome: "João",
                tags: ["a", "b", "d"],
            };

            expect(hasFormDataChanged(current, reference, ["tags"])).toBe(true);
        });

        it("deve tratar undefined e string vazia como equivalentes", () => {
            const current = {
                nome: "João",
                descricao: "",
            };
            const reference = {
                nome: "João",
                descricao: undefined,
            };

            expect(hasFormDataChanged(current, reference)).toBe(false);
        });

        it("deve tratar null e string vazia como equivalentes", () => {
            const current = {
                nome: "João",
                descricao: "",
            };
            const reference = {
                nome: "João",
                descricao: null as unknown as string,
            };

            expect(hasFormDataChanged(current, reference)).toBe(false);
        });

        it("deve tratar undefined no currentValue como string vazia", () => {
            const current = {
                nome: "João",
                descricao: undefined as unknown as string,
            };
            const reference = {
                nome: "João",
                descricao: "",
            };

            expect(hasFormDataChanged(current, reference)).toBe(false);
        });

        it("deve tratar null no currentValue como string vazia", () => {
            const current = {
                nome: "João",
                descricao: null as unknown as string,
            };
            const reference = {
                nome: "João",
                descricao: "",
            };

            expect(hasFormDataChanged(current, reference)).toBe(false);
        });

        it("deve detectar mudança quando currentValue tem valor e referenceValue é null", () => {
            const current = {
                nome: "João",
                descricao: "Alguma descrição",
            };
            const reference = {
                nome: "João",
                descricao: null as unknown as string,
            };

            expect(hasFormDataChanged(current, reference)).toBe(true);
        });

        it("deve detectar mudança quando currentValue é null e referenceValue tem valor", () => {
            const current = {
                nome: "João",
                descricao: null as unknown as string,
            };
            const reference = {
                nome: "João",
                descricao: "Alguma descrição",
            };

            expect(hasFormDataChanged(current, reference)).toBe(true);
        });

        it("deve tratar 0 (zero) como valor diferente de string vazia", () => {
            const current = {
                nome: "João",
                idade: 0,
            };
            const reference = {
                nome: "João",
                idade: "" as unknown as number,
            };

            expect(hasFormDataChanged(current, reference)).toBe(true);
        });

        it("deve tratar false como valor diferente de string vazia", () => {
            const current = {
                nome: "João",
                ativo: false,
            };
            const reference = {
                nome: "João",
                ativo: "" as unknown as boolean,
            };

            expect(hasFormDataChanged(current, reference)).toBe(true);
        });

        it("deve detectar mudanças com múltiplos campos incluindo arrays", () => {
            const current = {
                dataOcorrencia: "2025-01-15",
                dre: "123",
                unidadeEducacional: "456",
                tipoOcorrencia: "Sim",
            };
            const reference = {
                dataOcorrencia: "2025-01-15",
                dre: "123",
                unidadeEducacional: "456",
                tipoOcorrencia: "Não",
            };

            expect(hasFormDataChanged(current, reference)).toBe(true);
        });

        it("deve funcionar com tipos complexos (SecaoFurtoERoubo)", () => {
            const current = {
                tiposOcorrencia: ["uuid1", "uuid2", "uuid3"],
                descricao: "Descrição da ocorrência",
                smartSampa: "Sim",
            };
            const reference = {
                tiposOcorrencia: ["uuid3", "uuid1", "uuid2"],
                descricao: "Descrição da ocorrência",
                smartSampa: "Sim",
            };

            expect(
                hasFormDataChanged(current, reference, ["tiposOcorrencia"]),
            ).toBe(false);
        });
    });

    describe("filterValidTiposOcorrencia", () => {
        it("deve manter apenas UUIDs que existem na lista disponível", () => {
            const selected = ["uuid1", "uuid2", "uuid3"];
            const available = [
                { uuid: "uuid1" },
                { uuid: "uuid3" },
                { uuid: "uuid5" },
            ];

            expect(filterValidTiposOcorrencia(selected, available)).toEqual([
                "uuid1",
                "uuid3",
            ]);
        });

        it("deve retornar array vazio quando nenhum UUID selecionado é válido", () => {
            const selected = ["uuid-invalido-1", "uuid-invalido-2"];
            const available = [{ uuid: "uuid1" }, { uuid: "uuid2" }];

            expect(filterValidTiposOcorrencia(selected, available)).toEqual([]);
        });

        it("deve retornar todos os UUIDs quando todos são válidos", () => {
            const selected = ["uuid1", "uuid2"];
            const available = [
                { uuid: "uuid1" },
                { uuid: "uuid2" },
                { uuid: "uuid3" },
            ];

            expect(filterValidTiposOcorrencia(selected, available)).toEqual([
                "uuid1",
                "uuid2",
            ]);
        });

        it("deve retornar os selectedIds quando availableTypes é undefined", () => {
            const selected = ["uuid1", "uuid2"];

            expect(filterValidTiposOcorrencia(selected, undefined)).toEqual([
                "uuid1",
                "uuid2",
            ]);
        });

        it("deve retornar os selectedIds quando availableTypes é um array vazio", () => {
            const selected = ["uuid1", "uuid2"];

            expect(filterValidTiposOcorrencia(selected, [])).toEqual([
                "uuid1",
                "uuid2",
            ]);
        });

        it("deve retornar array vazio quando selectedIds é vazio", () => {
            const available = [{ uuid: "uuid1" }];

            expect(filterValidTiposOcorrencia([], available)).toEqual([]);
        });
    });
});
