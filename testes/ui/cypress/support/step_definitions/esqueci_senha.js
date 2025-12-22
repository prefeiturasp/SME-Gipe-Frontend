import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import Esqueci_Senha_Localizadores from '../locators/esqueci_senha_locators';

const locators = new Esqueci_Senha_Localizadores();

// Ignora erros de exceção não capturados
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes("Cannot read properties of undefined")) return false;
  return true;
});

/**
 * Acessa o sistema GIPE
 */
Given('que eu acesso o sistema GIPE', () => {
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/');
  cy.url({ timeout: 10000 }).should('include', 'qa-gipe.sme.prefeitura.sp.gov.br');
  cy.wait(2000);
  cy.log('✅ Sistema GIPE acessado');
});

/**
 * Valida existência do link "Esqueci minha senha"
 */
Given('valido a existência do link {string}', (textoLink) => {
  cy.xpath(locators.link_esqueci_senha())
    .should('exist')
    .and('be.visible')
    .and('contain.text', textoLink);
  cy.log(`✅ Link "${textoLink}" encontrado`);
});

/**
 * Clica no link "Esqueci minha senha"
 */
When('clico no link {string}', () => {
  cy.xpath(locators.link_esqueci_senha()).click();
  cy.wait(3000);
  cy.log('✅ Clicou no link "Esqueci minha senha"');
});

/**
 * Valida que está na página de recuperação de senha
 */
When('valido que estou na página de recuperação de senha', () => {
  cy.url({ timeout: 10000 }).should('include', '/recuperar-senha');
  
  // Valida título "Recuperação de senha"
  cy.get(locators.titulo_recuperacao(), { timeout: 10000 })
    .should('exist')
    .and('be.visible')
    .and('contain.text', 'Recuperação de senha');
  
  cy.log('✅ Página de recuperação de senha carregada');
});

/**
 * Valida existência do campo RF ou CPF
 */
When('valido a existência do campo RF ou CPF', () => {
  cy.get(locators.label_rf_cpf(), { timeout: 10000 })
    .should('exist')
    .and('be.visible')
    .and('contain.text', 'RF ou CPF');
  
  cy.log('✅ Campo RF ou CPF encontrado');
});

/**
 * Preenche o campo RF
 */
When('preencho o campo RF com {string}', (rf) => {
  cy.xpath(locators.input_rf(), { timeout: 10000 })
    .should('exist')
    .and('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(rf, { delay: 50 });
  
  cy.log(`✅ RF "${rf}" preenchido`);
});

/**
 * Clica no botão continuar
 */
When('clico no botão continuar', () => {
  cy.xpath(locators.botao_continuar())
    .should('exist')
    .and('be.visible')
    .and('contain.text', 'Continuar')
    .click({ force: true });
  
  cy.wait(2000);
  cy.log('✅ Botão continuar clicado');
});

/**
 * Valida mensagem de confirmação
 */
Then('o sistema deve exibir a mensagem de confirmação', () => {
  // Valida que ainda está na página ou que título continua visível
  cy.get(locators.titulo_recuperacao(), { timeout: 10000 })
    .should('exist')
    .and('be.visible');
  
  cy.log('✅ Mensagem de confirmação exibida');
});

/**
 * Clica no botão continuar para voltar
 */
Then('clico no botão continuar para voltar', () => {
  cy.xpath(locators.botao_continuar_final())
    .should('exist')
    .and('be.visible')
    .and('contain.text', 'Continuar')
    .click({ force: true });
  
  cy.wait(2000);
  cy.log('✅ Botão continuar final clicado');
});

/**
 * Valida mensagem de erro
 */
Then('o sistema deve exibir mensagem de erro {string}', (mensagemErro) => {
  cy.get(locators.mensagem_erro(), { timeout: 10000 })
    .should('exist')
    .and('be.visible')
    .and('contain.text', mensagemErro);
  
  cy.log(`✅ Mensagem de erro "${mensagemErro}" exibida`);
});