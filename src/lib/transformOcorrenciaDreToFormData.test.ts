import { OcorrenciaDreResponse } from "@/types/ocorrencia-dre";
import { describe, expect, it } from "vitest";
import { transformOcorrenciaDreToFormData } from "./transformOcorrenciaDreToFormData";

describe("transformOcorrenciaDreToFormData", () => {
    it("deve transformar dados da DRE com todos os campos preenchidos", () => {
        const ocorrenciaDre: OcorrenciaDreResponse = {
            id: 1,
            uuid: "test-uuid",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-001",
            status: "em_preenchimento_dre",
            status_display: "Em preenchimento DRE",
            status_extra: "",
            acionamento_seguranca_publica: true,
            interlocucao_supervisao_escolar: true,
            nr_processo_sei: "1234.5678/9012345-6",
        };

        const result = transformOcorrenciaDreToFormData(ocorrenciaDre);

        expect(result).toEqual({
            acionamentoSegurancaPublica: "Sim",
            interlocucaoSupervisaoEscolar: "Sim",
            numeroProcedimentoSEI: "Sim",
            numeroProcedimentoSEITexto: "1234.5678/9012345-6",
        });
    });

    it("deve transformar dados da DRE com campos booleanos como false e sem SEI", () => {
        const ocorrenciaDre: OcorrenciaDreResponse = {
            id: 1,
            uuid: "test-uuid",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-001",
            status: "em_preenchimento_dre",
            status_display: "Em preenchimento DRE",
            status_extra: "",
            acionamento_seguranca_publica: false,
            interlocucao_supervisao_escolar: false,
        };

        const result = transformOcorrenciaDreToFormData(ocorrenciaDre);

        expect(result).toEqual({
            acionamentoSegurancaPublica: "Não",
            interlocucaoSupervisaoEscolar: "Não",
            numeroProcedimentoSEI: "Não",
            numeroProcedimentoSEITexto: "",
        });
    });

    it("deve transformar dados com mix de true e false e SEI preenchido", () => {
        const ocorrenciaDre: OcorrenciaDreResponse = {
            id: 1,
            uuid: "test-uuid",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-001",
            status: "em_preenchimento_dre",
            status_display: "Em preenchimento DRE",
            status_extra: "",
            acionamento_seguranca_publica: true,
            interlocucao_supervisao_escolar: false,
            nr_processo_sei: "9876.5432/1234567-8",
        };

        const result = transformOcorrenciaDreToFormData(ocorrenciaDre);

        expect(result).toEqual({
            acionamentoSegurancaPublica: "Sim",
            interlocucaoSupervisaoEscolar: "Não",
            numeroProcedimentoSEI: "Sim",
            numeroProcedimentoSEITexto: "9876.5432/1234567-8",
        });
    });

    it("deve retornar numeroProcedimentoSEITexto vazio quando nr_processo_sei é undefined", () => {
        const ocorrenciaDre: OcorrenciaDreResponse = {
            id: 1,
            uuid: "test-uuid",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-001",
            status: "em_preenchimento_dre",
            status_display: "Em preenchimento DRE",
            status_extra: "",
            acionamento_seguranca_publica: true,
            interlocucao_supervisao_escolar: true,
        };

        const result = transformOcorrenciaDreToFormData(ocorrenciaDre);

        expect(result.numeroProcedimentoSEI).toBe("Não");
        expect(result.numeroProcedimentoSEITexto).toBe("");
    });
});
