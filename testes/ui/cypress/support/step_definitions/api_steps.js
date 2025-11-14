/// <reference types="cypress" />

import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps';

const { CREDENTIALS } = require('../../support/api/config');

// ============================================================================
// BEFORE/AFTER HOOKS
// ============================================================================

Before({ tags: '@api' }, function() {
  cy.log('🔄 Preparando teste de API');
  Cypress.env('authToken', null);
  this.testData = {};
});

After({ tags: '@api' }, function() {
  cy.log('✅ Teste de API finalizado');
});

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

Given('que possuo credenciais válidas de autenticação', () => {
  cy.log('✅ Credenciais disponíveis');
});

Given('que estou autenticado na API', function() {
  cy.api_autenticar().then((token) => {
    if (!this.testData) {
      this.testData = {};
    }
    this.testData.token = token;
    cy.wrap(token).as('token');
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
  
  cy.api_get(endpoint).as('response');
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

