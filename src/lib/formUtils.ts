/**
 * Compara dois arrays de strings para verificar se são diferentes,
 * ignorando a ordem dos elementos.
 */
export const compareArrays = (arr1: string[], arr2: string[] = []): boolean => {
    if (arr1.length !== arr2.length) return true;

    const sorted1 = [...arr1].sort((a, b) => a.localeCompare(b));
    const sorted2 = [...arr2].sort((a, b) => a.localeCompare(b));

    return JSON.stringify(sorted1) !== JSON.stringify(sorted2);
};

/**
 * Compara dois arrays de objetos para verificar se são diferentes.
 * A comparação é feita por deep equality (JSON.stringify), respeitando a ordem.
 */
export const compareObjectArrays = (
    arr1: Record<string, unknown>[],
    arr2: Record<string, unknown>[] = [],
): boolean => {
    if (arr1.length !== arr2.length) return true;

    return JSON.stringify(arr1) !== JSON.stringify(arr2);
};

/**
 * Verifica se um campo do tipo array teve mudanças.
 * Detecta automaticamente se é um array de objetos ou de strings.
 */
const hasArrayFieldChanged = (
    currentValue: unknown,
    referenceValue: unknown,
): boolean => {
    const currentArr = currentValue as unknown[];
    const referenceArr = (referenceValue as unknown[]) || [];

    const isObjectArray =
        currentArr.length > 0 &&
        typeof currentArr[0] === "object" &&
        currentArr[0] !== null;

    if (isObjectArray) {
        return compareObjectArrays(
            currentArr as Record<string, unknown>[],
            referenceArr as Record<string, unknown>[],
        );
    }

    return compareArrays(currentArr as string[], referenceArr as string[]);
};

/**
 * Verifica se houve mudanças entre os dados atuais e os dados de referência.
 * Suporta comparação de valores primitivos e arrays.
 *
 * @param currentData - Dados atuais do formulário
 * @param referenceData - Dados de referência (salvos ou iniciais)
 * @param arrayFields - Lista de campos que são arrays e precisam de comparação especial
 * @returns `true` se houver mudanças, `false` caso contrário
 *
 * @example
 * ```typescript
 * const changed = hasFormDataChanged(
 *   { nome: "João", tags: ["a", "b"] },
 *   { nome: "Maria", tags: ["b", "a"] },
 *   ["tags"]
 * );
 * // retorna true (nome mudou, tags não)
 * ```
 */
export const hasFormDataChanged = <T extends Record<string, unknown>>(
    currentData: T,
    referenceData: Partial<T> | undefined,
    arrayFields: (keyof T)[] = [],
): boolean => {
    // Se não houver dados de referência, considera como mudança
    if (!referenceData || Object.keys(referenceData).length === 0) {
        return true;
    }

    // Verifica cada campo do formulário atual
    for (const key in currentData) {
        const currentValue = currentData[key];
        const referenceValue = referenceData[key];

        // Se o campo é um array, usa comparação especial
        if (arrayFields.includes(key)) {
            if (hasArrayFieldChanged(currentValue, referenceValue)) {
                return true;
            }
            continue;
        }

        // Comparação padrão para valores primitivos
        // Trata undefined/null/"" como equivalentes para strings
        const normalizedCurrent = currentValue ?? "";
        const normalizedReference = referenceValue ?? "";

        if (normalizedCurrent !== normalizedReference) {
            return true;
        }
    }

    return false;
};

/**
 * Filtra os UUIDs de tiposOcorrencia selecionados mantendo apenas
 * aqueles que existem na lista de tipos disponíveis retornada pela API.
 * Evita que UUIDs de um tipo de formulário (ex: PATRIMONIAL) sejam
 * enviados quando o formulário ativo é de outro tipo (ex: GERAL).
 *
 * @param selectedIds - UUIDs atualmente selecionados no formulário
 * @param availableTypes - Lista de tipos retornados pela API para o tipo de formulário ativo
 * @returns Array filtrado contendo apenas UUIDs válidos
 */
export const filterValidTiposOcorrencia = (
    selectedIds: string[],
    availableTypes: { uuid: string }[] | undefined,
): string[] => {
    if (!availableTypes || availableTypes.length === 0) return selectedIds;
    const validUuids = new Set(availableTypes.map((t) => t.uuid));
    return selectedIds.filter((id) => validUuids.has(id));
};
