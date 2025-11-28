// ============================================================================
// CONFIGURAÇÕES DA API GIPE ESTUDANTES
// ============================================================================

const GIPE_CONFIG = {
  BASE_URL: 'https://qa-gipe.sme.prefeitura.sp.gov.br',
  TIMEOUT: 30000,
  
  // Credenciais padrão para testes
  CREDENTIALS: {
    ALUNO_RA: '5937723',
    DATA_NASC: '14062011',
    DISPOSITIVO: 'WEB'
  },
  
  // IDs de teste para prova TAI
  TEST_IDS: {
    PROVA_TAI_ID: 1,
    QUESTAO_ID: 1,
    QUESTAO_LEGADO_ID: 1,
    ALTERNATIVA_ID: 96034121,
    DISPOSITIVO_ID: 1
  },
  
  // Dados para submissão de respostas
  SUBMISSION_DATA: {
    STATUS: 1,
    TIPO_DISPOSITIVO: 1,
    DATA_INICIO: Date.now(),
    DATA_FIM: null,
    RESPOSTA: 'A',
    DATA_HORA_RESPOSTA_TICKS: Date.now(),
    TEMPO_RESPOSTA_ALUNO: 30
  }
};

module.exports = { GIPE_CONFIG };

