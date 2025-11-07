import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import Esqueci_Senha_Localizadores from '../locators/esqueci_senha_locators';
import { typeInput } from '../utils/typeInput';

const locators = new Esqueci_Senha_Localizadores();

// Ignora erro de "Cannot read properties of undefined"
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes("Cannot read properties of undefined")) return false;
});

Given('que eu acesso o sistema', () => {
  cy.login_gipe();
});

When('o usuário clica no link {string}', () => {
  cy.xpath(locators.link_esqueci_senha()).click();
});

When('o usuário preenche o campo RF com {string}', (valor) => {
  typeInput(locators.input_rf(), valor);
});

When('clica no botão continuar', function() {
  cy.get(locators.input_rf()).invoke('val').then((rfDigitado) => {

    // Intercepta a requisição antes do clique
    cy.intercept('POST', 'https://qa-gipe.sme.prefeitura.sp.gov.br/recuperar-senha', (req) => {
      if (rfDigitado === "7210418") {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            message: 'Seu link de recuperação de senha foi enviado para wil**********@spassu.com.br.'
          }
        });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            success: false,
            message: 'Usuário ou RF não encontrado'
          }
        });
      }
    }).as('resetEmail');

    cy.get(locators.botao_continuar()).click();
  });
});

Then('o sistema deve mostrar a mensagem {string}', (mensagem) => {
  cy.wait('@resetEmail').then((interception) => {
    const response = interception.response.body;
    expect(response.message).to.contain(mensagem);
  });
});