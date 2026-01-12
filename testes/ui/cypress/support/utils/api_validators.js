/**
 * @fileoverview Validadores customizados para testes de API
 * @module api_validators
 * @author QA Team
 * @version 1.0.0
 */

import { USER_SCHEMA, SENSITIVE_FIELDS, REGEX_PATTERNS, REQUIRED_FIELDS } from './api_constants';

/**
 * Classe para validações avançadas de API
 */
export class APIValidator {
  
  /**
   * Valida response completa
   * @param {Object} response - Response do Cypress
   * @param {Object} options - Opções de validação
   * @returns {Object} - Resultado da validação
   */
  static validateResponse(response, options = {}) {
    const results = {
      valid: true,
      errors: [],
      warnings: [],
      metrics: {}
    };

    if (options.expectedStatus && response.status !== options.expectedStatus) {
      results.valid = false;
      results.errors.push(`Status esperado ${options.expectedStatus}, recebido ${response.status}`);
    }

    if (options.validateHeaders) {
      const headerResults = this.validateHeaders(response.headers);
      results.errors.push(...headerResults.errors);
      results.warnings.push(...headerResults.warnings);
    }

    if (options.validateBody && response.body) {
      const bodyResults = this.validateBody(response.body, options.schema);
      results.errors.push(...bodyResults.errors);
      results.warnings.push(...bodyResults.warnings);
    }
    
    // Métricas de performance
    results.metrics.responseTime = response.duration;
    results.metrics.bodySize = JSON.stringify(response.body).length;
    
    return results;
  }
  
  /**
   * Valida headers HTTP
   * @param {Object} headers - Headers da resposta
   * @returns {Object} - Resultado da validação
   */
  static validateHeaders(headers) {
    const results = { errors: [], warnings: [] };

    if (!headers['content-type']) {
      results.warnings.push('Header Content-Type ausente');
    }

    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'strict-transport-security'
    ];
    
    securityHeaders.forEach(header => {
      if (!headers[header]) {
        results.warnings.push(`Header de segurança recomendado ausente: ${header}`);
      }
    });
    
    return results;
  }
  
  /**
   * Valida corpo da resposta
   * @param {any} body - Corpo da resposta
   * @param {Object} schema - Schema esperado
   * @returns {Object} - Resultado da validação
   */
  static validateBody(body, schema = USER_SCHEMA) {
    const results = { errors: [], warnings: [] };
    
    if (Array.isArray(body)) {
      body.forEach((item, index) => {
        const itemResults = this.validateObject(item, schema, `Item ${index}`);
        results.errors.push(...itemResults.errors);
        results.warnings.push(...itemResults.warnings);
      });
    } else {
      const itemResults = this.validateObject(body, schema, 'Response');
      results.errors.push(...itemResults.errors);
      results.warnings.push(...itemResults.warnings);
    }
    
    return results;
  }
  
  /**
   * Valida objeto individual contra schema
   * @param {Object} obj - Objeto para validar
   * @param {Object} schema - Schema esperado
   * @param {string} context - Contexto para mensagens de erro
   * @returns {Object} - Resultado da validação
   */
  static validateObject(obj, schema, context = 'Object') {
    const results = { errors: [], warnings: [] };

    Object.keys(schema).forEach(field => {
      if (!obj.hasOwnProperty(field)) {
        results.errors.push(`${context}: Campo obrigatório '${field}' ausente`);
      } else if (typeof obj[field] !== schema[field]) {
        results.errors.push(`${context}: Campo '${field}' deve ser ${schema[field]}, é ${typeof obj[field]}`);
      }
    });

    SENSITIVE_FIELDS.forEach(field => {
      if (obj.hasOwnProperty(field)) {
        results.errors.push(`${context}: Campo sensível '${field}' exposto na resposta`);
      }
    });
    
    return results;
  }
  
  /**
   * Valida data quality de um dataset
   * @param {Array} data - Array de objetos
   * @returns {Object} - Relatório de qualidade
   */
  static validateDataQuality(data) {
    const report = {
      totalRecords: data.length,
      completeness: {},
      uniqueness: {},
      validity: {},
      consistency: {}
    };
    
    // Completeness - verificar campos preenchidos
    REQUIRED_FIELDS.forEach(field => {
      const filled = data.filter(item => {
        const value = item[field];
        return value !== null && value !== undefined && value !== '';
      }).length;
      
      report.completeness[field] = {
        filled,
        percentage: ((filled / data.length) * 100).toFixed(2) + '%'
      };
    });
    
    // Uniqueness - verificar UUIDs únicos
    const uuids = data.map(item => item.uuid);
    report.uniqueness.uuid = {
      total: uuids.length,
      unique: new Set(uuids).size,
      hasDuplicates: new Set(uuids).size !== uuids.length
    };
    
    // Validity - validar formatos
    report.validity.uuid = data.filter(item => 
      REGEX_PATTERNS.UUID_V4.test(item.uuid)
    ).length;
    
    report.validity.nome = data.filter(item => 
      item.nome && item.nome.length >= 3 && !REGEX_PATTERNS.INVALID_CHARS.test(item.nome)
    ).length;
    
    // Consistency - verificar hierarquia de localização
    report.consistency.locationHierarchy = data.filter(item =>
      item.rede && item.diretoria_regional && item.unidade_educacional
    ).length;
    
    return report;
  }
  
  /**
   * Valida performance da API
   * @param {Object} response - Response do Cypress
   * @param {number} maxTime - Tempo máximo aceitável em ms
   * @returns {Object} - Resultado da validação
   */
  static validatePerformance(response, maxTime = 3000) {
    return {
      valid: response.duration < maxTime,
      duration: response.duration,
      maxTime,
      performance: response.duration < maxTime ? 'PASS' : 'FAIL',
      percentageOfMax: ((response.duration / maxTime) * 100).toFixed(2) + '%'
    };
  }
  
  /**
   * Valida contrato de API (contract testing)
   * @param {Object} response - Response do Cypress
   * @param {Object} contract - Contrato esperado
   * @returns {Object} - Resultado da validação
   */
  static validateContract(response, contract) {
    const results = {
      valid: true,
      violations: [],
      metadata: {
        timestamp: new Date().toISOString(),
        endpoint: response.requestHeaders?.url || 'unknown'
      }
    };

    if (contract.status && response.status !== contract.status) {
      results.valid = false;
      results.violations.push({
        type: 'STATUS_CODE',
        expected: contract.status,
        actual: response.status
      });
    }

    if (contract.schema) {
      const schemaResults = this.validateObject(
        Array.isArray(response.body) ? response.body[0] : response.body,
        contract.schema,
        'Contract'
      );
      
      if (schemaResults.errors.length > 0) {
        results.valid = false;
        results.violations.push({
          type: 'SCHEMA_VIOLATION',
          errors: schemaResults.errors
        });
      }
    }

    if (contract.headers) {
      Object.keys(contract.headers).forEach(header => {
        if (!response.headers[header]) {
          results.valid = false;
          results.violations.push({
            type: 'MISSING_HEADER',
            header,
            expected: contract.headers[header]
          });
        }
      });
    }
    
    return results;
  }
}

/**
 * Funções auxiliares de validação
 */
export const ValidationHelpers = {
  
  /**
   * Verifica se todos os elementos de um array são únicos
   */
  assertUnique: (array, fieldName = 'values') => {
    const unique = new Set(array);
    if (unique.size !== array.length) {
      throw new Error(`${fieldName} contém duplicados. Total: ${array.length}, Únicos: ${unique.size}`);
    }
    return true;
  },
  
  /**
   * Verifica se um valor está dentro de um range
   */
  assertInRange: (value, min, max, fieldName = 'value') => {
    if (value < min || value > max) {
      throw new Error(`${fieldName} (${value}) está fora do range [${min}, ${max}]`);
    }
    return true;
  },
  
  /**
   * Verifica se string não contém caracteres inválidos
   */
  assertValidString: (str, fieldName = 'string') => {
    if (REGEX_PATTERNS.INVALID_CHARS.test(str)) {
      throw new Error(`${fieldName} contém caracteres inválidos`);
    }
    return true;
  },
  
  /**
   * Verifica se email é válido
   */
  assertValidEmail: (email, allowNull = true) => {
    if (email === null && allowNull) return true;
    if (!REGEX_PATTERNS.EMAIL.test(email)) {
      throw new Error(`Email inválido: ${email}`);
    }
    return true;
  }
};
