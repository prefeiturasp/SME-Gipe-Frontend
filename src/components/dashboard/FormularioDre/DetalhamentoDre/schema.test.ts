import { describe, it, expect } from "vitest";
import { formSchema } from "./schema";

describe("FormularioDre Schema", () => {
    describe("Campos obrigatórios", () => {
        it("deve validar com sucesso quando todos os radios são 'Não' e textareas vazios", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Não" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it("deve validar com sucesso quando todos os radios são 'Sim' e textareas preenchidos", () => {
            const data = {
                acionamentoSegurancaPublica: "Sim" as const,
                interlocucaoSTS: "Sim" as const,
                informacoesComplementaresSTS: "Informações STS",
                interlocucaoCPCA: "Sim" as const,
                informacoesComplementaresCPCA: "Informações CPCA",
                interlocucaoSupervisaoEscolar: "Sim" as const,
                informacoesComplementaresSupervisaoEscolar:
                    "Informações Supervisão",
                interlocucaoNAAPA: "Sim" as const,
                informacoesComplementaresNAAPA: "Informações NAAPA",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    describe("Validação condicional - interlocucaoSTS", () => {
        it("deve falhar quando interlocucaoSTS é 'Sim' e informacoesComplementaresSTS está vazio", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Sim" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "informacoesComplementaresSTS",
                ]);
                expect(result.error.issues[0].message).toBe(
                    "Campo obrigatório quando a resposta é 'Sim'"
                );
            }
        });

        it("deve falhar quando interlocucaoSTS é 'Sim' e informacoesComplementaresSTS tem apenas espaços", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Sim" as const,
                informacoesComplementaresSTS: "   ",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "informacoesComplementaresSTS",
                ]);
            }
        });

        it("deve validar quando interlocucaoSTS é 'Sim' e informacoesComplementaresSTS está preenchido", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Sim" as const,
                informacoesComplementaresSTS: "Informações válidas",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it("deve validar quando interlocucaoSTS é 'Não' e informacoesComplementaresSTS está vazio", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Não" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    describe("Validação condicional - interlocucaoCPCA", () => {
        it("deve falhar quando interlocucaoCPCA é 'Sim' e informacoesComplementaresCPCA está vazio", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Não" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Sim" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "informacoesComplementaresCPCA",
                ]);
                expect(result.error.issues[0].message).toBe(
                    "Campo obrigatório quando a resposta é 'Sim'"
                );
            }
        });

        it("deve falhar quando interlocucaoCPCA é 'Sim' e informacoesComplementaresCPCA tem apenas espaços", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Não" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Sim" as const,
                informacoesComplementaresCPCA: "   ",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "informacoesComplementaresCPCA",
                ]);
            }
        });

        it("deve validar quando interlocucaoCPCA é 'Sim' e informacoesComplementaresCPCA está preenchido", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Não" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Sim" as const,
                informacoesComplementaresCPCA: "Informações válidas",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    describe("Validação condicional - interlocucaoSupervisaoEscolar", () => {
        it("deve falhar quando interlocucaoSupervisaoEscolar é 'Sim' e informacoesComplementaresSupervisaoEscolar está vazio", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Não" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Sim" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "informacoesComplementaresSupervisaoEscolar",
                ]);
                expect(result.error.issues[0].message).toBe(
                    "Campo obrigatório quando a resposta é 'Sim'"
                );
            }
        });

        it("deve falhar quando interlocucaoSupervisaoEscolar é 'Sim' e informacoesComplementaresSupervisaoEscolar tem apenas espaços", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Não" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Sim" as const,
                informacoesComplementaresSupervisaoEscolar: "   ",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "informacoesComplementaresSupervisaoEscolar",
                ]);
            }
        });

        it("deve validar quando interlocucaoSupervisaoEscolar é 'Sim' e informacoesComplementaresSupervisaoEscolar está preenchido", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Não" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Sim" as const,
                informacoesComplementaresSupervisaoEscolar:
                    "Informações válidas",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    describe("Validação condicional - interlocucaoNAAPA", () => {
        it("deve falhar quando interlocucaoNAAPA é 'Sim' e informacoesComplementaresNAAPA está vazio", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Não" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Sim" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "informacoesComplementaresNAAPA",
                ]);
                expect(result.error.issues[0].message).toBe(
                    "Campo obrigatório quando a resposta é 'Sim'"
                );
            }
        });

        it("deve falhar quando interlocucaoNAAPA é 'Sim' e informacoesComplementaresNAAPA tem apenas espaços", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Não" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Sim" as const,
                informacoesComplementaresNAAPA: "   ",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "informacoesComplementaresNAAPA",
                ]);
            }
        });

        it("deve validar quando interlocucaoNAAPA é 'Sim' e informacoesComplementaresNAAPA está preenchido", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Não" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Sim" as const,
                informacoesComplementaresNAAPA: "Informações válidas",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    describe("Validações combinadas", () => {
        it("deve falhar com múltiplos erros quando vários campos 'Sim' têm textareas vazios", () => {
            const data = {
                acionamentoSegurancaPublica: "Sim" as const,
                interlocucaoSTS: "Sim" as const,
                informacoesComplementaresSTS: "",
                interlocucaoCPCA: "Sim" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Sim" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Sim" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                // Deve ter 4 erros (um para cada textarea obrigatório)
                expect(result.error.issues.length).toBe(4);
            }
        });

        it("deve validar quando alguns campos são 'Sim' com textareas preenchidos e outros são 'Não'", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Sim" as const,
                informacoesComplementaresSTS: "Info STS",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Sim" as const,
                informacoesComplementaresSupervisaoEscolar: "Info Supervisão",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it("deve permitir textareas preenchidos mesmo quando radio é 'Não'", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Não" as const,
                informacoesComplementaresSTS:
                    "Informações extras mesmo sendo Não",
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "Mais informações",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar:
                    "Detalhes adicionais",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "Outras observações",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    describe("Campos undefined", () => {
        it("deve falhar quando interlocucaoSTS é 'Sim' e informacoesComplementaresSTS é undefined", () => {
            const data = {
                acionamentoSegurancaPublica: "Não" as const,
                interlocucaoSTS: "Sim" as const,
                informacoesComplementaresSTS: undefined,
                interlocucaoCPCA: "Não" as const,
                informacoesComplementaresCPCA: "",
                interlocucaoSupervisaoEscolar: "Não" as const,
                informacoesComplementaresSupervisaoEscolar: "",
                interlocucaoNAAPA: "Não" as const,
                informacoesComplementaresNAAPA: "",
            };

            const result = formSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual([
                    "informacoesComplementaresSTS",
                ]);
            }
        });
    });
});
