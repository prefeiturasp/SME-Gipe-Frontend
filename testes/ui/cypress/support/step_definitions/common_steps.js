import { Given } from 'cypress-cucumber-preprocessor/steps'

// Step compartilhado para acessar o sistema
// Este step é usado por múltiplos testes
Given('que eu acesso o sistema', () => {
  cy.login_gipe()
  cy.wait(500)
})
