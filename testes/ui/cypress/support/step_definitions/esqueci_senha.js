import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import Esqueci_Senha_Localizadores from '../locators/esqueci_senha_locators';
import { mockPostRequest } from '../utils/interceptMock';
import { typeInput } from '../utils/typeInput';

const locators = new Esqueci_Senha_Localizadores();

// Ignora erro de "Cannot read properties of undefined"
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes("Cannot read properties of undefined")) return false;
});

Given('que eu acesso o sistema', () => {
  cy.login_gipe();
});

When('o usuário clica no link {string}', () => {
  cy.xpath(locators.link_esqueci_senha()).click();
});

When('o usuário preenche o campo RF com {string}', (valor) => {
  typeInput(locators.input_rf(), valor); // usa a função genérica
});

When('clica no botão continuar', () => {
  mockPostRequest(
    'https://qa-gipe.sme.prefeitura.sp.gov.br/recuperar-senha',
    'resetEmail',
    {
      success: true,
      message: 'Simulação: requisição de reset disparada (nenhum e-mail real enviado).'
    }
  );

  cy.get(locators.botao_continuar()).click();
});

Then('o sistema deve mostrar a mensagem {string}', (mensagem) => {
  cy.wait('@resetEmail').then((interception) => {
    const response = interception.response.body[1];
    expect(response).to.have.property('success', true);
    expect(response.message).to.contain('Simulação');
  });
});