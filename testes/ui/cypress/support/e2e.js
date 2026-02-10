import '@shelex/cypress-allure-plugin'
import "cypress-cloud/support"
import './commands'  // ⭐ Comandos customizados
import './commands_ui/commands_login'
import './commands_ui/commands_cadastro'
import 'cypress-xpath'
import 'cypress-plugin-tab'

import postgreSQL from 'cypress-postgresql';

postgreSQL.loadDBCommands();

import './api/commands'

let screenshotTaken = false

Cypress.on('test:before:run', () => {
  screenshotTaken = false
})

Cypress.on('fail', (error, runnable) => {
  if (!screenshotTaken) {
    const fileName = `ERRO - ${runnable.parent.title} - ${runnable.title}`.replace(/[^a-z0-9]/gi, '_')
    
    cy.document().then((doc) => {
      const activeElement = doc.activeElement
      const bodyElement = doc.body
      
      if (activeElement && activeElement !== bodyElement) {
        activeElement.style.border = '3px solid red'
        activeElement.style.boxShadow = '0 0 10px red'
        
        cy.screenshot(fileName, {
          capture: 'fullPage',
          overwrite: true
        })
      } else {
        cy.screenshot(fileName, {
          capture: 'fullPage',
          overwrite: true
        })
      }
    })
    
    screenshotTaken = true
  }
  
  throw error
})

