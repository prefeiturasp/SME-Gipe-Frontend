export default Alterar_Email_Localizadores;


import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../locators/login_locators'
import Alterar_Senha_Localizadores from '../locators/alterar_senha_locators';
import Alterar_Email_Localizadores from '../locators/alterar_email_locators';

const locators = new Login_Gipe_Localizadores()
const locators_alterar_senha = new Alterar_Senha_Localizadores()
const locators_alterar_email = new Alterar_Email_Localizadores()

Given("que o usuário realizou o login com sucesso", () => {
  cy.login_gipe()
  cy.get(locators.campo_usuario()).type('7210418')
  cy.get(locators.campo_senha()).type('Sgp0418')
  cy.get('button').filter((_, el) => el.innerText.trim() === 'Acessar').click()
  cy.url().should("include", "/dashboard");
});

Given("o usuário está na página principal do sistema", () => {
  cy.url().should("include", "/dashboard");
});

When("o usuário clica no botão {string}", () => {
  cy.xpath(locators_alterar_senha.link_alterar_senha()).click();
});

When("quando ele clica no botão {string}", () => {
  cy.xpath(locators_alterar_email.botao_alterar_email()).click();
});

When("preenche o campo E-mail com {string}", (valor) => {
  cy.get(locators_alterar_email.imput_email(valor))
    .type(valor, { delay: 0 });
});

Then("o sistema o sistema deve apresentar a mensagem alertando o usuário sobre a alteração do e-mail", () => {
    cy.contains('span', 'Importante: Ao alterar o e-mail').should('be.visible')
});