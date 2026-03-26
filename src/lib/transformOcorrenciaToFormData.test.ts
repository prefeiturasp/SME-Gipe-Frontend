import { OcorrenciaDetalheAPI } from "@/actions/obter-ocorrencia";
import { describe, expect, it } from "vitest";
import { transformOcorrenciaToFormData } from "./transformOcorrenciaToFormData";

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

    it("deve incluir descricaoTipoOcorrencia quando tipos_ocorrencia_outros estiver presente", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            tipos_ocorrencia_outros: "Tipo livre de ocorrência",
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.descricaoTipoOcorrencia).toBe("Tipo livre de ocorrência");
    });

    it("deve incluir descricaoEnvolvidos quando envolvido_outros estiver presente", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            envolvido_outros: "Responsável pelo aluno",
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.descricaoEnvolvidos).toBe("Responsável pelo aluno");
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
            smart_sampa_situacao: "sim",
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.smartSampa).toBe("Sim");
    });

    it("não deve incluir smartSampa quando valor é inválido", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            smart_sampa_situacao: "valor_invalido" as never,
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.smartSampa).toBeUndefined();
    });

    it("deve validar e incluir smartSampa como 'Não' quando valor é 'nao'", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            smart_sampa_situacao: "nao",
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.smartSampa).toBe("Não");
    });

    it("deve incluir status quando presente", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            status: "em_preenchimento_diretor",
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.status).toBe("em_preenchimento_diretor");
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
            { input: "sim" as const, expected: "Sim" },
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
            envolvido: [
                {
                    uuid: "envolvido-uuid",
                    perfil_dos_envolvidos: "Apenas um estudante",
                },
            ],
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.envolvidos).toEqual(["envolvido-uuid"]);
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
            smart_sampa_situacao: "sim",
            declarante_detalhes: {
                uuid: "declarante-uuid",
                declarante: "João Silva",
            },
            comunicacao_seguranca_publica: "sim",
            protocolo_acionado: "ameaca",
            envolvido: [
                {
                    uuid: "envolvido-uuid",
                    perfil_dos_envolvidos: "Apenas um estudante",
                },
            ],
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
            smartSampa: "Sim",
            declarante: "declarante-uuid",
            comunicacaoSeguranca: "Sim",
            protocoloAcionado: "Ameaça",
            envolvidos: ["envolvido-uuid"],
            possuiInfoAgressorVitima: "Sim",
        });
    });

    it("deve definir horaOcorrencia como '00:00' quando fora_horario_funcionamento_ue é true", () => {
        const ocorrencia: OcorrenciaDetalheAPI = {
            ...baseOcorrencia,
            fora_horario_funcionamento_ue: true,
        };

        const result = transformOcorrenciaToFormData(ocorrencia);

        expect(result.horaOcorrencia).toBe("00:00");
        expect(result.foraHorarioFuncionamento).toBe(true);
    });

    describe("Informações Adicionais - Dados Pessoais do Agressor", () => {
        it("deve incluir pessoas agressoras com todos os campos quando presente", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                pessoas_agressoras: [
                    {
                        nome: "João Silva",
                        idade: 25,
                        genero: "masculino",
                        grupo_etnico_racial: "branco",
                        etapa_escolar: "ensino_fundamental_2",
                        frequencia_escolar: "regular",
                        interacao_ambiente_escolar: "Boa interação",
                    },
                ],
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.pessoasAgressoras).toEqual([
                {
                    nome: "João Silva",
                    idade: "25",
                    genero: "masculino",
                    grupoEtnicoRacial: "branco",
                    etapaEscolar: "ensino_fundamental_2",
                    frequenciaEscolar: "regular",
                    interacaoAmbienteEscolar: "Boa interação",
                },
            ]);
        });

        it("deve converter idade das pessoas agressoras para string", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                pessoas_agressoras: [
                    {
                        nome: "Maria Santos",
                        idade: 35,
                        genero: "feminino",
                        grupo_etnico_racial: "pardo",
                        etapa_escolar: "ensino_medio",
                        frequencia_escolar: "regular",
                        interacao_ambiente_escolar: "Boa interação",
                    },
                ],
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.pessoasAgressoras?.[0].idade).toBe("35");
        });

        it("deve preencher campos vazios quando campos opcionais não estão presentes", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                pessoas_agressoras: [
                    {
                        nome: "João",
                        idade: 20,
                        genero: "",
                        grupo_etnico_racial: "",
                        etapa_escolar: "",
                        frequencia_escolar: "",
                        interacao_ambiente_escolar: "",
                    },
                ],
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.pessoasAgressoras?.[0].genero).toBe("");
            expect(result.pessoasAgressoras?.[0].grupoEtnicoRacial).toBe("");
        });
    });

    describe("Informações Adicionais - Dados Escolares e Acompanhamento", () => {
        it("deve extrair valores de motivacao_ocorrencia_display corretamente", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                motivacao_ocorrencia_display: [
                    { value: "homofobia", label: "Homofobia" },
                    { value: "racismo", label: "Racismo" },
                ],
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.motivoOcorrencia).toEqual(["homofobia", "racismo"]);
        });

        it("deve incluir descricaoMotivoOcorrencia quando motivacao_ocorrencia_outros estiver presente", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                motivacao_ocorrencia_outros: "Motivação livre",
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.descricaoMotivoOcorrencia).toBe("Motivação livre");
        });

        it("deve incluir redes de proteção quando presente", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                redes_protecao_acompanhamento: "CRAS, NAAPA",
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.redesProtecao).toBe("CRAS, NAAPA");
        });

        it("deve converter notificado_conselho_tutelar para 'Sim' quando true", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                notificado_conselho_tutelar: true,
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.notificadoConselhoTutelar).toBe("Sim");
        });

        it("deve converter notificado_conselho_tutelar para 'Não' quando false", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                notificado_conselho_tutelar: false,
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.notificadoConselhoTutelar).toBe("Não");
        });

        it("deve converter acompanhado_naapa para 'Sim' quando true", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                acompanhado_naapa: true,
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.acompanhadoNAAPA).toBe("Sim");
        });

        it("deve converter acompanhado_naapa para 'Não' quando false", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                acompanhado_naapa: false,
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.acompanhadoNAAPA).toBe("Não");
        });

        it("não deve incluir notificadoConselhoTutelar quando undefined", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                notificado_conselho_tutelar: undefined,
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.notificadoConselhoTutelar).toBeUndefined();
        });

        it("não deve incluir acompanhadoNAAPA quando undefined", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                acompanhado_naapa: undefined,
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result.acompanhadoNAAPA).toBeUndefined();
        });
    });

    describe("Informações Adicionais - Cenário Completo", () => {
        it("deve transformar todos os campos de informações adicionais quando todos estão presentes", () => {
            const ocorrencia: OcorrenciaDetalheAPI = {
                ...baseOcorrencia,
                pessoas_agressoras: [
                    {
                        nome: "Kleber Machado",
                        idade: 35,
                        genero: "mulher_cis",
                        grupo_etnico_racial: "indigena",
                        etapa_escolar: "ensino_medio",
                        frequencia_escolar: "transferido_estadual",
                        interacao_ambiente_escolar:
                            "Como é a interação da pessoa agressora no ambiente escolar?",
                    },
                ],
                motivacao_ocorrencia_display: [
                    { value: "homofobia", label: "Homofobia" },
                    { value: "racismo", label: "Racismo" },
                ],
                redes_protecao_acompanhamento: "CRAS, NAAPA",
                notificado_conselho_tutelar: true,
                acompanhado_naapa: false,
            };

            const result = transformOcorrenciaToFormData(ocorrencia);

            expect(result).toMatchObject({
                pessoasAgressoras: [
                    {
                        nome: "Kleber Machado",
                        idade: "35",
                        genero: "mulher_cis",
                        grupoEtnicoRacial: "indigena",
                        etapaEscolar: "ensino_medio",
                        frequenciaEscolar: "transferido_estadual",
                        interacaoAmbienteEscolar:
                            "Como é a interação da pessoa agressora no ambiente escolar?",
                    },
                ],
                motivoOcorrencia: ["homofobia", "racismo"],
                redesProtecao: "CRAS, NAAPA",
                notificadoConselhoTutelar: "Sim",
                acompanhadoNAAPA: "Não",
            });
        });
    });
});
