import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../locators/login_locators'

const locators = new Login_Gipe_Localizadores()

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

Then("o sistema deve mostrar a listagem de ocorrências cadastradas no sistema", () => {
  cy.get('h1').contains('Intercorrências Institucionais').should('be.visible');
});