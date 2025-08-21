import Cadastro_Localizadores from '../locators/login_locators'

const cadastroLocalizadores = new Cadastro_Localizadores()

Cypress.Commands.add('cadastro_gipe', () => {
  cy.visit('/cadastro')
})