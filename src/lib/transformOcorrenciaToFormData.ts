import { OcorrenciaDetalheAPI } from "@/actions/obter-ocorrencia";

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
 * Valida e retorna o valor de smartSampa se for válido
 */
function getValidSmartSampa(rawSmartSampa?: string) {
    const validSmartSampaValues = [
        "sim_com_dano",
        "sim_sem_dano",
        "nao_faz_parte",
    ] as const;

    if (
        rawSmartSampa &&
        validSmartSampaValues.includes(
            rawSmartSampa as (typeof validSmartSampaValues)[number]
        )
    ) {
        return rawSmartSampa as (typeof validSmartSampaValues)[number];
    }
    return undefined;
}

/**
 * Converte valor de comunicação com segurança pública para formato do formulário
 */
function getComunicacaoSeguranca(
    comunicacao?: "sim_gcm" | "sim_pm" | "nao"
): string | undefined {
    const comunicacaoMap: Record<string, string> = {
        sim_gcm: "Sim, com a GCM",
        sim_pm: "Sim, com a PM",
        nao: "Não",
    };

    return comunicacao ? comunicacaoMap[comunicacao] : undefined;
}

/**
 * Converte valor de protocolo acionado para formato do formulário
 */
function getProtocoloAcionado(
    protocolo?: "ameaca" | "alerta" | "registro"
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
    temInfo?: "sim" | "nao"
): "Sim" | "Não" | undefined {
    if (!temInfo) return undefined;
    return temInfo === "sim" ? "Sim" : "Não";
}

/**
 * Transforma dados da API de ocorrência para o formato esperado pelo formulário
 */
export function transformOcorrenciaToFormData(
    ocorrencia: OcorrenciaDetalheAPI
) {
    const { dataOcorrencia, horaOcorrencia } = ocorrencia.data_ocorrencia
        ? extractDateAndTime(ocorrencia.data_ocorrencia)
        : { dataOcorrencia: "", horaOcorrencia: "" };

    const tipoOcorrencia = ocorrencia.sobre_furto_roubo_invasao_depredacao
        ? ("Sim" as const)
        : ("Não" as const);

    const smartSampa = getValidSmartSampa(ocorrencia.smart_sampa_situacao);
    const tiposOcorrencia = ocorrencia.tipos_ocorrencia?.map(
        (tipo) => tipo.uuid
    );
    const comunicacaoSeguranca = getComunicacaoSeguranca(
        ocorrencia.comunicacao_seguranca_publica
    );
    const protocoloAcionado = getProtocoloAcionado(
        ocorrencia.protocolo_acionado
    );
    const possuiInfoAgressorVitima = getPossuiInfoAgressorVitima(
        ocorrencia.tem_info_agressor_ou_vitima
    );

    return {
        dataOcorrencia,
        horaOcorrencia,
        dre: ocorrencia.dre_codigo_eol,
        unidadeEducacional: ocorrencia.unidade_codigo_eol,
        tipoOcorrencia,
        ...(ocorrencia.nome_dre && { nomeDre: ocorrencia.nome_dre }),
        ...(ocorrencia.nome_unidade && {
            nomeUnidade: ocorrencia.nome_unidade,
        }),
        ...(tiposOcorrencia && { tiposOcorrencia }),
        ...(ocorrencia.descricao_ocorrencia && {
            descricao: ocorrencia.descricao_ocorrencia,
        }),
        ...(smartSampa && { smartSampa }),
        ...(ocorrencia.declarante_detalhes?.uuid && {
            declarante: ocorrencia.declarante_detalhes.uuid,
        }),
        ...(comunicacaoSeguranca && { comunicacaoSeguranca }),
        ...(protocoloAcionado && { protocoloAcionado }),
        ...(ocorrencia.envolvido?.uuid && {
            envolvidos: ocorrencia.envolvido.uuid,
        }),
        ...(possuiInfoAgressorVitima && { possuiInfoAgressorVitima }),
    };
}
