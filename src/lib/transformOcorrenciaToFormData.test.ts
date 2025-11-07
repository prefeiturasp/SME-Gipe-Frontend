import { describe, it, expect } from "vitest";
import { transformOcorrenciaToFormData } from "./transformOcorrenciaToFormData";
import { OcorrenciaDetalheAPI } from "@/actions/obter-ocorrencia";

describe("transformOcorrenciaToFormData", () => {
    const baseOcorrencia: OcorrenciaDetalheAPI = {
        id: 1,
        uuid: "ocorrencia-uuid-123",
        data_ocorrencia: "2024-03-15T14:30:00Z",
        unidade_codigo_eol: "123456",
        dre_codigo_eol: "DRE-001",
        sobre_furto_roubo_invasao_depredacao: false,
        user_username: "user@test.com",
        criado_em: "2024-03-15T14:00:00Z",
        atualizado_em: "2024-03-15T14:00:00Z",
    };

    it("deve transformar dados básicos corretamente", () => {
        const result = transformOcorrenciaToFormData(baseOcorrencia);

        expect(result).toMatchObject({
            dre: "DRE-001",
            unidadeEducacional: "123456",
            tipoOcorrencia: "Não",
        });
        expect(result.dataOcorrencia).toBeTruthy();
        expect(result.horaOcorrencia).toBeTruthy();
    });

    it("deve extrair data e hora corretamente", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            data_ocorrencia: "2024-03-15T14:30:00Z",
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.dataOcorrencia).toMatch(/\d{4}-\d{2}-\d{2}/);
        expect(result.horaOcorrencia).toMatch(/\d{2}:\d{2}/);
    });

    it("deve retornar strings vazias quando data_ocorrencia não existe", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            data_ocorrencia: "",
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.dataOcorrencia).toBe("");
        expect(result.horaOcorrencia).toBe("");
    });

    it("deve definir tipoOcorrencia como 'Sim' quando sobre_furto_roubo_invasao_depredacao é true", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            sobre_furto_roubo_invasao_depredacao: true,
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.tipoOcorrencia).toBe("Sim");
    });

    it("deve incluir nomeDre e nomeUnidade quando presentes", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            nome_dre: "DRE Centro",
            nome_unidade: "EMEF Teste",
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.nomeDre).toBe("DRE Centro");
        expect(result.nomeUnidade).toBe("EMEF Teste");
    });

    it("deve incluir tipos de ocorrência quando presentes", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            tipos_ocorrencia: [
                { uuid: "tipo-1", nome: "Violência física" },
                { uuid: "tipo-2", nome: "Bullying" },
            ],
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.tiposOcorrencia).toEqual(["tipo-1", "tipo-2"]);
    });

    it("deve incluir descrição quando presente", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            descricao_ocorrencia: "Descrição detalhada da ocorrência",
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.descricao).toBe("Descrição detalhada da ocorrência");
    });

    it("deve validar e incluir smartSampa quando valor é válido", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            smart_sampa_situacao: "sim_com_dano",
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.smartSampa).toBe("sim_com_dano");
    });

    it("não deve incluir smartSampa quando valor é inválido", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            smart_sampa_situacao: "valor_invalido" as never,
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.smartSampa).toBeUndefined();
    });

    it("deve incluir declarante quando presente", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            declarante_detalhes: {
                uuid: "declarante-uuid",
                declarante: "João Silva",
            },
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.declarante).toBe("declarante-uuid");
    });

    it("deve converter comunicacao_seguranca_publica corretamente", () => {
        const testCases = [
            { input: "sim_gcm" as const, expected: "Sim, com a GCM" },
            { input: "sim_pm" as const, expected: "Sim, com a PM" },
            { input: "nao" as const, expected: "Não" },
        ];

        for (const { input, expected } of testCases) {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                comunicacao_seguranca_publica: input,
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.comunicacaoSeguranca).toBe(expected);
        }
    });

    it("deve converter protocolo_acionado corretamente", () => {
        const testCases = [
            { input: "ameaca" as const, expected: "Ameaça" },
            { input: "alerta" as const, expected: "Alerta" },
            {
                input: "registro" as const,
                expected: "Apenas para registro/não se aplica",
            },
        ];

        for (const { input, expected } of testCases) {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                protocolo_acionado: input,
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.protocoloAcionado).toBe(expected);
        }
    });

    it("deve incluir envolvidos quando presente", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            envolvido: {
                uuid: "envolvido-uuid",
                perfil_dos_envolvidos: "Apenas um estudante",
            },
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.envolvidos).toBe("envolvido-uuid");
    });

    it("deve converter tem_info_agressor_ou_vitima corretamente", () => {
        const testCases = [
            { input: "sim" as const, expected: "Sim" },
            { input: "nao" as const, expected: "Não" },
        ];

        for (const { input, expected } of testCases) {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                tem_info_agressor_ou_vitima: input,
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.possuiInfoAgressorVitima).toBe(expected);
        }
    });

    it("deve transformar todos os campos quando todos estão presentes", () => {
        const ocorrenciaCompleta: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            nome_dre: "DRE Centro",
            nome_unidade: "EMEF Teste",
            tipos_ocorrencia: [{ uuid: "tipo-1", nome: "Violência física" }],
            descricao_ocorrencia: "Descrição da ocorrência",
            smart_sampa_situacao: "sim_com_dano",
            declarante_detalhes: {
                uuid: "declarante-uuid",
                declarante: "João Silva",
            },
            comunicacao_seguranca_publica: "sim_gcm",
            protocolo_acionado: "ameaca",
            envolvido: {
                uuid: "envolvido-uuid",
                perfil_dos_envolvidos: "Apenas um estudante",
            },
            tem_info_agressor_ou_vitima: "sim",
        };

        const result = transformOcorrenciaToFormData(ocorrenciaCompleta);

        expect(result).toMatchObject({
            dre: "DRE-001",
            unidadeEducacional: "123456",
            tipoOcorrencia: "Não",
            nomeDre: "DRE Centro",
            nomeUnidade: "EMEF Teste",
            tiposOcorrencia: ["tipo-1"],
            descricao: "Descrição da ocorrência",
            smartSampa: "sim_com_dano",
            declarante: "declarante-uuid",
            comunicacaoSeguranca: "Sim, com a GCM",
            protocoloAcionado: "Ameaça",
            envolvidos: "envolvido-uuid",
            possuiInfoAgressorVitima: "Sim",
        });
    });
});
