import { describe, expect, it } from "vitest";
import { formSchema } from "./schema";

const VALID_PESSOA = {
    nome: "João Silva",
    idadeEmMeses: false,
    idade: "25",
    genero: "masculino",
    grupoEtnicoRacial: "pardo",
    etapaEscolar: "ensino_fundamental_2",
    frequenciaEscolar: "regular",
    interacaoAmbienteEscolar: "Boa interação com todos",
    nacionalidade: "Brasileira",
    pessoaComDeficiencia: "Sim",
};

const VALID_FORM = {
    pessoasAgressoras: [VALID_PESSOA],
    motivoOcorrencia: ["bullying"],
    notificadoConselhoTutelar: "Sim" as const,
    acompanhadoNAAPA: ["naapa"] as ["naapa"],
};

describe("formSchema - validação de idade", () => {
    it("deve aceitar idade numérica válida em anos", () => {
        const result = formSchema.safeParse(VALID_FORM);
        expect(result.success).toBe(true);
    });

    it("deve aceitar idade 0 quando idadeEmMeses está ativo", () => {
        const result = formSchema.safeParse({
            ...VALID_FORM,
            pessoasAgressoras: [
                { ...VALID_PESSOA, idadeEmMeses: true, idade: "0" },
            ],
        });
        expect(result.success).toBe(true);
    });

    it("deve aceitar idade 12 quando idadeEmMeses está ativo", () => {
        const result = formSchema.safeParse({
            ...VALID_FORM,
            pessoasAgressoras: [
                { ...VALID_PESSOA, idadeEmMeses: true, idade: "12" },
            ],
        });
        expect(result.success).toBe(true);
    });

    it("deve rejeitar idade 13 quando idadeEmMeses está ativo", () => {
        const result = formSchema.safeParse({
            ...VALID_FORM,
            pessoasAgressoras: [
                { ...VALID_PESSOA, idadeEmMeses: true, idade: "13" },
            ],
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            const idadeError = result.error.issues.find((i) =>
                i.path.includes("idade"),
            );
            expect(idadeError?.message).toBe(
                "A idade em meses deve ser entre 0 e 12",
            );
        }
    });

    it("deve rejeitar idade negativa quando idadeEmMeses está ativo", () => {
        const result = formSchema.safeParse({
            ...VALID_FORM,
            pessoasAgressoras: [
                { ...VALID_PESSOA, idadeEmMeses: true, idade: "-1" },
            ],
        });
        expect(result.success).toBe(false);
    });

    it("deve rejeitar idade 0 quando idadeEmMeses está inativo", () => {
        const result = formSchema.safeParse({
            ...VALID_FORM,
            pessoasAgressoras: [
                { ...VALID_PESSOA, idadeEmMeses: false, idade: "0" },
            ],
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            const idadeError = result.error.issues.find((i) =>
                i.path.includes("idade"),
            );
            expect(idadeError?.message).toBe("Idade deve ser um número válido");
        }
    });

    it("deve rejeitar idade não numérica (NaN)", () => {
        const result = formSchema.safeParse({
            ...VALID_FORM,
            pessoasAgressoras: [{ ...VALID_PESSOA, idade: "abc" }],
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            const idadeError = result.error.issues.find((i) =>
                i.path.includes("idade"),
            );
            expect(idadeError?.message).toBe("Idade deve ser um número válido");
        }
    });
});
