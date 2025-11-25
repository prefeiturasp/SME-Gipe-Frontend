import '@shelex/cypress-allure-plugin'
import "cypress-cloud/support"
import './commands_ui/commands_login'
import './commands_ui/commands_cadastro'
import 'cypress-xpath'
import 'cypress-plugin-tab'

import postgreSQL from 'cypress-postgresql';

postgreSQL.loadDBCommands();

// Import API commands
import './api/commands'

// Configuração para capturar screenshot apenas em falhas
let screenshotTaken = false

Cypress.on('test:before:run', () => {
  screenshotTaken = false
})

Cypress.on('fail', (error, runnable) => {
  if (!screenshotTaken) {
    const fileName = `ERRO - ${runnable.parent.title} - ${runnable.title}`.replace(/[^a-z0-9]/gi, '_')
    
    // Tenta capturar o elemento que causou o erro
    cy.document().then((doc) => {
      const activeElement = doc.activeElement
      const bodyElement = doc.body
      
      // Se houver um elemento ativo (onde o erro ocorreu), captura com destaque
      if (activeElement && activeElement !== bodyElement) {
        // Adiciona borda vermelha no elemento com erro
        activeElement.style.border = '3px solid red'
        activeElement.style.boxShadow = '0 0 10px red'
        
        cy.screenshot(fileName, {
          capture: 'fullPage',
          overwrite: true
        })
      } else {
        // Captura fullPage se não conseguir identificar o elemento específico
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



