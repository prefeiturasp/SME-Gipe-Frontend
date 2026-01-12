describe.skip('Obter Token', () => {
  it('Login e captura de token do cookie auth_token', () => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/', {
      timeout: 30000,
      retryOnNetworkFailure: true
    })
    cy.wait(3000)
    
    cy.get('input[placeholder="Digite um RF ou CPF"]', { timeout: 15000 })
      .should('be.visible')
      .clear()
      .type('05481179342')
    
    cy.get('input[placeholder="Digite sua senha"]', { timeout: 15000 })
      .should('be.visible')
      .clear()
      .type('Sgp9342')
    
    cy.get('button')
      .filter((_, el) => el.innerText && el.innerText.trim() === 'Acessar')
      .should('be.visible')
      .click()
    
    cy.url({ timeout: 30000 }).should('include', '/dashboard')
    cy.wait(5000)
    
    cy.getCookie('auth_token').then((cookie) => {
      if (cookie && cookie.value) {
        const token = cookie.value
        cy.log('TOKEN CAPTURADO DO COOKIE auth_token')
        cy.log(`Token: ${token.substring(0, 50)}...`)
        cy.log(`Token completo: ${token}`)
        cy.writeFile('token.txt', token)
        
        cy.writeFile('token.json', {
          token: token,
          capturedAt: new Date().toISOString(),
          source: 'cookie:auth_token'
        })
      } else {
        cy.log('Cookie auth_token nao encontrado')
        
        cy.getAllCookies().then((cookies) => {
          cy.log('Cookies disponíveis:')
          cookies.forEach(c => {
            cy.log(`  - ${c.name}: ${c.value.substring(0, 50)}...`)
          })
        })
      }
    })
  })
})
