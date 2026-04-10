// ============================================================================
// CONFIGURAÇÕES DA API GIPE
// ============================================================================
// ATENÇÃO: Credenciais e tokens agora vêm do arquivo .env
// ============================================================================

require('dotenv').config()

const API_CONFIG = {
  BASE_URL: 'https://qa-gipe.sme.prefeitura.sp.gov.br/api-intercorrencias/v1',
  AUTH_URL: 'https://qa-gipe.sme.prefeitura.sp.gov.br/api-autenticacao/v1',
  TIMEOUT: 120000
};

const CREDENTIALS = {
  valid: {
    username: process.env.RF_GIPE,
    password: process.env.SENHA_GIPE
  },
  invalid: {
    username: 'usuario_invalido',
    password: 'senha_errada'
  }
};

// Token válido carregado do .env
// Este token expira em 2025-12-26 (epoch: 1764179802)
// Se expirado, regere via: npm run cy:token
const AUTH_TOKEN = process.env.AUTH_TOKEN;

module.exports = { API_CONFIG, CREDENTIALS, AUTH_TOKEN };
