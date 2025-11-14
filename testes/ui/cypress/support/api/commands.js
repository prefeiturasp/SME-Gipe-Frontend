// ============================================================================
// COMANDOS CUSTOMIZADOS PARA API GIPE
// ============================================================================

const { API_CONFIG, CREDENTIALS, AUTH_TOKEN } = require('./config');

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

Cypress.Commands.add('api_usar_token_fixo', () => {
  Cypress.env('authToken', AUTH_TOKEN);
  cy.log('✅ Token fixo configurado');
  return AUTH_TOKEN;
});

Cypress.Commands.add('api_login', (username, password) => {
  cy.log(`🔐 Login: ${username}`);
  
  return cy.request({
    method: 'POST',
    url: `${API_CONFIG.AUTH_URL}/login/`,
    body: { username, password },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    failOnStatusCode: false,
    timeout: API_CONFIG.TIMEOUT
  }).then((response) => {
    if (response.status === 200 && response.body.access) {
      Cypress.env('authToken', response.body.access);
      cy.log('✅ Login realizado');
    }
    return response;
  });
});

Cypress.Commands.add('api_autenticar', () => {
  // Primeiro tenta usar o token fixo
  Cypress.env('authToken', AUTH_TOKEN);
  cy.log('✅ Usando token pré-configurado');
  return cy.wrap(AUTH_TOKEN);
  
  // Se precisar fazer login:
  // return cy.api_login(CREDENTIALS.valid.username, CREDENTIALS.valid.password)
  //   .then((response) => {
  //     expect(response.status).to.equal(200);
  //     return response.body.access;
  //   });
});

// ============================================================================
// AUTENTICAÇÃO GIPE ESTUDANTES
// ============================================================================

Cypress.Commands.add('gerar_token_gipe_estudantes', () => {
  cy.log('🔐 Gerando token GIPE Estudantes...');
  
  const baseUrl = Cypress.env('GIPE_ESTUDANTES_BASE_URL') || 'https://serap-estudantes.sme.prefeitura.sp.gov.br';
  const alunoRa = Cypress.env('ALUNO_RA') || '5937723';
  const dataNasc = Cypress.env('DATA_NASC') || '14062011';
  const dispositivo = Cypress.env('DISPOSITIVO') || 'WEB';

  return cy.request({
    method: 'POST',
    url: `${baseUrl}/api/v1/autenticacao`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: {
      login: alunoRa,
      senha: dataNasc,
      dispositivo: dispositivo
    },
    failOnStatusCode: false,
    timeout: 30000
  }).then((response) => {
    if (response.status !== 200) {
      cy.log(`⚠️ Falha na autenticação GIPE Estudantes: ${response.status}`);
      throw new Error(`Authentication failed with status: ${response.status} - ${JSON.stringify(response.body)}`);
    }
    
    const token = response.body.token;
    Cypress.env('gipeEstudantesToken', token);
    cy.log('✅ Token GIPE Estudantes gerado com sucesso');
    return token;
  });
});

// ============================================================================
// REQUISIÇÕES HTTP
// ============================================================================

Cypress.Commands.add('api_request', (method, endpoint, options = {}) => {
  const token = Cypress.env('authToken');
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  cy.log(`📡 ${method} ${endpoint}`);
  
  return cy.request({
    method,
    url,
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    },
    body: options.body,
    failOnStatusCode: false,
    timeout: API_CONFIG.TIMEOUT,
    ...options
  });
});

Cypress.Commands.add('api_get', (endpoint, options = {}) => {
  return cy.api_request('GET', endpoint, options);
});

Cypress.Commands.add('api_post', (endpoint, body = {}, options = {}) => {
  return cy.api_request('POST', endpoint, { ...options, body });
});

Cypress.Commands.add('api_put', (endpoint, body = {}, options = {}) => {
  return cy.api_request('PUT', endpoint, { ...options, body });
});

Cypress.Commands.add('api_delete', (endpoint, options = {}) => {
  return cy.api_request('DELETE', endpoint, options);
});

// ============================================================================
// HELPERS DE DADOS
// ============================================================================

Cypress.Commands.add('obter_primeiro_item', (endpoint) => {
  return cy.api_get(endpoint).then((response) => {
    if (response.status === 200 && response.body.length > 0) {
      return response.body[0];
    }
    return null;
  });
});

Cypress.Commands.add('obter_uuid', (endpoint) => {
  return cy.obter_primeiro_item(endpoint).then((item) => {
    return item?.uuid || null;
  });
});

Cypress.Commands.add('obter_id', (endpoint) => {
  return cy.obter_primeiro_item(endpoint).then((item) => {
    return item?.id || null;
  });
});

// ============================================================================
// DADOS MOCK PARA TESTES
// ============================================================================

Cypress.Commands.add('gerar_dados_intercorrencia', () => {
  const timestamp = Date.now();
  const hoje = new Date().toISOString().split('T')[0];
  
  return {
    secao_inicial: {
      "data_ocorrencia": hoje,
      "hora_ocorrencia": "14:30:00",
      "tipo_ocorrencia": 1,
      "categoria": 1,
      "local_ocorrencia": "Pátio da escola",
      "descricao": `Teste automatizado Cypress - ${timestamp}`,
      "acao_tomada": "Medidas preventivas foram tomadas imediatamente"
    },
    furto_roubo: {
      "tipo_bem": "Eletrônico",
      "descricao_bem": "Notebook Dell Latitude",
      "valor_estimado": "3500.00",
      "boletim_ocorrencia": `BO-${timestamp}`,
      "houve_violencia": false,
      "observacoes": "Bem recuperado posteriormente"
    },
    nao_furto_roubo: {
      "houve_lesao": false,
      "providencias_tomadas": "Acionamento dos responsáveis e encaminhamento",
      "necessita_acompanhamento": true,
      "tipo_acompanhamento": "Psicológico",
      "observacoes": "Acompanhamento semanal necessário"
    },
    secao_final: {
      "encaminhamento": "DRE",
      "providencias_finais": "Documentação enviada à DRE com todos os anexos",
      "observacoes": "Caso finalizado com sucesso",
      "status": "finalizada"
    }
  };
});
