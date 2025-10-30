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
    arrayFields: (keyof T)[] = []
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
            const arr1 = currentValue as string[];
            const arr2 = (referenceValue as string[]) || [];

            if (compareArrays(arr1, arr2)) {
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
