import { OcorrenciaGipeResponse } from "@/types/ocorrencia-gipe";
import { describe, expect, it } from "vitest";
import { transformOcorrenciaGipeToFormData } from "./transformOcorrenciaGipeToFormData";

describe("transformOcorrenciaGipeToFormData", () => {
    it("deve transformar dados completos da ocorrência GIPE corretamente", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "presencialmente",
            envolvido: ["env-uuid-123"],
            motivacao_ocorrencia: ["bullying", "racismo"],
            tipos_ocorrencia: ["tipo-uuid-1"],
            tipos_ocorrencia_detalhes: [
                {
                    uuid: "tipo-uuid-1",
                    nome: "Tipo A",
                },
            ],
            etapa_escolar: "alfabetizacao",
            info_sobre_interacoes_virtuais_pessoa_agressora:
                "Informações sobre interações virtuais",
            encaminhamentos_gipe: "Encaminhamentos realizados",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result).toEqual({
            envolveArmaOuAtaque: "sim",
            ameacaRealizada: "presencialmente",
            etapaEscolar: "alfabetizacao",
            informacoesInteracoesVirtuais:
                "Informações sobre interações virtuais",
            encaminhamentos: "Encaminhamentos realizados",
        });
    });

    it("deve retornar undefined para campos vazios de envolveArmaOuAtaque", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "",
            ameaca_realizada_qual_maneira: "presencialmente",
            envolvido: ["env-uuid-123"],
            motivacao_ocorrencia: ["bullying"],
            tipos_ocorrencia: ["tipo-uuid-1"],
            tipos_ocorrencia_detalhes: [
                {
                    uuid: "tipo-uuid-1",
                    nome: "Tipo A",
                },
            ],
            etapa_escolar: "alfabetizacao",
            info_sobre_interacoes_virtuais_pessoa_agressora: "",
            encaminhamentos_gipe: "Encaminhamentos",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result.envolveArmaOuAtaque).toBeUndefined();
    });

    it("deve retornar undefined para campos vazios de ameacaRealizada", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "",
            envolvido: ["env-uuid-123"],
            motivacao_ocorrencia: ["bullying"],
            tipos_ocorrencia: ["tipo-uuid-1"],
            tipos_ocorrencia_detalhes: [
                {
                    uuid: "tipo-uuid-1",
                    nome: "Tipo A",
                },
            ],
            etapa_escolar: "alfabetizacao",
            info_sobre_interacoes_virtuais_pessoa_agressora: "",
            encaminhamentos_gipe: "Encaminhamentos",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result.ameacaRealizada).toBeUndefined();
    });

    it("deve retornar string vazia para campos opcionais vazios", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "presencialmente",
            envolvido: ["env-uuid-123"],
            motivacao_ocorrencia: ["bullying"],
            tipos_ocorrencia: ["tipo-uuid-1"],
            tipos_ocorrencia_detalhes: [
                {
                    uuid: "tipo-uuid-1",
                    nome: "Tipo A",
                },
            ],
            etapa_escolar: "",
            info_sobre_interacoes_virtuais_pessoa_agressora: "",
            encaminhamentos_gipe: "",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result.etapaEscolar).toBe("");
        expect(result.informacoesInteracoesVirtuais).toBe("");
        expect(result.encaminhamentos).toBe("");
    });

    it("deve transformar corretamente com valores mínimos", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "",
            ameaca_realizada_qual_maneira: "",
            envolvido: [],
            motivacao_ocorrencia: [],
            tipos_ocorrencia: [],
            tipos_ocorrencia_detalhes: [],
            etapa_escolar: "",
            info_sobre_interacoes_virtuais_pessoa_agressora: "",
            encaminhamentos_gipe: "",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result).toEqual({
            envolveArmaOuAtaque: undefined,
            ameacaRealizada: undefined,
            etapaEscolar: "",
            informacoesInteracoesVirtuais: "",
            encaminhamentos: "",
        });
    });

    it("deve incluir descricaoEnvolvidos quando envolvido_outros está presente", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "",
            ameaca_realizada_qual_maneira: "",
            envolvido: [],
            motivacao_ocorrencia: [],
            tipos_ocorrencia: [],
            tipos_ocorrencia_detalhes: [],
            etapa_escolar: "",
            info_sobre_interacoes_virtuais_pessoa_agressora: "",
            encaminhamentos_gipe: "",
            envolvido_outros: "Descrição dos envolvidos",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result.descricaoEnvolvidos).toBe("Descrição dos envolvidos");
    });

    it("deve incluir descricaoMotivoOcorrencia quando motivacao_ocorrencia_outros está presente", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "",
            ameaca_realizada_qual_maneira: "",
            envolvido: [],
            motivacao_ocorrencia: [],
            tipos_ocorrencia: [],
            tipos_ocorrencia_detalhes: [],
            etapa_escolar: "",
            info_sobre_interacoes_virtuais_pessoa_agressora: "",
            encaminhamentos_gipe: "",
            motivacao_ocorrencia_outros: "Motivação detalhada",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result.descricaoMotivoOcorrencia).toBe("Motivação detalhada");
    });

    it("deve incluir descricaoTipoOcorrencia quando tipos_ocorrencia_outros está presente", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "",
            ameaca_realizada_qual_maneira: "",
            envolvido: [],
            motivacao_ocorrencia: [],
            tipos_ocorrencia: [],
            tipos_ocorrencia_detalhes: [],
            etapa_escolar: "",
            info_sobre_interacoes_virtuais_pessoa_agressora: "",
            encaminhamentos_gipe: "",
            tipos_ocorrencia_outros: "Tipo personalizado",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result.descricaoTipoOcorrencia).toBe("Tipo personalizado");
    });

    it("deve omitir campos _outros quando ausentes no dado de entrada", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "",
            ameaca_realizada_qual_maneira: "",
            envolvido: [],
            motivacao_ocorrencia: [],
            tipos_ocorrencia: [],
            tipos_ocorrencia_detalhes: [],
            etapa_escolar: "",
            info_sobre_interacoes_virtuais_pessoa_agressora: "",
            encaminhamentos_gipe: "",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result).not.toHaveProperty("descricaoEnvolvidos");
        expect(result).not.toHaveProperty("descricaoMotivoOcorrencia");
        expect(result).not.toHaveProperty("descricaoTipoOcorrencia");
    });

    it("deve incluir todos os campos _outros quando todos estão presentes", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "presencialmente",
            envolvido: [],
            motivacao_ocorrencia: [],
            tipos_ocorrencia: [],
            tipos_ocorrencia_detalhes: [],
            etapa_escolar: "fundamental_1",
            info_sobre_interacoes_virtuais_pessoa_agressora: "",
            encaminhamentos_gipe: "",
            envolvido_outros: "Outros envolvidos",
            motivacao_ocorrencia_outros: "Outra motivação",
            tipos_ocorrencia_outros: "Outro tipo",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result.descricaoEnvolvidos).toBe("Outros envolvidos");
        expect(result.descricaoMotivoOcorrencia).toBe("Outra motivação");
        expect(result.descricaoTipoOcorrencia).toBe("Outro tipo");
    });
});
