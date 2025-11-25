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
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MDg5NjI4LCJpYXQiOjE3NjQwMDMyMjgsImp0aSI6ImI5NjMwNTdlMjM2ZjQ4NzI4OTJiYmE2ZWVjMWU0YjAzIiwidXNlcl9pZCI6MjAsInVzZXJuYW1lIjoiMDU0ODExNzkzNDIiLCJuYW1lIjoiTWFyY2VsbyBBbHZlcyBOdW5lcyBkYSBTaWx2YSIsImNwZiI6IjA1NDgxMTc5MzQyIiwiZW1haWwiOiJndWlsaGVybWUuc2lsdmVpcmFAc3Bhc3N1LmNvbS5iciIsInBlcmZpbF9jb2RpZ28iOjMzNjAsInBlcmZpbF9ub21lIjoiRElSRVRPUiBERSBFU0NPTEEiLCJjb2RpZ29fdW5pZGFkZV9lb2wiOiIwMTE1NjgifQ.ijEevboimZJYQXWU0tHdXSdlWL_p71LyXFLNKNg9Sdg';

module.exports = { API_CONFIG, CREDENTIALS, AUTH_TOKEN };
