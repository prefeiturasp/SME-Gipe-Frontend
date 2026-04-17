import { describe, expect, it } from "vitest";
import { formSchema } from "./schema";

describe("FormularioDre Schema", () => {
    describe("Campos obrigatórios", () => {
        it("deve validar com sucesso quando todos os campos estão preenchidos corretamente", () => {
            const data = {
                quaisOrgaosAcionadosDre: ["comunicacao_gipe"],
                numeroProcedimentoSEI: "Não" as const,
                numeroProcedimentoSEITexto: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it("deve validar com sucesso com múltiplos órgãos selecionados e SEI preenchido", () => {
            const data = {
                quaisOrgaosAcionadosDre: [
                    "comunicacao_supervisao_tecnica_saude",
                    "comunicacao_assistencia_social",
                    "comunicacao_gcm_ronda_escolar",
                    "comunicacao_gipe",
                ],
                numeroProcedimentoSEI: "Sim" as const,
                numeroProcedimentoSEITexto: "1234.5678/9012345-6",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it("deve falhar quando nenhum órgão é selecionado", () => {
            const data = {
                quaisOrgaosAcionadosDre: [],
                numeroProcedimentoSEI: "Não" as const,
                numeroProcedimentoSEITexto: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "quaisOrgaosAcionadosDre",
                ]);
                expect(result.error.issues[0].message).toBe(
                    "Selecione pelo menos um órgão",
                );
            }
        });
    });

    describe("Validação condicional - numeroProcedimentoSEI", () => {
        it("deve falhar quando numeroProcedimentoSEI é 'Sim' e numeroProcedimentoSEITexto está vazio", () => {
            const data = {
                quaisOrgaosAcionadosDre: ["comunicacao_gipe"],
                numeroProcedimentoSEI: "Sim" as const,
                numeroProcedimentoSEITexto: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "numeroProcedimentoSEITexto",
                ]);
                expect(result.error.issues[0].message).toBe(
                    "Campo obrigatório quando a resposta é 'Sim'",
                );
            }
        });

        it("deve falhar quando numeroProcedimentoSEI é 'Sim' e numeroProcedimentoSEITexto tem apenas espaços", () => {
            const data = {
                quaisOrgaosAcionadosDre: ["comunicacao_gipe"],
                numeroProcedimentoSEI: "Sim" as const,
                numeroProcedimentoSEITexto: "   ",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "numeroProcedimentoSEITexto",
                ]);
            }
        });

        it("deve validar quando numeroProcedimentoSEI é 'Sim' e numeroProcedimentoSEITexto está preenchido", () => {
            const data = {
                quaisOrgaosAcionadosDre: ["comunicacao_gipe"],
                numeroProcedimentoSEI: "Sim" as const,
                numeroProcedimentoSEITexto: "1234.5678/9012345-6",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it("deve validar quando numeroProcedimentoSEI é 'Não' e numeroProcedimentoSEITexto está vazio", () => {
            const data = {
                quaisOrgaosAcionadosDre: ["comunicacao_gipe"],
                numeroProcedimentoSEI: "Não" as const,
                numeroProcedimentoSEITexto: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it("deve falhar quando numeroProcedimentoSEI é 'Sim' e numeroProcedimentoSEITexto é undefined", () => {
            const data = {
                quaisOrgaosAcionadosDre: ["comunicacao_gipe"],
                numeroProcedimentoSEI: "Sim" as const,
                numeroProcedimentoSEITexto: undefined,
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "numeroProcedimentoSEITexto",
                ]);
            }
        });
    });
});
