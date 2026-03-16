describe.skip('Obter Token', () => {
  it('Login e captura de token do cookie auth_token', () => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/', {
      timeout: 30000,
      retryOnNetworkFailure: true
    })
    
    // Aguardar página carregar
    cy.wait(2000)
    
    // Preencher credenciais
    cy.get('input[placeholder="Digite um RF ou CPF"]', { timeout: 15000 })
      .should('be.visible')
      .clear()
      .type('7311559', { delay: 100 })
    
    cy.get('input[placeholder="Digite sua senha"]', { timeout: 15000 })
      .should('be.visible')
      .clear()
      .type('Sgp1559', { delay: 100 })
    
    // Clicar no botão de login
    cy.get('button')
      .filter((_, el) => el.innerText && el.innerText.trim() === 'Acessar')
      .should('be.visible')
      .should('not.be.disabled')
      .click()
    
    // Aguardar a conclusão do login
    cy.log('Aguardando conclusão do login...')
    cy.wait(5000)
    
    // Listar todos os cookies disponíveis primeiro
    cy.getAllCookies().then((cookies) => {
      cy.log(`Total de cookies encontrados: ${cookies.length}`)
      cookies.forEach(c => {
        cy.log(`Cookie: ${c.name} = ${c.value.substring(0, 30)}...`)
      })
    })
    
    // Verificar localStorage também
    cy.window().then((win) => {
      const storage = { ...win.localStorage }
      cy.log('LocalStorage:')
      Object.keys(storage).forEach(key => {
        const value = storage[key]
        cy.log(`  ${key}: ${value ? value.substring(0, 50) : 'null'}...`)
      })
    })
    
    // Aguardar mais um pouco para garantir
    cy.wait(2000)
    
    // Tentar capturar token de múltiplas fontes
    let tokenCapturado = null
    let tokenSource = null
    
    cy.getCookie('auth_token').then((cookie) => {
      if (cookie && cookie.value) {
        tokenCapturado = cookie.value
        tokenSource = 'cookie:auth_token'
        cy.log('✅ Token encontrado no cookie auth_token')
      }
    })
    
    // Se não encontrou, tentar outros cookies comuns
    cy.then(() => {
      if (!tokenCapturado) {
        cy.getCookie('token').then((cookie) => {
          if (cookie && cookie.value) {
            tokenCapturado = cookie.value
            tokenSource = 'cookie:token'
            cy.log('✅ Token encontrado no cookie token')
          }
        })
      }
    })
    
    cy.then(() => {
      if (!tokenCapturado) {
        cy.getCookie('access_token').then((cookie) => {
          if (cookie && cookie.value) {
            tokenCapturado = cookie.value
            tokenSource = 'cookie:access_token'
            cy.log('✅ Token encontrado no cookie access_token')
          }
        })
      }
    })
    
    // Tentar localStorage
    cy.then(() => {
      if (!tokenCapturado) {
        cy.window().then((win) => {
          const localToken = win.localStorage.getItem('auth_token') || 
                           win.localStorage.getItem('token') || 
                           win.localStorage.getItem('access_token') ||
                           win.localStorage.getItem('authToken')
          
          if (localToken) {
            tokenCapturado = localToken
            tokenSource = 'localStorage'
            cy.log('✅ Token encontrado no localStorage')
          }
        })
      }
    })
    
    // Tentar sessionStorage
    cy.then(() => {
      if (!tokenCapturado) {
        cy.window().then((win) => {
          const sessionToken = win.sessionStorage.getItem('auth_token') || 
                              win.sessionStorage.getItem('token') || 
                              win.sessionStorage.getItem('access_token')
          
          if (sessionToken) {
            tokenCapturado = sessionToken
            tokenSource = 'sessionStorage'
            cy.log('✅ Token encontrado no sessionStorage')
          }
        })
      }
    })
    
    // Salvar token se encontrado
    cy.then(() => {
      if (tokenCapturado) {
        cy.log('═══════════════════════════════════════')
        cy.log('✅ TOKEN CAPTURADO COM SUCESSO!')
        cy.log(`📍 Fonte: ${tokenSource}`)
        cy.log(`🔑 Token (primeiros 50 chars): ${tokenCapturado.substring(0, 50)}...`)
        cy.log('═══════════════════════════════════════')
        
        cy.writeFile('token.txt', tokenCapturado)
        
        cy.writeFile('token.json', {
          token: tokenCapturado,
          capturedAt: new Date().toISOString(),
          source: tokenSource
        })
        
        cy.log('✅ Token salvo em token.txt e token.json')
      } else {
        cy.log('❌ ERRO: Token não encontrado em nenhuma fonte!')
        cy.log('Verifique se o login foi bem-sucedido')
        
        // Listar todos os cookies e storage novamente para debug
        cy.getAllCookies().then((cookies) => {
          cy.log('=== TODOS OS COOKIES ===')
          cookies.forEach(c => {
            cy.log(`  ${c.name}: ${c.value.substring(0, 50)}...`)
          })
        })
        
        cy.window().then((win) => {
          cy.log('=== LOCAL STORAGE ===')
          Object.keys(win.localStorage).forEach(key => {
            cy.log(`  ${key}: ${win.localStorage.getItem(key).substring(0, 50)}...`)
          })
          
          cy.log('=== SESSION STORAGE ===')
          Object.keys(win.sessionStorage).forEach(key => {
            cy.log(`  ${key}: ${win.sessionStorage.getItem(key).substring(0, 50)}...`)
          })
        })
        
        // Falhar o teste se não encontrou token
        throw new Error('Token de autenticação não encontrado após login')
      }
    })
  })
})
