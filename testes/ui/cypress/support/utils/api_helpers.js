/**
 * @fileoverview Helpers para testes de API - Funções utilitárias reutilizáveis
 * @module api_helpers
 * @author QA Team
 * @version 1.0.0
 */

/**
 * Valida se uma string é um UUID válido v4
 * @param {string} uuid - String para validar
 * @returns {boolean} - True se for UUID válido
 */
export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Valida formato de data brasileiro DD/MM/YYYY
 * @param {string} date - Data para validar
 * @returns {boolean} - True se for data válida
 */
export const isValidBrazilianDate = (date) => {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  return dateRegex.test(date);
};

/**
 * Valida formato de data ISO 8601
 * @param {string} date - Data para validar
 * @returns {boolean} - True se for data válida
 */
export const isValidISODate = (date) => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  return isoRegex.test(date) || /^\d{4}-\d{2}-\d{2}$/.test(date);
};

/**
 * Valida se um CPF está em formato válido (apenas formato, não validação matemática)
 * @param {string} cpf - CPF para validar
 * @returns {boolean} - True se formato válido
 */
export const isValidCPFFormat = (cpf) => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
  return cpfRegex.test(cpf);
};

/**
 * Remove caracteres especiais indesejados de strings
 * @param {string} str - String para limpar
 * @returns {string} - String limpa
 */
export const sanitizeString = (str) => {
  return str.replace(/[<>{}[\]\\]/g, '');
};

/**
 * Verifica se array tem elementos duplicados
 * @param {Array} arr - Array para verificar
 * @returns {boolean} - True se houver duplicados
 */
export const hasDuplicates = (arr) => {
  return new Set(arr).size !== arr.length;
};

/**
 * Extrai valores únicos de um campo específico em array de objetos
 * @param {Array} array - Array de objetos
 * @param {string} field - Nome do campo
 * @returns {Array} - Array com valores únicos
 */
export const getUniqueValues = (array, field) => {
  return [...new Set(array.map(item => item[field]))];
};

/**
 * Calcula estatísticas básicas de um array numérico
 * @param {Array<number>} numbers - Array de números
 * @returns {Object} - Objeto com min, max, avg
 */
export const calculateStats = (numbers) => {
  return {
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    avg: numbers.reduce((a, b) => a + b, 0) / numbers.length,
    count: numbers.length
  };
};

/**
 * Agrupa objetos por valor de campo específico
 * @param {Array} array - Array de objetos
 * @param {string} key - Campo para agrupar
 * @returns {Object} - Objeto agrupado
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Valida schema de objeto comparando com schema esperado
 * @param {Object} obj - Objeto para validar
 * @param {Object} schema - Schema esperado {field: 'type'}
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export const validateSchema = (obj, schema) => {
  const errors = [];
  
  Object.keys(schema).forEach(field => {
    if (!obj.hasOwnProperty(field)) {
      errors.push(`Campo obrigatório '${field}' não encontrado`);
    } else if (typeof obj[field] !== schema[field]) {
      errors.push(`Campo '${field}' deve ser ${schema[field]}, mas é ${typeof obj[field]}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Gera relatório de qualidade de dados
 * @param {Array} data - Array de objetos para analisar
 * @param {Array} requiredFields - Campos obrigatórios
 * @returns {Object} - Relatório de qualidade
 */
export const generateDataQualityReport = (data, requiredFields) => {
  const report = {
    totalRecords: data.length,
    completeness: {},
    duplicates: {},
    dataTypes: {}
  };
  
  requiredFields.forEach(field => {
    const values = data.map(item => item[field]);
    const nonEmpty = values.filter(v => v !== null && v !== undefined && v !== '');
    
    report.completeness[field] = {
      filled: nonEmpty.length,
      empty: data.length - nonEmpty.length,
      percentage: ((nonEmpty.length / data.length) * 100).toFixed(2) + '%'
    };
    
    report.duplicates[field] = {
      hasDuplicates: hasDuplicates(values),
      uniqueCount: new Set(values).size
    };
  });
  
  return report;
};

/**
 * Formata duração em milissegundos para formato legível
 * @param {number} ms - Milissegundos
 * @returns {string} - Duração formatada
 */
export const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}min`;
};

/**
 * Cria snapshot dos dados para comparação
 * @param {any} data - Dados para criar snapshot
 * @param {string} name - Nome do snapshot
 */
export const createSnapshot = (data, name) => {
  const snapshot = {
    name,
    timestamp: new Date().toISOString(),
    data: JSON.parse(JSON.stringify(data)),
    checksum: JSON.stringify(data).length
  };
  
  return snapshot;
};

/**
 * Compara dois snapshots
 * @param {Object} snapshot1 - Primeiro snapshot
 * @param {Object} snapshot2 - Segundo snapshot
 * @returns {Object} - Resultado da comparação
 */
export const compareSnapshots = (snapshot1, snapshot2) => {
  return {
    identical: JSON.stringify(snapshot1.data) === JSON.stringify(snapshot2.data),
    checksumMatch: snapshot1.checksum === snapshot2.checksum,
    timeDiff: new Date(snapshot2.timestamp) - new Date(snapshot1.timestamp)
  };
};
