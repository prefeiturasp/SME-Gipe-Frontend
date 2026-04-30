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
            quais_orgaos_acionados_dre: [
                "comunicacao_supervisao_tecnica_saude",
                "comunicacao_gipe",
            ],
            nr_processo_sei: "1234.5678/9012345-6",
        };

        const result = transformOcorrenciaDreToFormData(ocorrenciaDre);

        expect(result).toEqual({
            quaisOrgaosAcionadosDre: [
                "comunicacao_supervisao_tecnica_saude",
                "comunicacao_gipe",
            ],
            numeroProcedimentoSEI: "Sim",
            numeroProcedimentoSEITexto: "1234.5678/9012345-6",
        });
    });

    it("deve transformar dados da DRE com array vazio de órgãos e sem SEI", () => {
        const ocorrenciaDre: OcorrenciaDreResponse = {
            id: 1,
            uuid: "test-uuid",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-001",
            status: "em_preenchimento_dre",
            status_display: "Em preenchimento DRE",
            status_extra: "",
            quais_orgaos_acionados_dre: [],
        };

        const result = transformOcorrenciaDreToFormData(ocorrenciaDre);

        expect(result).toEqual({
            quaisOrgaosAcionadosDre: [],
            numeroProcedimentoSEI: "Não",
            numeroProcedimentoSEITexto: "",
        });
    });

    it("deve transformar dados com órgãos selecionados e SEI preenchido", () => {
        const ocorrenciaDre: OcorrenciaDreResponse = {
            id: 1,
            uuid: "test-uuid",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-001",
            status: "em_preenchimento_dre",
            status_display: "Em preenchimento DRE",
            status_extra: "",
            quais_orgaos_acionados_dre: ["comunicacao_gcm_ronda_escolar"],
            nr_processo_sei: "9876.5432/1234567-8",
        };

        const result = transformOcorrenciaDreToFormData(ocorrenciaDre);

        expect(result).toEqual({
            quaisOrgaosAcionadosDre: ["comunicacao_gcm_ronda_escolar"],
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
            quais_orgaos_acionados_dre: ["comunicacao_gipe"],
        };

        const result = transformOcorrenciaDreToFormData(ocorrenciaDre);

        expect(result.numeroProcedimentoSEI).toBe("Não");
        expect(result.numeroProcedimentoSEITexto).toBe("");
    });
});
