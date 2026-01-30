/**
 * @fileoverview Constantes e configurações para testes de API
 * @module api_constants
 * @author QA Team
 * @version 1.0.0
 */

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  BASE_URL: 'https://qa-gipe.sme.prefeitura.sp.gov.br',
  GESTAO_USUARIOS: '/api/users/gestao-usuarios/',
  AUTH: '/api/auth/',
  INTERCORRENCIAS: '/api-intercorrencias/v1/'
};

/**
 * Headers padrão para requisições
 */
export const DEFAULT_HEADERS = {
  'Accept': '*/*',
  'Content-Type': 'application/json'
};

/**
 * Timeouts em milissegundos
 */
export const TIMEOUTS = {
  DEFAULT: 120000,
  SHORT: 30000,
  LONG: 300000,
  SLA_RESPONSE: 3000
};

/**
 * Status codes HTTP
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

/**
 * Schema esperado para usuários
 */
export const USER_SCHEMA = {
  uuid: 'string',
  perfil: 'string',
  username: 'string',
  nome: 'string',
  data_solicitacao: 'string',
  rf_ou_cpf: 'string',
  rede: 'string',
  diretoria_regional: 'string',
  unidade_educacional: 'string',
  is_validado: 'boolean',
  is_active: 'boolean'
};

/**
 * Campos obrigatórios que não podem ser vazios
 */
export const REQUIRED_FIELDS = [
  'uuid',
  'perfil',
  'username',
  'nome',
  'data_solicitacao',
  'rf_ou_cpf',
  'rede',
  'diretoria_regional',
  'unidade_educacional',
  'is_validado',
  'is_active'
];

/**
 * Campos que podem ser nulos
 */
export const NULLABLE_FIELDS = [
  'email'
];

/**
 * Campos sensíveis que não devem ser expostos
 */
export const SENSITIVE_FIELDS = [
  'password',
  'senha',
  'token',
  'secret',
  'access_token',
  'refresh_token',
  'api_key'
];

/**
 * Perfis de usuário válidos
 */
export const USER_PROFILES = {
  GIPE: 'GIPE',
  DIRETOR: 'DIRETOR DE ESCOLA',
  DRE: 'DRE',
  ADMIN: 'ADMIN'
};

/**
 * Regex patterns para validações
 */
export const REGEX_PATTERNS = {
  UUID_V4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  DATE_BR: /^\d{2}\/\d{2}\/\d{4}$/,
  DATE_ISO: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$|^\d{4}-\d{2}-\d{2}$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  INVALID_CHARS: /[<>{}[\]\\]/
};

/**
 * Limites e thresholds para validações
 */
export const LIMITS = {
  MIN_USERS: 10,
  MIN_NAME_LENGTH: 3,
  MIN_USERNAME_LENGTH: 3,
  MAX_RESPONSE_TIME: 3000,
  MIN_DIFFERENT_PROFILES: 2
};

/**
 * Mensagens de erro padrão
 */
export const ERROR_MESSAGES = {
  EMPTY_ARRAY: 'A lista não deve estar vazia',
  INVALID_STATUS: 'Status code inesperado',
  MISSING_FIELD: 'Campo obrigatório ausente',
  INVALID_TYPE: 'Tipo de dado inválido',
  DUPLICATE_UUID: 'UUID duplicado encontrado',
  SENSITIVE_DATA: 'Dados sensíveis expostos na resposta',
  TIMEOUT: 'Timeout excedido',
  AUTHENTICATION_FAILED: 'Falha na autenticação'
};

/**
 * Tags de categorização de testes
 */
export const TEST_TAGS = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  SECURITY: '@security',
  PERFORMANCE: '@performance',
  CONTRACT: '@contract',
  DATA_QUALITY: '@data_quality',
  INTEGRATION: '@integration'
};

/**
 * Níveis de log
 */
export const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Configurações de retry
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  RETRY_ON_STATUS: [500, 502, 503, 504]
};
