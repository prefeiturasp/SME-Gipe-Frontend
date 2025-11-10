import '@shelex/cypress-allure-plugin'
import "cypress-cloud/support"
import './commands_ui/commands_login'
import './commands_ui/commands_cadastro'
import 'cypress-xpath'
import 'cypress-plugin-tab'

import postgreSQL from 'cypress-postgresql';

postgreSQL.loadDBCommands();

// Screenshot em falha de teste
afterEach(function() {
  if (this.currentTest.state === 'failed') {
    const testName = this.currentTest.title || 'teste-sem-titulo';
    const specName = Cypress.spec.name.replace('.feature', '').replace(/\s+/g, '-');
    cy.screenshot(`falha-${specName}-${testName}`, {
      capture: 'fullPage'
    })
  }
})

// Screenshot em erro não capturado
Cypress.on('fail', (error, runnable) => {
  cy.screenshot(`falha-${runnable.parent.title}-${runnable.title}`, {
    capture: 'fullPage'
  })
  throw error
})



