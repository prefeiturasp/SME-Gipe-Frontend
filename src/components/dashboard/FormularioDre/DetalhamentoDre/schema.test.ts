import { describe, expect, it } from "vitest";
import { formSchema } from "./schema";

describe("FormularioDre Schema", () => {
    describe("Campos obrigatórios", () => {
        it("deve validar com sucesso quando todos os radios são 'Não'", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSupervisaoEscolar: "Não" as const,
                numeroProcedimentoSEI: "Não" as const,
                numeroProcedimentoSEITexto: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it("deve validar com sucesso quando numeroProcedimentoSEI é 'Sim' e texto está preenchido", () => {
            const data = {
                acionamentoSegurancaPublica: "Sim" as const,
                interlocucaoSupervisaoEscolar: "Sim" as const,
                numeroProcedimentoSEI: "Sim" as const,
                numeroProcedimentoSEITexto: "1234.5678/9012345-6",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    describe("Validação condicional - numeroProcedimentoSEI", () => {
        it("deve falhar quando numeroProcedimentoSEI é 'Sim' e numeroProcedimentoSEITexto está vazio", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSupervisaoEscolar: "Não" as const,
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
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSupervisaoEscolar: "Não" as const,
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
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSupervisaoEscolar: "Não" as const,
                numeroProcedimentoSEI: "Sim" as const,
                numeroProcedimentoSEITexto: "1234.5678/9012345-6",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it("deve validar quando numeroProcedimentoSEI é 'Não' e numeroProcedimentoSEITexto está vazio", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSupervisaoEscolar: "Não" as const,
                numeroProcedimentoSEI: "Não" as const,
                numeroProcedimentoSEITexto: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it("deve falhar quando numeroProcedimentoSEI é 'Sim' e numeroProcedimentoSEITexto é undefined", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSupervisaoEscolar: "Não" as const,
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
