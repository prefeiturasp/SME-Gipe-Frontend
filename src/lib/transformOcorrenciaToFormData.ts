import { OcorrenciaDetalheAPI } from "@/actions/obter-ocorrencia";

type SimNao = "Sim" | "Não";

/**
 * Extrai data e hora da ocorrência no formato esperado pelos formulários
 */
function extractDateAndTime(dataOcorrencia: string) {
    const dataHora = new Date(dataOcorrencia);
    const year = dataHora.getFullYear();
    const month = String(dataHora.getMonth() + 1).padStart(2, "0");
    const day = String(dataHora.getDate()).padStart(2, "0");
    const hours = String(dataHora.getHours()).padStart(2, "0");
    const minutes = String(dataHora.getMinutes()).padStart(2, "0");

    return {
        dataOcorrencia: `${year}-${month}-${day}`,
        horaOcorrencia: `${hours}:${minutes}`,
    };
}

/**
 * Valida e retorna o valor de smartSampa convertido para formato do formulário
 */
function getValidSmartSampa(rawSmartSampa?: string): SimNao | undefined {
    if (!rawSmartSampa) return undefined;
    if (rawSmartSampa === "sim") return "Sim";
    if (rawSmartSampa === "nao") return "Não";
    return undefined;
}

/**
 * Converte valor de comunicação com segurança pública para formato do formulário
 */
function getComunicacaoSeguranca(
    comunicacao?: "sim_gcm" | "sim_pm" | "sim_dc" | "sim_cbm" | "nao",
): string | undefined {
    if (!comunicacao) return undefined;
    if (comunicacao === "nao") return "Não";
    return "Sim";
}

/**
 * Converte valor de protocolo acionado para formato do formulário
 */
function getProtocoloAcionado(
    protocolo?: "ameaca" | "alerta" | "registro",
): string | undefined {
    const protocoloMap: Record<string, string> = {
        ameaca: "Ameaça",
        alerta: "Alerta",
        registro: "Apenas para registro/não se aplica",
    };

    return protocolo ? protocoloMap[protocolo] : undefined;
}

/**
 * Converte valor de informação sobre agressor/vítima para formato do formulário
 */
function getPossuiInfoAgressorVitima(
    temInfo?: "sim" | "nao",
): SimNao | undefined {
    if (!temInfo) return undefined;
    return temInfo === "sim" ? "Sim" : "Não";
}

/**
 * Converte valor booleano para formato do formulário ("Sim" | "Não")
 */
function getBooleanAsSimNao(value?: boolean): SimNao | undefined {
    if (value === undefined) return undefined;
    return value ? "Sim" : "Não";
}

/**
 * Extrai dados pessoais do agressor
 */
function extractDadosPessoaisAgressor(ocorrencia: OcorrenciaDetalheAPI) {
    return {
        ...(ocorrencia.pessoas_agressoras?.length && {
            pessoasAgressoras: ocorrencia.pessoas_agressoras.map((pessoa) => ({
                nome: pessoa.nome,
                idade: String(pessoa.idade),
                genero: pessoa.genero || "",
                grupoEtnicoRacial: pessoa.grupo_etnico_racial || "",
                etapaEscolar: pessoa.etapa_escolar || "",
                frequenciaEscolar: pessoa.frequencia_escolar || "",
                interacaoAmbienteEscolar:
                    pessoa.interacao_ambiente_escolar || "",
            })),
        }),
    };
}

/**
 * Extrai dados escolares e acompanhamento do agressor
 */
function extractDadosEscolaresAgressor(ocorrencia: OcorrenciaDetalheAPI) {
    const notificadoConselhoTutelar = getBooleanAsSimNao(
        ocorrencia.notificado_conselho_tutelar,
    );
    const acompanhadoNAAPA = getBooleanAsSimNao(ocorrencia.acompanhado_naapa);
    const motivoOcorrencia = ocorrencia.motivacao_ocorrencia_display?.map(
        (item) => item.value,
    );

    return {
        ...(motivoOcorrencia && {
            motivoOcorrencia,
        }),
        ...(ocorrencia.motivacao_ocorrencia_outros && {
            descricaoMotivoOcorrencia: ocorrencia.motivacao_ocorrencia_outros,
        }),
        ...(ocorrencia.redes_protecao_acompanhamento && {
            redesProtecao: ocorrencia.redes_protecao_acompanhamento,
        }),
        ...(notificadoConselhoTutelar && { notificadoConselhoTutelar }),
        ...(acompanhadoNAAPA && { acompanhadoNAAPA }),
    };
}

/**
 * Extrai campos de informações adicionais da API
 */
function extractInfoAdicionais(ocorrencia: OcorrenciaDetalheAPI) {
    return {
        ...extractDadosPessoaisAgressor(ocorrencia),
        ...extractDadosEscolaresAgressor(ocorrencia),
    };
}

/**
 * Retorna o horário a ser exibido no formulário considerando se a ocorrência
 * foi registrada fora do horário de funcionamento da UE.
 * Nesse caso, o horário padrão "00:00" é utilizado.
 */
function resolveHoraOcorrencia(
    horaExtracted: string,
    foraHorario?: boolean,
): string {
    if (foraHorario) return "00:00";
    return horaExtracted;
}

/**
 * Transforma dados da API de ocorrência para o formato esperado pelo formulário
 */
export function transformOcorrenciaToFormData(
    ocorrencia: OcorrenciaDetalheAPI,
) {
    const { dataOcorrencia, horaOcorrencia } = ocorrencia.data_ocorrencia
        ? extractDateAndTime(ocorrencia.data_ocorrencia)
        : { dataOcorrencia: "", horaOcorrencia: "" };

    const tipoOcorrencia = ocorrencia.sobre_furto_roubo_invasao_depredacao
        ? ("Sim" as const)
        : ("Não" as const);

    const smartSampa = getValidSmartSampa(ocorrencia.smart_sampa_situacao);
    const tiposOcorrencia = ocorrencia.tipos_ocorrencia?.map(
        (tipo) => tipo.uuid,
    );
    const comunicacaoSeguranca = getComunicacaoSeguranca(
        ocorrencia.comunicacao_seguranca_publica,
    );
    const protocoloAcionado = getProtocoloAcionado(
        ocorrencia.protocolo_acionado,
    );
    const possuiInfoAgressorVitima = getPossuiInfoAgressorVitima(
        ocorrencia.tem_info_agressor_ou_vitima,
    );
    const infoAdicionais = extractInfoAdicionais(ocorrencia);

    return {
        dataOcorrencia,
        horaOcorrencia: resolveHoraOcorrencia(
            horaOcorrencia,
            ocorrencia.fora_horario_funcionamento_ue,
        ),
        dre: ocorrencia.dre_codigo_eol,
        unidadeEducacional: ocorrencia.unidade_codigo_eol,
        tipoOcorrencia,
        foraHorarioFuncionamento:
            ocorrencia.fora_horario_funcionamento_ue ?? false,
        ...(ocorrencia.status && { status: ocorrencia.status }),
        ...(ocorrencia.nome_dre && { nomeDre: ocorrencia.nome_dre }),
        ...(ocorrencia.nome_unidade && {
            nomeUnidade: ocorrencia.nome_unidade,
        }),
        ...(tiposOcorrencia && { tiposOcorrencia }),
        ...(ocorrencia.tipos_ocorrencia_outros && {
            descricaoTipoOcorrencia: ocorrencia.tipos_ocorrencia_outros,
        }),
        ...(ocorrencia.descricao_ocorrencia && {
            descricao: ocorrencia.descricao_ocorrencia,
        }),
        ...(smartSampa && { smartSampa }),
        ...(ocorrencia.declarante_detalhes?.uuid && {
            declarante: ocorrencia.declarante_detalhes.uuid,
        }),
        ...(comunicacaoSeguranca && { comunicacaoSeguranca }),
        ...(protocoloAcionado && { protocoloAcionado }),
        ...(ocorrencia.envolvido?.length && {
            envolvidos: ocorrencia.envolvido.map((env) => env.uuid),
        }),
        ...(ocorrencia.envolvido_outros && {
            descricaoEnvolvidos: ocorrencia.envolvido_outros,
        }),
        ...(possuiInfoAgressorVitima && { possuiInfoAgressorVitima }),
        ...infoAdicionais,
    };
}
