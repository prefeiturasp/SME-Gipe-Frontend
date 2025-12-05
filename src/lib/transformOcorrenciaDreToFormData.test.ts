import { describe, it, expect } from "vitest";
import { transformOcorrenciaDreToFormData } from "./transformOcorrenciaDreToFormData";
import { OcorrenciaDreResponse } from "@/types/ocorrencia-dre";

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
            interlocucao_sts: true,
            info_complementar_sts: "Informações STS",
            interlocucao_cpca: true,
            info_complementar_cpca: "Informações CPCA",
            interlocucao_supervisao_escolar: true,
            info_complementar_supervisao_escolar: "Informações Supervisão",
            interlocucao_naapa: true,
            info_complementar_naapa: "Informações NAAPA",
        };

        const result = transformOcorrenciaDreToFormData(ocorrenciaDre);

        expect(result).toEqual({
            acionamentoSegurancaPublica: "Sim",
            interlocucaoSTS: "Sim",
            informacoesComplementaresSTS: "Informações STS",
            interlocucaoCPCA: "Sim",
            informacoesComplementaresCPCA: "Informações CPCA",
            interlocucaoSupervisaoEscolar: "Sim",
            informacoesComplementaresSupervisaoEscolar:
                "Informações Supervisão",
            interlocucaoNAAPA: "Sim",
            informacoesComplementaresNAAPA: "Informações NAAPA",
        });
    });

    it("deve transformar dados da DRE com campos booleanos como false", () => {
        const ocorrenciaDre: OcorrenciaDreResponse = {
            id: 1,
            uuid: "test-uuid",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-001",
            status: "em_preenchimento_dre",
            status_display: "Em preenchimento DRE",
            status_extra: "",
            acionamento_seguranca_publica: false,
            interlocucao_sts: false,
            info_complementar_sts: "",
            interlocucao_cpca: false,
            info_complementar_cpca: "",
            interlocucao_supervisao_escolar: false,
            info_complementar_supervisao_escolar: "",
            interlocucao_naapa: false,
            info_complementar_naapa: "",
        };

        const result = transformOcorrenciaDreToFormData(ocorrenciaDre);

        expect(result).toEqual({
            acionamentoSegurancaPublica: "Não",
            interlocucaoSTS: "Não",
            informacoesComplementaresSTS: "",
            interlocucaoCPCA: "Não",
            informacoesComplementaresCPCA: "",
            interlocucaoSupervisaoEscolar: "Não",
            informacoesComplementaresSupervisaoEscolar: "",
            interlocucaoNAAPA: "Não",
            informacoesComplementaresNAAPA: "",
        });
    });

    it("deve transformar dados com mix de true e false", () => {
        const ocorrenciaDre: OcorrenciaDreResponse = {
            id: 1,
            uuid: "test-uuid",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-001",
            status: "em_preenchimento_dre",
            status_display: "Em preenchimento DRE",
            status_extra: "",
            acionamento_seguranca_publica: true,
            interlocucao_sts: false,
            info_complementar_sts: "",
            interlocucao_cpca: true,
            info_complementar_cpca: "Apenas CPCA",
            interlocucao_supervisao_escolar: false,
            info_complementar_supervisao_escolar: "",
            interlocucao_naapa: true,
            info_complementar_naapa: "Apenas NAAPA",
        };

        const result = transformOcorrenciaDreToFormData(ocorrenciaDre);

        expect(result).toEqual({
            acionamentoSegurancaPublica: "Sim",
            interlocucaoSTS: "Não",
            informacoesComplementaresSTS: "",
            interlocucaoCPCA: "Sim",
            informacoesComplementaresCPCA: "Apenas CPCA",
            interlocucaoSupervisaoEscolar: "Não",
            informacoesComplementaresSupervisaoEscolar: "",
            interlocucaoNAAPA: "Sim",
            informacoesComplementaresNAAPA: "Apenas NAAPA",
        });
    });

    it("deve retornar campos de info complementar vazios quando não preenchidos", () => {
        const ocorrenciaDre: OcorrenciaDreResponse = {
            id: 1,
            uuid: "test-uuid",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "DRE-001",
            status: "em_preenchimento_dre",
            status_display: "Em preenchimento DRE",
            status_extra: "",
            acionamento_seguranca_publica: true,
            interlocucao_sts: true,
            info_complementar_sts: "",
            interlocucao_cpca: true,
            info_complementar_cpca: "",
            interlocucao_supervisao_escolar: true,
            info_complementar_supervisao_escolar: "",
            interlocucao_naapa: true,
            info_complementar_naapa: "",
        };

        const result = transformOcorrenciaDreToFormData(ocorrenciaDre);

        expect(result.informacoesComplementaresSTS).toBe("");
        expect(result.informacoesComplementaresCPCA).toBe("");
        expect(result.informacoesComplementaresSupervisaoEscolar).toBe("");
        expect(result.informacoesComplementaresNAAPA).toBe("");
    });
});
