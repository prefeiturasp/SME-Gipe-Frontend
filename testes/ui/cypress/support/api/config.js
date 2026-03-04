// ============================================================================
// CONFIGURAÇÕES DA API GIPE
// ============================================================================

const API_CONFIG = {
  BASE_URL: 'https://qa-gipe.sme.prefeitura.sp.gov.br/api-intercorrencias/v1',
  AUTH_URL: 'https://qa-gipe.sme.prefeitura.sp.gov.br/api-autenticacao/v1',
  TIMEOUT: 120000
};

const CREDENTIALS = {
  valid: {
    username: '7311559',
    password: 'Sgp1559'
  },
  invalid: {
    username: 'usuario_invalido',
    password: 'senha_errada'
  }
};

// Token válido pré-configurado
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MTc5ODAyLCJpYXQiOjE3NjQwOTM0MDIsImp0aSI6IjQxM2JjN2UxZmI0YjQ0Y2Q4YzdlZmM0YTgyMzJiYzlhIiwidXNlcl9pZCI6MjAsInVzZXJuYW1lIjoiMDU0ODExNzkzNDIiLCJuYW1lIjoiTWFyY2VsbyBBbHZlcyBOdW5lcyBkYSBTaWx2YSIsImNwZiI6IjA1NDgxMTc5MzQyIiwiZW1haWwiOiJndWlsaGVybWUuc2lsdmVpcmFAc3Bhc3N1LmNvbS5iciIsInBlcmZpbF9jb2RpZ28iOjMzNjAsInBlcmZpbF9ub21lIjoiRElSRVRPUiBERSBFU0NPTEEiLCJjb2RpZ29fdW5pZGFkZV9lb2wiOiIwMTE1NjgifQ.0fZeid7Ri4ThV4yeYIxyx68WX3K2zEhAa-Zs3g0lYSM';

module.exports = { API_CONFIG, CREDENTIALS, AUTH_TOKEN };
