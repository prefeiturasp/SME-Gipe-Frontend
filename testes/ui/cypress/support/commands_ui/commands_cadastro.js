import Cadastro_Localizadores from '../locators/login_locators'  // parece que o arquivo está errado, deveria ser cadastro_locators

const cadastroLocalizadores = new Cadastro_Localizadores()

Cypress.Commands.add('cadastro_gipe', () => {
  cy.visit('/cadastro')
})