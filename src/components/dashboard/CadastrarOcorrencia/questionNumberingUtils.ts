/**
 * Utilitários para numeração sequencial de perguntas nos fluxos de ocorrência.
 *
 * Fluxo Patrimonial:
 *   Q1-4   → SecaoInicial
 *   Q5-7   → SecaoFurtoERoubo
 *   Q8-9   → SecaoFinal
 *   Q10-11 → Anexos
 *
 * Fluxo Interpessoal sem agressor/vítima:
 *   Q1-4   → SecaoInicial
 *   Q5-8   → SecaoNaoFurtoERoubo
 *   Q9-11  → SecaoFinal
 *   Q12-13 → Anexos
 *
 * Fluxo Interpessoal com N pessoas:
 *   Q1-4                                         → SecaoInicial
 *   Q5-8                                         → SecaoNaoFurtoERoubo
 *   Q9 … Q(9 + N*9 - 1)                          → Envolvidos (9 campos × N pessoas)
 *   Q(9 + N*9) … Q(9 + N*9 + 3)                 → InformacoesAdicionais fixas
 *   Q(9 + N*9 + 4) … Q(9 + N*9 + 6)             → SecaoFinal
 *   Q(9 + N*9 + 7) … Q(9 + N*9 + 8)             → Anexos
 */

export const SECAO_INICIAL_COUNT = 4;
export const SECAO_FURTO_COUNT = 3;
export const SECAO_NAO_FURTO_COUNT = 4;
export const FIELDS_PER_PERSON = 9;
export const INFO_ADICIONAL_FIXED_COUNT = 4;
export const SECAO_FINAL_PATRIMONIAL_COUNT = 2;
export const SECAO_FINAL_INTERPESSOAL_COUNT = 3;
export const ANEXOS_COUNT = 2;
export const DRE_QUESTION_COUNT = 2;
export const GIPE_QUESTION_COUNT = 4;

const SECAO_INICIAL_START = 1;
const STEP2_START = SECAO_INICIAL_START + SECAO_INICIAL_COUNT; // 5

export type QuestionNumbers = {
    secaoInicial: number;
    step2: number;
    informacoesAdicionais: number | undefined;
    secaoFinal: number;
    anexos: number;
};

/**
 * Calcula o número inicial de cada seção conforme o fluxo ativo.
 *
 * @param isFurtoRoubo         - true = fluxo patrimonial
 * @param hasAgressorVitimaInfo - true = exibe InformacoesAdicionais
 * @param personCount          - quantidade de pessoas em InformacoesAdicionais
 */
export function computeStartingNumbers(
    isFurtoRoubo: boolean,
    hasAgressorVitimaInfo: boolean,
    personCount: number,
): QuestionNumbers {
    const secaoInicial = SECAO_INICIAL_START;
    const step2 = STEP2_START;

    if (isFurtoRoubo) {
        const secaoFinal = step2 + SECAO_FURTO_COUNT;
        return {
            secaoInicial,
            step2,
            informacoesAdicionais: undefined,
            secaoFinal,
            anexos: secaoFinal + SECAO_FINAL_PATRIMONIAL_COUNT,
        };
    }

    if (!hasAgressorVitimaInfo) {
        const secaoFinal = step2 + SECAO_NAO_FURTO_COUNT;
        return {
            secaoInicial,
            step2,
            informacoesAdicionais: undefined,
            secaoFinal,
            anexos: secaoFinal + SECAO_FINAL_INTERPESSOAL_COUNT,
        };
    }

    const informacoesAdicionaisStart = step2 + SECAO_NAO_FURTO_COUNT;
    const secaoFinal =
        informacoesAdicionaisStart +
        personCount * FIELDS_PER_PERSON +
        INFO_ADICIONAL_FIXED_COUNT;

    return {
        secaoInicial,
        step2,
        informacoesAdicionais: informacoesAdicionaisStart,
        secaoFinal,
        anexos: secaoFinal + SECAO_FINAL_INTERPESSOAL_COUNT,
    };
}

/**
 * Gera um prefixo de número de pergunta.
 * Retorna string vazia quando startingNumber é undefined (numeração desligada).
 */
export function questionPrefix(
    startingNumber: number | undefined,
    offset: number,
): string {
    if (startingNumber == null) return "";
    return `${startingNumber + offset}. `;
}
