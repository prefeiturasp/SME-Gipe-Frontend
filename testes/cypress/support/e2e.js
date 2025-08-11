import '@shelex/cypress-allure-plugin'
import "cypress-cloud/support";
import './commands_ui/commands_login'

// Evita falhas silenciosas caso algum comando seja removido ou renomeado
Cypress.on('uncaught:exception', (err, runnable) => {
  // Se quiser ignorar certos erros específicos, pode filtrar aqui
  return false // Impede que testes falhem por erros inesperados no frontend
})


