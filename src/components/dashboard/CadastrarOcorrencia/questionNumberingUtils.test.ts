import { describe, expect, it } from "vitest";
import {
    computeStartingNumbers,
    questionPrefix,
} from "./questionNumberingUtils";

describe("computeStartingNumbers", () => {
    describe("fluxo patrimonial (isFurtoRoubo=true)", () => {
        it("deve retornar os números iniciais corretos para o fluxo patrimonial", () => {
            const result = computeStartingNumbers(true, false, 1);

            expect(result.secaoInicial).toBe(1);
            expect(result.step2).toBe(5);
            expect(result.informacoesAdicionais).toBeUndefined();
            expect(result.secaoFinal).toBe(8);
            expect(result.anexos).toBe(10);
        });

        it("deve ignorar hasAgressorVitimaInfo e personCount no fluxo patrimonial", () => {
            const result = computeStartingNumbers(true, true, 5);

            expect(result.informacoesAdicionais).toBeUndefined();
            expect(result.secaoFinal).toBe(8);
            expect(result.anexos).toBe(10);
        });
    });

    describe("fluxo interpessoal sem agressor/vítima", () => {
        it("deve retornar os números iniciais corretos quando não há info de agressor", () => {
            const result = computeStartingNumbers(false, false, 1);

            expect(result.secaoInicial).toBe(1);
            expect(result.step2).toBe(5);
            expect(result.informacoesAdicionais).toBeUndefined();
            expect(result.secaoFinal).toBe(9);
            expect(result.anexos).toBe(12);
        });
    });

    describe("fluxo interpessoal com agressor/vítima", () => {
        it("deve calcular corretamente para 1 pessoa", () => {
            // Q1-4 SecaoInicial, Q5-8 SecaoNaoFurto, Q9-17 Envolvidos (9 campos)
            // Q18-21 InfoAdicional fixas (4), Q22-24 SecaoFinal (3), Q25-26 Anexos
            const result = computeStartingNumbers(false, true, 1);

            expect(result.secaoInicial).toBe(1);
            expect(result.step2).toBe(5);
            expect(result.informacoesAdicionais).toBe(9);
            expect(result.secaoFinal).toBe(22);
            expect(result.anexos).toBe(25);
        });

        it("deve calcular corretamente para 2 pessoas", () => {
            // Q9-17 pessoa 1 (9), Q18-26 pessoa 2 (9)
            // informacoesAdicionais=9, secaoFinal = 9 + 2*9 + 4 = 31
            const result = computeStartingNumbers(false, true, 2);

            expect(result.informacoesAdicionais).toBe(9);
            expect(result.secaoFinal).toBe(31);
            expect(result.anexos).toBe(34);
        });

        it("deve calcular corretamente para 3 pessoas", () => {
            // secaoFinal = 9 + 3*9 + 4 = 40; anexos = 43
            const result = computeStartingNumbers(false, true, 3);

            expect(result.informacoesAdicionais).toBe(9);
            expect(result.secaoFinal).toBe(40);
            expect(result.anexos).toBe(43);
        });
    });
});

describe("questionPrefix", () => {
    it("deve retornar prefixo 'N. ' quando startingNumber é fornecido com offset 0", () => {
        expect(questionPrefix(5, 0)).toBe("5. ");
    });

    it("deve somar offset ao número inicial", () => {
        expect(questionPrefix(5, 2)).toBe("7. ");
    });

    it("deve retornar string vazia quando startingNumber é undefined", () => {
        expect(questionPrefix(undefined, 0)).toBe("");
    });

    it("deve retornar string vazia quando startingNumber é undefined independente do offset", () => {
        expect(questionPrefix(undefined, 3)).toBe("");
    });

    it("deve funcionar com offset maior", () => {
        expect(questionPrefix(1, 8)).toBe("9. ");
    });
});
