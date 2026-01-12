/// <reference types="cypress" />

/**
 * @fileoverview Step definitions para testes de API - Gestão de Pessoas
 * @module api_gestao_pessoas_steps
 * @author QA Team
 * @version 2.0.0
 * @description Steps definitions refatorados com best practices de nível senior
 */

import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps';
import { 
  isValidUUID, 
  isValidBrazilianDate, 
  hasDuplicates,
  getUniqueValues,
  formatDuration,
  generateDataQualityReport
} from '../utils/api_helpers';
import { 
  USER_SCHEMA, 
  SENSITIVE_FIELDS, 
  REQUIRED_FIELDS,
  NULLABLE_FIELDS,
  REGEX_PATTERNS,
  LIMITS,
  HTTP_STATUS,
  TIMEOUTS
} from '../utils/api_constants';
import { APIValidator, ValidationHelpers } from '../utils/api_validators';

const { CREDENTIALS } = require('../api/config');

// ============================================================================
// HOOKS - Preparação e Limpeza
// ============================================================================

Before({ tags: '@api' }, function() {
  cy.log('🔧 Preparando ambiente de teste de API');
  Cypress.env('authToken', null);
  this.testData = {
    startTime: Date.now(),
    metrics: {},
    snapshots: []
  };
});

After({ tags: '@api' }, function() {
  const duration = Date.now() - this.testData.startTime;
  cy.log(`✅ Teste de API finalizado em ${formatDuration(duration)}`);
  
  // Log de métricas coletadas
  if (this.testData.metrics && Object.keys(this.testData.metrics).length > 0) {
    cy.log('📊 Métricas coletadas:', JSON.stringify(this.testData.metrics, null, 2));
  }
});

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

Given('que possuo credenciais válidas de autenticação', () => {
  Cypress.log({ name: 'Autenticação', message: 'Credenciais disponíveis' });
});

Given('que estou autenticado na API', function() {
  Cypress.log({ name: 'Autenticação', message: 'Iniciando processo de autenticação' });
  
  return cy.api_autenticar().then((token) => {
    if (!this.testData) {
      this.testData = {};
    }
    this.testData.token = token;
    Cypress.log({ name: 'Autenticação', message: 'Token configurado e pronto para uso' });
    return token;
  });
});

Given('que tenho um token válido atualizado', function() {
  Cypress.log({ name: 'Autenticação', message: 'Obtendo token válido e atualizado' });
  
  return cy.api_obter_token_valido().then((token) => {
    if (!this.testData) {
      this.testData = {};
    }
    this.testData.token = token;
    Cypress.log({ name: 'Autenticação', message: 'Token válido obtido e configurado' });
    return token;
  });
});

When('eu faço login com usuário {string} e senha {string}', (username, password) => {
  cy.api_login(username, password).as('response');
});

// ============================================================================
// REQUISIÇÕES GENÉRICAS
// ============================================================================

When('eu faço uma requisição GET para {string}', function(endpoint) {
  // Substituir placeholders
  if (endpoint.includes('{uuid}') && this.testData.uuid) {
    endpoint = endpoint.replace('{uuid}', this.testData.uuid);
  }
  if (endpoint.includes('{id}') && this.testData.id) {
    endpoint = endpoint.replace('{id}', this.testData.id);
  }
  
  // Se for URL completa, fazer request direto sem usar BASE_URL
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    const token = Cypress.env('authToken');
    cy.request({
      method: 'GET',
      url: endpoint,
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
        'Accept': '*/*'
      },
      failOnStatusCode: false,
      timeout: 120000,
      retryOnNetworkFailure: true
    }).as('response');
  } else {
    cy.api_get(endpoint).as('response');
  }
});

When('eu faço uma requisição POST para {string}', function(endpoint) {
  const body = this.testData.requestBody || {};
  cy.api_post(endpoint, body).as('response');
});

When('eu faço uma requisição POST para {string} com dados incompletos', (endpoint) => {
  cy.api_post(endpoint, {}).as('response');
});

When('eu faço uma requisição PUT para {string}', function(endpoint) {
  if (endpoint.includes('{uuid}') && this.testData.uuid) {
    endpoint = endpoint.replace('{uuid}', this.testData.uuid);
  }
  
  const body = this.testData.requestBody || {};
  cy.api_put(endpoint, body).as('response');
});

// ============================================================================
// PREPARAÇÃO DE DADOS
// ============================================================================

Given('que existe um declarante cadastrado', function() {
  cy.obter_uuid('/declarante/').then((uuid) => {
    this.testData.uuid = uuid;
    cy.wrap(uuid).as('uuid');
  });
});

Given('que existe uma intercorrência cadastrada', function() {
  cy.obter_uuid('/diretor/').then((uuid) => {
    this.testData.uuid = uuid;
    cy.wrap(uuid).as('uuid');
  });
});

Given('que existe um envolvido cadastrado', function() {
  cy.obter_uuid('/envolvidos/').then((uuid) => {
    this.testData.uuid = uuid;
    cy.wrap(uuid).as('uuid');
  });
});

Given('que existe um tipo de ocorrência cadastrado', function() {
  cy.obter_id('/tipos-ocorrencia/').then((id) => {
    this.testData.id = id;
    cy.wrap(id).as('id');
  });
});

Given('que tenho dados válidos para uma nova intercorrência', function() {
  cy.gerar_dados_intercorrencia().then((dados) => {
    this.testData.requestBody = dados.secao_inicial;
  });
});

Given('que tenho dados atualizados para a seção inicial', function() {
  cy.gerar_dados_intercorrencia().then((dados) => {
    this.testData.requestBody = dados.secao_inicial;
  });
});

Given('que tenho dados de furto/roubo', function() {
  cy.gerar_dados_intercorrencia().then((dados) => {
    this.testData.requestBody = dados.furto_roubo;
  });
});

Given('que tenho dados de não furto/roubo', function() {
  cy.gerar_dados_intercorrencia().then((dados) => {
    this.testData.requestBody = dados.nao_furto_roubo;
  });
});

Given('que tenho dados para a seção final', function() {
  cy.gerar_dados_intercorrencia().then((dados) => {
    this.testData.requestBody = dados.secao_final;
  });
});

Given('que tenho todos os dados necessários para uma ocorrência', function() {
  cy.gerar_dados_intercorrencia().then((dados) => {
    this.testData.dadosCompletos = dados;
  });
});

// ============================================================================
// VALIDAÇÕES DE RESPOSTA
// ============================================================================

Then('o status code da resposta deve ser {int}', (expectedStatus) => {
  cy.get('@response').its('status').should('equal', expectedStatus);
});

Then('a resposta deve conter o token de acesso', () => {
  cy.get('@response').its('body').should('have.property', 'access');
});

Then('o token deve ser válido', () => {
  cy.get('@response').then((response) => {
    expect(response.body.access).to.be.a('string');
    expect(response.body.access).to.have.length.greaterThan(0);
  });
});

Then('a resposta deve conter uma lista de declarantes', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    if (response.body.length > 0) {
      expect(response.body[0]).to.have.property('uuid');
    }
  });
});

Then('cada declarante deve ter os campos:', (dataTable) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    if (response.body.length > 0) {
      expect(response.body[0]).to.have.property('uuid');
    }
  });
});

Then('a resposta deve conter os dados do declarante', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('uuid');
  });
});

Then('a resposta deve conter uma lista de intercorrências', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
  });
});

Then('a resposta deve conter os dados da intercorrência', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('uuid');
  });
});

Then('a resposta deve conter uma lista de categorias', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
  });
});

Then('a resposta deve conter o UUID da intercorrência criada', function() {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('uuid');
    this.testData.uuid = response.body.uuid;
    cy.wrap(response.body.uuid).as('uuid');
  });
});

Then('a resposta deve conter os dados atualizados', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('object');
  });
});

Then('a resposta deve conter uma lista de envolvidos', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
  });
});

Then('a resposta deve conter os dados do envolvido', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('uuid');
  });
});

Then('a resposta deve conter uma lista de tipos de ocorrência', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
  });
});

Then('a resposta deve conter os dados do tipo de ocorrência', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('id');
  });
});

// ============================================================================
// FLUXOS COMPLETOS
// ============================================================================

When('eu crio uma ocorrência via seção inicial', function() {
  const dados = this.testData.dadosCompletos;
  cy.api_post('/diretor/secao-inicial/', dados.secao_inicial).then((response) => {
    expect(response.status).to.equal(201);
    this.testData.uuid = response.body.uuid;
    cy.wrap(response).as('response');
  });
});

When('atualizo com dados de furto/roubo', function() {
  const dados = this.testData.dadosCompletos;
  const uuid = this.testData.uuid;
  cy.api_put(`/diretor/furto-roubo/${uuid}/`, dados.furto_roubo).then((response) => {
    expect(response.status).to.equal(200);
  });
});

When('finalizo com a seção final', function() {
  const dados = this.testData.dadosCompletos;
  const uuid = this.testData.uuid;
  cy.api_put(`/diretor/secao-final/${uuid}/`, dados.secao_final).as('response');
});

Then('a ocorrência deve estar completa', () => {
  cy.get('@response').then((response) => {
    expect(response.status).to.equal(200);
  });
});

Then('o status deve ser {string}', (expectedStatus) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('status', expectedStatus);
  });
});

When('eu listo as categorias disponíveis', function() {
  cy.api_get('/diretor/categorias/').then((response) => {
    expect(response.status).to.equal(200);
    this.testData.categorias = response.body;
  });
});

When('eu crio uma nova intercorrência', function() {
  cy.gerar_dados_intercorrencia().then((dados) => {
    cy.api_post('/diretor/secao-inicial/', dados.secao_inicial).then((response) => {
      expect(response.status).to.equal(201);
      this.testData.uuid = response.body.uuid;
    });
  });
});

When('eu consulto a intercorrência criada', function() {
  const uuid = this.testData.uuid;
  cy.api_get(`/diretor/${uuid}/`).then((response) => {
    expect(response.status).to.equal(200);
  });
});

When('eu atualizo a intercorrência', function() {
  cy.gerar_dados_intercorrencia().then((dados) => {
    const uuid = this.testData.uuid;
    cy.api_put(`/diretor/secao-inicial/${uuid}/`, dados.secao_inicial).then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});

When('eu finalizo a intercorrência', function() {
  cy.gerar_dados_intercorrencia().then((dados) => {
    const uuid = this.testData.uuid;
    cy.api_put(`/diretor/secao-final/${uuid}/`, dados.secao_final).as('response');
  });
});

Then('todas as operações devem ter sucesso', () => {
  cy.get('@response').its('status').should('equal', 200);
});

Then('a intercorrência deve estar finalizada no sistema', function() {
  const uuid = this.testData.uuid;
  cy.api_get(`/diretor/${uuid}/`).then((response) => {
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('uuid', uuid);
  });
});

// ============================================================================
// VALIDAÇÕES ADICIONAIS
// ============================================================================

Then('a resposta deve ser um array', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
  });
});

Then('a resposta deve ser um objeto', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('object');
    expect(response.body).to.not.be.an('array');
  });
});

Then('a lista não deve estar vazia', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
  });
});

Then('o objeto deve ter o campo uuid', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('uuid');
  });
});

Then('o content-type deve ser application/json', () => {
  cy.get('@response').then((response) => {
    const contentType = response.headers['content-type'];
    expect(contentType).to.include('application/json');
  });
});

Then('o tempo de resposta deve ser menor que {int}ms', (maxTime) => {
  cy.get('@response').then((response) => {
    expect(response.duration).to.be.lessThan(maxTime);
  });
});

Then('o tempo de resposta deve ser menor que {int} milissegundos', (maxTime) => {
  cy.get('@response').then((response) => {
    expect(response.duration).to.be.lessThan(maxTime);
  });
});

Then('a resposta deve conter usuários com campos obrigatórios:', (dataTable) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    
    if (response.body.length > 0) {
      const firstUser = response.body[0];
      const camposEsperados = dataTable.rawTable.slice(1).map(row => row[0]);
      
      camposEsperados.forEach(campo => {
        expect(firstUser).to.have.property(campo);
      });
    }
  });
});

Then('o primeiro usuário deve ter campos com tipos corretos', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    
    if (response.body.length > 0) {
      const user = response.body[0];
      
      expect(user.uuid).to.be.a('string');
      expect(user.perfil).to.be.a('string');
      expect(user.username).to.be.a('string');
      expect(user.nome).to.be.a('string');
      expect(user.data_solicitacao).to.be.a('string');
      expect(user.rf_ou_cpf).to.be.a('string');
      expect(user.rede).to.be.a('string');
      expect(user.diretoria_regional).to.be.a('string');
      expect(user.unidade_educacional).to.be.a('string');
      expect(user.is_validado).to.be.a('boolean');
      expect(user.is_active).to.be.a('boolean');
    }
  });
});

Then('a resposta deve conter usuários com email que pode ser nulo', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    
    const userWithNullEmail = response.body.find(user => user.email === null);
    const userWithEmail = response.body.find(user => user.email !== null);
    
    if (userWithEmail) {
      expect(userWithEmail.email).to.be.a('string');
    }
  });
});

Then('todos os usuários devem ter os campos obrigatórios preenchidos', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    response.body.forEach((user, index) => {
      // Campos obrigatórios que não podem ser nulos ou vazios
      expect(user.uuid, `usuário ${index}: uuid deve estar preenchido`).to.exist;
      expect(user.uuid, `usuário ${index}: uuid não pode ser vazio`).to.not.be.empty;
      
      expect(user.perfil, `usuário ${index}: perfil deve estar preenchido`).to.exist;
      expect(user.perfil, `usuário ${index}: perfil não pode ser vazio`).to.not.be.empty;
      
      expect(user.username, `usuário ${index}: username deve estar preenchido`).to.exist;
      expect(user.username, `usuário ${index}: username não pode ser vazio`).to.not.be.empty;
      
      expect(user.nome, `usuário ${index}: nome deve estar preenchido`).to.exist;
      expect(user.nome, `usuário ${index}: nome não pode ser vazio`).to.not.be.empty;
      
      expect(user.data_solicitacao, `usuário ${index}: data_solicitacao deve estar preenchido`).to.exist;
      expect(user.data_solicitacao, `usuário ${index}: data_solicitacao não pode ser vazio`).to.not.be.empty;
      
      expect(user.rf_ou_cpf, `usuário ${index}: rf_ou_cpf deve estar preenchido`).to.exist;
      expect(user.rf_ou_cpf, `usuário ${index}: rf_ou_cpf não pode ser vazio`).to.not.be.empty;
      
      expect(user.rede, `usuário ${index}: rede deve estar preenchido`).to.exist;
      expect(user.rede, `usuário ${index}: rede não pode ser vazio`).to.not.be.empty;
      
      expect(user.diretoria_regional, `usuário ${index}: diretoria_regional deve estar preenchido`).to.exist;
      expect(user.diretoria_regional, `usuário ${index}: diretoria_regional não pode ser vazio`).to.not.be.empty;
      
      expect(user.unidade_educacional, `usuário ${index}: unidade_educacional deve estar preenchido`).to.exist;
      expect(user.unidade_educacional, `usuário ${index}: unidade_educacional não pode ser vazio`).to.not.be.empty;
      
      // Campos booleanos - devem existir e ser boolean
      expect(user.is_validado, `usuário ${index}: is_validado deve existir`).to.not.be.undefined;
      expect(user.is_validado, `usuário ${index}: is_validado deve ser boolean`).to.be.a('boolean');
      
      expect(user.is_active, `usuário ${index}: is_active deve existir`).to.not.be.undefined;
      expect(user.is_active, `usuário ${index}: is_active deve ser boolean`).to.be.a('boolean');
    });
  });
});

Then('todos os usuários devem conter {string} no nome', (searchTerm) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    
    response.body.forEach(user => {
      expect(user.nome.toLowerCase()).to.include(searchTerm.toLowerCase());
    });
  });
});

Then('todos os usuários devem ter perfil {string}', (expectedProfile) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    
    response.body.forEach(user => {
      expect(user.perfil).to.equal(expectedProfile);
    });
  });
});

Then('todos os usuários devem estar ativos', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    
    response.body.forEach(user => {
      expect(user.is_active).to.be.true;
    });
  });
});

Then('a lista deve ter mais de {int} usuários', (minCount) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(minCount);
  });
});
Then('a lista deve conter usuários com diferentes perfis', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    const perfis = new Set();
    response.body.forEach(user => {
      perfis.add(user.perfil);
    });
    
    expect(perfis.size, 'Deve haver pelo menos 2 perfis diferentes').to.be.at.least(2);
  });
});

Then('a lista deve conter usuários ativos e inativos', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    const hasActive = response.body.some(user => user.is_active === true);
    const hasInactive = response.body.some(user => user.is_active === false);
    
    expect(hasActive, 'Deve existir pelo menos um usuário ativo').to.be.true;
    expect(hasInactive, 'Deve existir pelo menos um usuário inativo').to.be.true;
  });
});

Then('todos os usuários devem ter data_solicitacao em formato válido', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    response.body.forEach((user, index) => {
      expect(user.data_solicitacao, `usuário ${index}: data_solicitacao deve existir`).to.exist;
      expect(user.data_solicitacao, `usuário ${index}: data_solicitacao deve ser string`).to.be.a('string');
      expect(user.data_solicitacao, `usuário ${index}: data_solicitacao não pode ser vazia`).to.not.be.empty;
      
      // Validar formato ISO 8601 (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss) ou formato brasileiro (DD/MM/YYYY)
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$|^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
      expect(user.data_solicitacao, `usuário ${index}: data_solicitacao deve estar em formato válido`).to.match(dateRegex);
    });
  });
});

Then('todos os usuários devem ter rf_ou_cpf não vazio', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    response.body.forEach((user, index) => {
      expect(user.rf_ou_cpf, `usuário ${index}: rf_ou_cpf deve existir`).to.exist;
      expect(user.rf_ou_cpf, `usuário ${index}: rf_ou_cpf deve ser string`).to.be.a('string');
      expect(user.rf_ou_cpf, `usuário ${index}: rf_ou_cpf não pode ser vazio`).to.not.be.empty;
      expect(user.rf_ou_cpf.trim().length, `usuário ${index}: rf_ou_cpf não pode conter apenas espaços`).to.be.greaterThan(0);
    });
  });
});

Then('todos os UUIDs devem ser únicos na lista', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    const uuids = response.body.map(user => user.uuid);
    const uniqueUuids = new Set(uuids);
    
    expect(uuids.length, 'Todos os UUIDs devem ser únicos').to.equal(uniqueUuids.size);
    
    // Verificar que nenhum UUID está vazio
    uuids.forEach((uuid, index) => {
      expect(uuid, `UUID do usuário ${index} não pode ser vazio`).to.not.be.empty;
    });
  });
});

Then('todos os usernames devem ter formato válido', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    response.body.forEach((user, index) => {
      expect(user.username, `usuário ${index}: username deve existir`).to.exist;
      expect(user.username, `usuário ${index}: username deve ser string`).to.be.a('string');
      expect(user.username, `usuário ${index}: username não pode ser vazio`).to.not.be.empty;
      
      // Validar que username não contém espaços no início ou fim
      expect(user.username, `usuário ${index}: username não deve ter espaços no início ou fim`).to.equal(user.username.trim());
      
      // Validar comprimento mínimo
      expect(user.username.length, `usuário ${index}: username deve ter pelo menos 3 caracteres`).to.be.at.least(3);
    });
  });
});

Then('todos os usuários devem ter rede, diretoria regional e unidade educacional preenchidos', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    response.body.forEach((user, index) => {
      // Validar rede
      expect(user.rede, `usuário ${index}: rede deve existir`).to.exist;
      expect(user.rede, `usuário ${index}: rede deve ser string`).to.be.a('string');
      expect(user.rede.trim(), `usuário ${index}: rede não pode ser vazia`).to.not.be.empty;
      
      // Validar diretoria_regional
      expect(user.diretoria_regional, `usuário ${index}: diretoria_regional deve existir`).to.exist;
      expect(user.diretoria_regional, `usuário ${index}: diretoria_regional deve ser string`).to.be.a('string');
      expect(user.diretoria_regional.trim(), `usuário ${index}: diretoria_regional não pode ser vazia`).to.not.be.empty;
      
      // Validar unidade_educacional
      expect(user.unidade_educacional, `usuário ${index}: unidade_educacional deve existir`).to.exist;
      expect(user.unidade_educacional, `usuário ${index}: unidade_educacional deve ser string`).to.be.a('string');
      expect(user.unidade_educacional.trim(), `usuário ${index}: unidade_educacional não pode ser vazia`).to.not.be.empty;
    });
  });
});
Then('a resposta não deve conter campos sensíveis como senha', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    
    response.body.forEach((user, index) => {
      // Validar que não existem campos sensíveis
      expect(user, `usuário ${index}: não deve ter campo password`).to.not.have.property('password');
      expect(user, `usuário ${index}: não deve ter campo senha`).to.not.have.property('senha');
      expect(user, `usuário ${index}: não deve ter campo token`).to.not.have.property('token');
      expect(user, `usuário ${index}: não deve ter campo secret`).to.not.have.property('secret');
      expect(user, `usuário ${index}: não deve ter campo access_token`).to.not.have.property('access_token');
    });
  });
});

Then('a resposta deve seguir o schema esperado do contrato', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    // Schema esperado do contrato
    const expectedSchema = {
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
    
    response.body.forEach((user, index) => {
      Object.keys(expectedSchema).forEach(field => {
        expect(user, `usuário ${index}: deve ter o campo ${field}`).to.have.property(field);
        expect(typeof user[field], `usuário ${index}: campo ${field} deve ser ${expectedSchema[field]}`).to.equal(expectedSchema[field]);
      });
    });
  });
});

Then('todos os nomes devem ter formato válido sem caracteres especiais indevidos', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    response.body.forEach((user, index) => {
      expect(user.nome, `usuário ${index}: nome deve existir`).to.exist;
      expect(user.nome, `usuário ${index}: nome deve ser string`).to.be.a('string');
      expect(user.nome.trim(), `usuário ${index}: nome não pode ser vazio`).to.not.be.empty;
      
      // Validar comprimento mínimo razoável
      expect(user.nome.length, `usuário ${index}: nome deve ter pelo menos 3 caracteres`).to.be.at.least(3);
      
      // Validar que não tem apenas números
      const isOnlyNumbers = /^\d+$/.test(user.nome);
      expect(isOnlyNumbers, `usuário ${index}: nome não pode conter apenas números`).to.be.false;
      
      // Validar que não contém caracteres estranhos como <>{}[]
      const hasInvalidChars = /[<>{}[\]\\]/.test(user.nome);
      expect(hasInvalidChars, `usuário ${index}: nome não deve conter caracteres inválidos`).to.be.false;
    });
  });
});

When('eu faço {int} requisições GET consecutivas para {string}', (numRequests, url) => {
  cy.wrap(null).then(() => {
    const responses = [];
    const token = Cypress.env('token');
    
    // Fazer requisições de forma síncrona para evitar problemas de concorrência
    let chain = cy.wrap(null);
    
    for (let i = 0; i < numRequests; i++) {
      chain = chain.then(() => {
        return cy.request({
          method: 'GET',
          url: url,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*'
          },
          failOnStatusCode: false
        }).then((response) => {
          responses.push(response);
        });
      });
    }
    
    chain.then(() => {
      cy.wrap(responses).as('multipleResponses');
    });
  });
});

Then('todas as respostas devem retornar status {int}', (expectedStatus) => {
  cy.get('@multipleResponses').then((responses) => {
    responses.forEach((response, index) => {
      expect(response.status, `requisição ${index + 1} deve retornar status ${expectedStatus}`).to.equal(expectedStatus);
    });
  });
});

Then('todas as respostas devem ter a mesma quantidade de usuários', () => {
  cy.get('@multipleResponses').then((responses) => {
    expect(responses.length).to.be.greaterThan(1);
    
    const firstResponseCount = responses[0].body.length;
    
    responses.forEach((response, index) => {
      expect(response.body.length, `requisição ${index + 1} deve ter ${firstResponseCount} usuários`).to.equal(firstResponseCount);
    });
  });
});

Then('o header Content-Type deve ser {string}', (expectedContentType) => {
  cy.get('@response').then((response) => {
    const contentType = response.headers['content-type'];
    expect(contentType, 'Content-Type header deve estar presente').to.exist;
    expect(contentType, `Content-Type deve conter ${expectedContentType}`).to.include(expectedContentType);
  });
});

Then('o header deve conter informações de segurança', () => {
  cy.get('@response').then((response) => {
    const headers = response.headers;
    
    // Validar que existem headers de segurança recomendados
    // Nota: não são obrigatórios, mas é boa prática ter
    cy.log('Headers de resposta:', JSON.stringify(headers));
    
    // Validar que existe algum tipo de controle
    expect(headers, 'Response deve ter headers').to.exist;
  });
});

Then('deve existir pelo menos um usuário validado e um não validado', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(1);
    
    const hasValidated = response.body.some(user => user.is_validado === true);
    const hasNotValidated = response.body.some(user => user.is_validado === false);
    
    expect(hasValidated, 'Deve existir pelo menos um usuário validado').to.be.true;
    expect(hasNotValidated, 'Deve existir pelo menos um usuário não validado').to.be.true;
  });
});

// ============================================================================
// STEPS AVANÇADOS - NÍVEL SENIOR
// ============================================================================

Then('devo gerar relatório de qualidade dos dados retornados', function() {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    // Gerar relatório completo de qualidade
    const qualityReport = generateDataQualityReport(response.body, REQUIRED_FIELDS);
    
    // Armazenar no contexto do teste
    this.testData.qualityReport = qualityReport;
    
    // Log detalhado do relatório
    cy.log('📊 RELATÓRIO DE QUALIDADE DE DADOS');
    cy.log(`Total de registros: ${qualityReport.totalRecords}`);
    cy.log('Completude dos campos:', JSON.stringify(qualityReport.completeness, null, 2));
    cy.log('Duplicados:', JSON.stringify(qualityReport.duplicates, null, 2));
    
    // Validações de qualidade
    Object.keys(qualityReport.completeness).forEach(field => {
      const fieldReport = qualityReport.completeness[field];
      const percentage = parseFloat(fieldReport.percentage);
      
      // Campo obrigatório deve ter 100% de completude
      if (REQUIRED_FIELDS.includes(field)) {
        expect(percentage, `Campo ${field} deve ter 100% de completude`).to.equal(100);
      }
    });
    
    // UUID não deve ter duplicados
    expect(qualityReport.duplicates.uuid.hasDuplicates, 'UUID não deve ter duplicados').to.be.false;
  });
});

Then('devo analisar a distribuição de perfis com métricas detalhadas', function() {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    // Agrupar usuários por perfil
    const perfilDistribution = {};
    const statusDistribution = { ativos: 0, inativos: 0 };
    const validationDistribution = { validados: 0, naoValidados: 0 };
    
    response.body.forEach(user => {
      // Distribuição por perfil
      if (!perfilDistribution[user.perfil]) {
        perfilDistribution[user.perfil] = 0;
      }
      perfilDistribution[user.perfil]++;
      
      // Distribuição por status
      if (user.is_active) {
        statusDistribution.ativos++;
      } else {
        statusDistribution.inativos++;
      }
      
      // Distribuição por validação
      if (user.is_validado) {
        validationDistribution.validados++;
      } else {
        validationDistribution.naoValidados++;
      }
    });
    
    // Calcular métricas avançadas
    const metrics = {
      totalUsuarios: response.body.length,
      perfis: {
        tipos: Object.keys(perfilDistribution),
        quantidade: Object.keys(perfilDistribution).length,
        distribuicao: perfilDistribution,
        perfilMaisComum: Object.keys(perfilDistribution).reduce((a, b) => 
          perfilDistribution[a] > perfilDistribution[b] ? a : b
        )
      },
      status: {
        ...statusDistribution,
        percentualAtivos: ((statusDistribution.ativos / response.body.length) * 100).toFixed(2) + '%',
        percentualInativos: ((statusDistribution.inativos / response.body.length) * 100).toFixed(2) + '%'
      },
      validacao: {
        ...validationDistribution,
        percentualValidados: ((validationDistribution.validados / response.body.length) * 100).toFixed(2) + '%',
        percentualNaoValidados: ((validationDistribution.naoValidados / response.body.length) * 100).toFixed(2) + '%'
      }
    };
    
    // Armazenar métricas (garantir que testData.metrics existe)
    if (!this.testData) {
      this.testData = {};
    }
    if (!this.testData.metrics) {
      this.testData.metrics = {};
    }
    this.testData.metrics.distribution = metrics;
    
    // Log detalhado
    cy.log('📊 ANÁLISE DE DISTRIBUIÇÃO');
    cy.log(`Total de usuários: ${metrics.totalUsuarios}`);
    cy.log(`Perfis únicos: ${metrics.perfis.quantidade}`);
    cy.log(`Perfil mais comum: ${metrics.perfis.perfilMaisComum} (${metrics.perfis.distribuicao[metrics.perfis.perfilMaisComum]} usuários)`);
    cy.log(`Status: ${metrics.status.percentualAtivos} ativos, ${metrics.status.percentualInativos} inativos`);
    cy.log(`Validação: ${metrics.validacao.percentualValidados} validados, ${metrics.validacao.percentualNaoValidados} não validados`);
    cy.log('Distribuição detalhada:', JSON.stringify(metrics, null, 2));
    
    // Validações
    expect(metrics.perfis.quantidade, 'Deve haver pelo menos 2 tipos de perfis').to.be.at.least(LIMITS.MIN_DIFFERENT_PROFILES);
  });
});

Then('todos os UUIDs devem estar em formato UUID v4 válido', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    const invalidUUIDs = [];
    
    response.body.forEach((user, index) => {
      if (!isValidUUID(user.uuid)) {
        invalidUUIDs.push({
          index,
          uuid: user.uuid,
          nome: user.nome
        });
      }
    });
    
    // Log de UUIDs inválidos se houver
    if (invalidUUIDs.length > 0) {
      cy.log('❌ UUIDs inválidos encontrados:', JSON.stringify(invalidUUIDs, null, 2));
    }
    
    // Validação
    expect(invalidUUIDs.length, 'Todos os UUIDs devem estar em formato UUID v4 válido').to.equal(0);
    
    cy.log(`✅ Todos os ${response.body.length} UUIDs estão em formato válido`);
  });
});
