import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import locators from '../locators/django_admin_locators'

Given('acesso a página de administração do Django', () => {
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/api-intercorrencias/v1/admin/login/?next=/api-intercorrencias/v1/admin/')
  cy.wait(2000)
})

Then('devo ver o título {string}', (tituloEsperado) => {
  if (tituloEsperado === 'Administração do Site' || 
      tituloEsperado === 'Selecione Declarante para modificar' ||
      tituloEsperado === 'Selecione Envolvido para modificar') {
    cy.xpath('/html/body/div/div/main/div/h1', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', tituloEsperado)
    cy.log(`[INFO] Título validado: ${tituloEsperado}`)
  } else {
    cy.get(locators.titulo_site_name(), { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', tituloEsperado)
    cy.log(`[INFO] Título validado: ${tituloEsperado}`)
  }
})

When('insiro as credenciais do Django Admin', () => {
  cy.log('[INFO] Inserindo credenciais do Django Admin')
  
  // Inserir usuário
  cy.get(locators.input_username(), { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type('usr_spassu', { delay: 100 })
  cy.wait(500)
  
  // Inserir senha
  cy.get(locators.input_password(), { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type('Esc@l@#271170', { delay: 100 })
  cy.wait(500)
  
  cy.log('[INFO] Credenciais inseridas com sucesso')
})

When('clico no botão de login do Django {string}', (textoBotao) => {
  cy.xpath(locators.btn_login(), { timeout: 10000 })
    .should('be.visible')
    .should('have.value', textoBotao)
    .click()
  cy.wait(3000)
  cy.log(`[INFO] Clicou no botão: ${textoBotao}`)
})

// ===== STEPS PARA NAVEGAÇÃO PÓS-LOGIN =====

Then('devo ver o módulo {string}', (nomeModulo) => {
  cy.get(locators.link_modulo_intercorrencias(), { timeout: 10000 })
    .should('be.visible')
    .should('contain.text', nomeModulo)
  cy.log(`[INFO] Módulo encontrado: ${nomeModulo}`)
})

When('clico no módulo {string}', (nomeModulo) => {
  cy.get(locators.link_modulo_intercorrencias(), { timeout: 10000 })
    .should('be.visible')
    .should('contain.text', nomeModulo)
    .click()
  cy.wait(2000)
  cy.log(`[INFO] Clicou no módulo: ${nomeModulo}`)
})

When('clico no link do Django Admin {string}', (textoLink) => {
  if (textoLink === 'Declarantes') {
    cy.get(locators.link_declarantes(), { timeout: 10000 })
      .should('be.visible')
      .click()
    cy.wait(2000)
    cy.log(`[INFO] Clicou em: ${textoLink}`)
  } else if (textoLink === 'Envolvidos') {
    cy.get(locators.link_envolvidos(), { timeout: 10000 })
      .should('be.visible')
      .click()
    cy.wait(2000)
    cy.log(`[INFO] Clicou em: ${textoLink}`)
  }
})

When('clico em adicionar novo declarante', () => {
  cy.get(locators.btn_adicionar_declarante(), { timeout: 10000 })
    .should('be.visible')
    .click()
  cy.wait(2000)
  cy.log('[INFO] Clicou em adicionar novo declarante')
})

When('preencho o campo declarante com {string}', (textoDeclarante) => {
  cy.get(locators.input_declarante(), { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(textoDeclarante, { delay: 100 })
  cy.wait(500)
  cy.log(`[INFO] Campo declarante preenchido com: ${textoDeclarante}`)
})

When('clico no botão salvar declarante', () => {
  cy.get(locators.btn_salvar_declarante(), { timeout: 10000 })
    .should('be.visible')
    .click()
  cy.wait(2000)
  cy.log('[INFO] Clicou no botão salvar')
})

Then('devo ver mensagem de sucesso', () => {
  cy.get(locators.mensagem_sucesso(), { timeout: 10000 })
    .should('be.visible')
  cy.log('[INFO] Mensagem de sucesso validada')
})

// ===== STEPS PARA ENVOLVIDOS =====

When('clico em adicionar envolvido', () => {
  cy.get(locators.btn_adicionar_envolvido(), { timeout: 10000 })
    .should('be.visible')
    .click()
  cy.wait(2000)
  cy.log('[INFO] Clicou em adicionar novo envolvido')
})

When('preencho o campo Envolvidos com {string}', (textoEnvolvido) => {
  cy.get(locators.input_envolvidos(), { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(textoEnvolvido, { delay: 100 })
  cy.wait(500)
  cy.log(`[INFO] Campo Envolvidos preenchido com: ${textoEnvolvido}`)
})

When('clico no botão salvar', () => {
  cy.xpath(locators.btn_salvar_envolvido(), { timeout: 10000 })
    .should('be.visible')
    .click()
  cy.wait(2000)
  cy.log('[INFO] Clicou no botão salvar envolvido')
})

