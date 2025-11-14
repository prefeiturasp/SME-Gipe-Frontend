// ============================================================================
// CONFIGURAÇÕES DA API GIPE
// ============================================================================

const API_CONFIG = {
  BASE_URL: 'https://qa-gipe.sme.prefeitura.sp.gov.br/api-intercorrencias/v1',
  AUTH_URL: 'https://qa-gipe.sme.prefeitura.sp.gov.br/api-autenticacao/v1',
  TIMEOUT: 30000
};

const CREDENTIALS = {
  valid: {
    username: '05481179342',
    password: 'Aa123456@'
  },
  invalid: {
    username: 'usuario_invalido',
    password: 'senha_errada'
  }
};

// Token válido pré-configurado
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYzMTUyMjQ4LCJpYXQiOjE3NjMwNjU4NDgsImp0aSI6IjU2ZjUzZDhjMTRiODQ5MzM4MDNkMDlkMjc3NGI5MmJhIiwidXNlcl9pZCI6MjAsInVzZXJuYW1lIjoiMDU0ODExNzkzNDIiLCJuYW1lIjoiTWFyY2VsbyBBbHZlcyBOdW5lcyBkYSBTaWx2YSIsInBlcmZpbF9jb2RpZ28iOjMzNjAsInBlcmZpbF9ub21lIjoiRElSRVRPUiBERSBFU0NPTEEiLCJjb2RpZ29fdW5pZGFkZV9lb2wiOiIwMTE1NjgifQ.4hiLfyL9HhMXlG4l5MJMacCblFQ5TGSNvtLv3I5z_G4';

module.exports = { API_CONFIG, CREDENTIALS, AUTH_TOKEN };
