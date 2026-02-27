Cypress.Commands.add('loginWithSession', (rf, senha, perfil = 'GIPE') => {
  const sessionName = `login-${perfil}-${rf}`
  
  cy.session(
    sessionName,
    () => {
      cy.log(`Executando login para ${perfil} - RF: ${rf}`)
      
      cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br', { 
        timeout: 60000,
        retryOnNetworkFailure: true,
        failOnStatusCode: false
      })
      cy.wait(3000)
      
      cy.get('input[placeholder="Digite um RF ou CPF"]', { timeout: 15000 })
        .should('be.visible')
        .clear()
        .type(rf, { delay: 100 })
      
      cy.get('input[placeholder="Digite sua senha"]', { timeout: 15000 })
        .should('be.visible')
        .clear()
        .type(senha, { delay: 100 })
      
      cy.get('button')
        .filter((_, el) => el.innerText && el.innerText.trim() === 'Acessar')
        .should('be.visible')
        .should('not.be.disabled')
        .click()
      
      cy.wait(5000)
      cy.url({ timeout: 30000 }).should('include', '/dashboard')
      cy.wait(2000)
    },
    {
      validate() {
        cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', { 
          timeout: 30000,
          failOnStatusCode: false 
        })
        cy.url({ timeout: 15000 }).should('include', '/dashboard')
        cy.get('body', { timeout: 10000 }).should('be.visible')
      },
      cacheAcrossSpecs: true
    }
  )
  
  cy.log(`Sessão restaurada para ${perfil}`)
})

Cypress.Commands.add('navigateWithCache', (path, options = {}) => {
  const { waitTime = 2000, validateUrl = true } = options
  
  cy.log(`Navegando para: ${path}`)
  cy.visit(`https://qa-gipe.sme.prefeitura.sp.gov.br${path}`, {
    timeout: 30000,
    failOnStatusCode: false,
    ...options
  })
  
  if (validateUrl) {
    cy.url({ timeout: 15000 }).should('include', path)
  }
  
  cy.wait(waitTime)
  cy.log(`Navegação concluída: ${path}`)
})

Cypress.Commands.add('waitForModal', (options = {}) => {
  const timeout = options.timeout || 20000
  const requiredText = options.text || null
  
  cy.log('Aguardando modal aparecer...')
  cy.wait(1000)
  
  cy.get('body').then(($body) => {
    const modals = $body.find('[role="dialog"], [role="alertdialog"], [data-state="open"]')
    cy.log(`Modais encontrados no DOM: ${modals.length}`)
    
    if (modals.length > 0) {
      modals.each((index, modal) => {
        cy.log(`Modal ${index + 1}: ${Cypress.$(modal).text().substring(0, 100)}...`)
      })
    }
  })
  
  return cy.get('[role="dialog"]', { timeout })
    .filter(':visible')
    .last()
    .should('be.visible')
    .then(($modal) => {
      cy.log('Modal encontrado!')
      
      if (requiredText) {
        cy.wrap($modal).should('contain.text', requiredText)
        cy.log(`Modal contém o texto: "${requiredText}"`)
      }
      
      return cy.wrap($modal)
    })
})

Cypress.Commands.add('debugPage', () => {
  cy.get('body').then(($body) => {
    cy.log('=== DEBUG DA PÁGINA ===')
    cy.log('URL atual:', cy.url())
    
    const modals = $body.find('[role="dialog"], [role="alertdialog"]')
    cy.log(`Modais no DOM: ${modals.length}`)
    
    const overlays = $body.find('[data-state="open"], .modal-overlay, .overlay')
    cy.log(`Overlays no DOM: ${overlays.length}`)
    
    const buttons = $body.find('button:visible')
    cy.log(`Botões visíveis: ${buttons.length}`)
    
    cy.log('======================')
  })
})
