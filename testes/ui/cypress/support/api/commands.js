const { API_CONFIG, CREDENTIALS, AUTH_TOKEN } = require('./config');

Cypress.Commands.add('api_usar_token_fixo', () => {
  Cypress.env('authToken', AUTH_TOKEN);
  cy.log('Token fixo configurado');
  return AUTH_TOKEN;
});

Cypress.Commands.add('api_validar_token', (token) => {
  try {
    if (!token || token.length === 0) {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(atob(parts[1]));
    
    if (!payload.exp) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = payload.exp - now;
    
    return expiresIn > 300;
  } catch (error) {
    return false;
  }
});

Cypress.Commands.add('api_obter_token_via_ui', () => {
  Cypress.log({ name: 'Token', message: 'Obtendo novo token via interface' });
  
  cy.clearCookies();
  cy.clearLocalStorage();
  
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/', {
    timeout: 60000,
    retryOnNetworkFailure: true
  });
  
  cy.wait(3000);
  
  cy.get('input[placeholder="Digite um RF ou CPF"]', { timeout: 15000 })
    .should('be.visible')
    .clear()
    .type(CREDENTIALS.valid.username);
  
  cy.get('input[placeholder="Digite sua senha"]', { timeout: 15000 })
    .should('be.visible')
    .clear()
    .type(CREDENTIALS.valid.password);
  
  cy.get('button')
    .filter((_, el) => el.innerText && el.innerText.trim() === 'Acessar')
    .should('be.visible')
    .click();
  
  cy.url({ timeout: 60000 }).should('include', '/dashboard');
  cy.wait(8000);
  
  return cy.getCookie('auth_token').then((cookie) => {
    if (cookie && cookie.value) {
      const token = cookie.value;
      Cypress.log({ name: 'Token', message: 'TOKEN CAPTURADO DO COOKIE' });
      Cypress.log({ name: 'Token', message: `Token: ${token.substring(0, 50)}...` });
      
      cy.writeFile('token.txt', token);
      cy.writeFile('token.json', {
        token: token,
        capturedAt: new Date().toISOString(),
        source: 'cookie:auth_token'
      });
      
      Cypress.env('authToken', token);
      return token;
    } else {
      throw new Error('Cookie auth_token não encontrado');
    }
  });
});

Cypress.Commands.add('api_carregar_token_arquivo', () => {
  Cypress.log({ name: 'Token', message: 'Carregando token do arquivo' });
  
  return cy.readFile('token.json', { timeout: 5000, failOnStatusCode: false })
    .then((data) => {
      if (data && data.token) {
        Cypress.log({ name: 'Token', message: `Token carregado: ${data.token.substring(0, 50)}...` });
        Cypress.log({ name: 'Token', message: `Capturado em: ${data.capturedAt}` });
        return data.token;
      }
      Cypress.log({ name: 'Token', message: 'Token nao encontrado no arquivo' });
      return null;
    }, (error) => {
      Cypress.log({ name: 'Token', message: `Erro ao carregar: ${error.message}` });
      return null;
    });
});

Cypress.Commands.add('api_login', (username, password) => {
  cy.log(`Login API: ${username}`);
  
  return cy.request({
    method: 'POST',
    url: `${API_CONFIG.AUTH_URL}/login/`,
    body: { username, password },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    failOnStatusCode: false,
    timeout: 120000,
    retryOnNetworkFailure: true
  }).then((response) => {
    if (response.status === 200 && response.body.access) {
      Cypress.env('authToken', response.body.access);
      cy.log('Login realizado via API');
    }
    return response;
  });
});

Cypress.Commands.add('api_obter_token_valido', () => {
  Cypress.log({ name: 'Token', message: 'Verificando token disponivel' });
  
  return cy.api_carregar_token_arquivo().then((tokenArquivo) => {
    if (!tokenArquivo) {
      Cypress.log({ name: 'Token', message: 'Nenhum token encontrado no arquivo' });
      Cypress.log({ name: 'Token', message: 'Obtendo novo token via interface' });
      return cy.api_obter_token_via_ui();
    }
    
    try {
      if (tokenArquivo.length === 0) {
        Cypress.log({ name: 'Token', message: 'Token vazio' });
        return cy.api_obter_token_via_ui();
      }

      const parts = tokenArquivo.split('.');
      if (parts.length !== 3) {
        Cypress.log({ name: 'Token', message: 'Token com formato invalido' });
        return cy.api_obter_token_via_ui();
      }

      const payload = JSON.parse(atob(parts[1]));
      
      if (!payload.exp) {
        Cypress.log({ name: 'Token', message: 'Token sem data de expiracao' });
        return cy.api_obter_token_via_ui();
      }

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = payload.exp - now;
      
      Cypress.log({ name: 'Token', message: `Expira em: ${Math.floor(expiresIn / 60)} minutos` });
      
      if (expiresIn > 300) {
        Cypress.log({ name: 'Token', message: 'Usando token do arquivo (valido)' });
        Cypress.env('authToken', tokenArquivo);
        return tokenArquivo;
      } else {
        Cypress.log({ name: 'Token', message: 'Token expirado ou proximo de expirar' });
        return cy.api_obter_token_via_ui();
      }
    } catch (error) {
      Cypress.log({ name: 'Token', message: `Erro ao validar: ${error.message}` });
      return cy.api_obter_token_via_ui();
    }
  });
});

Cypress.Commands.add('api_autenticar', () => {
  Cypress.log({ name: 'Autenticacao', message: 'Configurando token' });
  
  const isCI = Cypress.env('CI') || false;
  const apiUsername = Cypress.env('API_USERNAME');
  const apiPassword = Cypress.env('API_PASSWORD');
  
  if (isCI && apiUsername && apiPassword) {
    Cypress.log({ name: 'Autenticacao', message: 'Ambiente CI detectado - usando login via API' });
    return cy.api_login(apiUsername, apiPassword).then((response) => {
      if (response.status === 200 && response.body.access) {
        const token = response.body.access;
        Cypress.env('authToken', token);
        Cypress.log({ name: 'Autenticacao', message: 'Token obtido via API no CI' });
        return token;
      } else {
        Cypress.log({ name: 'Autenticacao', message: 'Falha no login via API' });
        throw new Error('Falha na autenticação API no ambiente CI');
      }
    });
  }
  
  return cy.api_carregar_token_arquivo().then((tokenArquivo) => {
    let tokenFinal = tokenArquivo || AUTH_TOKEN;
    
    Cypress.env('authToken', tokenFinal);
    Cypress.log({ name: 'Autenticacao', message: 'Token configurado' });
    return tokenFinal;
  });
});

Cypress.Commands.add('gerar_token_gipe_estudantes', () => {
  cy.log('Gerando token GIPE Estudantes');
  
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
    timeout: 120000,
    retryOnNetworkFailure: true
  }).then((response) => {
    if (response.status !== 200) {
      cy.log(`Falha na autenticacao GIPE Estudantes: ${response.status}`);
      throw new Error(`Authentication failed with status: ${response.status} - ${JSON.stringify(response.body)}`);
    }
    
    const token = response.body.token;
    Cypress.env('gipeEstudantesToken', token);
    cy.log('Token GIPE Estudantes gerado com sucesso');
    return token;
  });
});

Cypress.Commands.add('api_request', (method, endpoint, options = {}) => {
  const token = Cypress.env('authToken');
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  cy.log(`${method} ${endpoint}`);
  
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
    timeout: 120000,
    retryOnNetworkFailure: true,
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
  return cy.api_request('DELETE', endpoint, options );
});

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

Cypress.Commands.add('validar_estrutura_declarante', (declarante) => {
  expect(declarante).to.be.an('object');
  expect(declarante).to.have.property('uuid').that.is.a('string');
  expect(declarante).to.have.property('nome').that.is.a('string');
  expect(declarante).to.have.property('cpf').that.is.a('string');
  expect(declarante).to.have.property('telefone').that.is.a('string');
  expect(declarante).to.have.property('email').that.is.a('string');
  return cy.wrap(declarante);
});

Cypress.Commands.add('validar_estrutura_envolvido', (envolvido) => {
  expect(envolvido).to.be.an('object');
  expect(envolvido).to.have.property('uuid').that.is.a('string');
  expect(envolvido).to.have.property('nome').that.is.a('string');
  expect(envolvido).to.have.property('tipo_envolvimento').that.is.a('string');
  expect(envolvido).to.have.property('necessita_atendimento').that.is.a('boolean');
  return cy.wrap(envolvido);
});

Cypress.Commands.add('validar_estrutura_intercorrencia', (intercorrencia) => {
  expect(intercorrencia).to.be.an('object');
  expect(intercorrencia).to.have.property('uuid').that.is.a('string');
  expect(intercorrencia).to.have.property('data_ocorrencia').that.is.a('string');
  expect(intercorrencia).to.have.property('tipo_ocorrencia').that.is.a('number');
  expect(intercorrencia).to.have.property('status').that.is.a('string');
  return cy.wrap(intercorrencia);
});

Cypress.Commands.add('validar_estrutura_tipo_ocorrencia', (tipo) => {
  expect(tipo).to.be.an('object');
  expect(tipo).to.have.property('id').that.is.a('number');
  expect(tipo).to.have.property('nome').that.is.a('string');
  expect(tipo).to.have.property('descricao').that.is.a('string');
  expect(tipo.nome).to.not.be.empty;
  expect(tipo.descricao).to.not.be.empty;
  return cy.wrap(tipo);
});

Cypress.Commands.add('validar_array_nao_vazio', (array) => {
  expect(array).to.be.an('array');
  expect(array.length).to.be.greaterThan(0);
  return cy.wrap(array);
});

Cypress.Commands.add('validar_resposta_array', (response) => {
  expect(response.body).to.be.an('array');
  expect(Array.isArray(response.body)).to.be.true;
  return cy.wrap(response);
});

Cypress.Commands.add('validar_resposta_objeto', (response) => {
  expect(response.body).to.be.an('object');
  expect(Array.isArray(response.body)).to.be.false;
  return cy.wrap(response);
});
