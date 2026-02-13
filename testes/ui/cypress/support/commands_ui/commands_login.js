import Login_Gipe_Localizadores from '../locators/login_locators'

const loginLocalizadores = new Login_Gipe_Localizadores()

Cypress.Commands.add('login_gipe', () => {
    // Intercepta requisições problemáticas
    cy.intercept('**/*recuperar-senha*', { statusCode: 200, body: '' })
    cy.intercept('**/*cadastro*', { statusCode: 200, body: '' })
    
    // Visita a página com timeout aumentado
    cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br', { 
        timeout: 120000,
        failOnStatusCode: false
    })
    

    cy.get('input[placeholder*="RF"], input[placeholder*="CPF"]', { timeout: 20000 })
        .should('exist')
    
    cy.log(' Página de login carregada')
})

// Auto-login opcional: se as variáveis de ambiente estiverem presentes, preenche e envia o formulário
Cypress.Commands.add('login_gipe_auto', () => {
    const doAuto = Cypress.env('AUTO_LOGIN') !== false
    if (!doAuto) return cy.log('Auto-login desabilitado por config')

    const rf = Cypress.env('RF_VALIDO') || '39411157076'
    const senha = Cypress.env('SENHA_VALIDA') || 'Sgp7076'

    cy.log('Tentando auto-login com credenciais de ambiente')
    cy.get(loginLocalizadores.campo_usuario(), { timeout: 20000 }).then(($el) => {
        if ($el.length > 0) {
            cy.get(loginLocalizadores.campo_usuario()).clear().type(rf, { delay: 50 })
            cy.get(loginLocalizadores.campo_senha()).clear().type(senha, { delay: 50 })
            // clica no botão Acessar procurando pelo texto visível
            cy.get('button', { timeout: 10000 })
                .filter((_, el) => el.innerText && el.innerText.trim() === 'Acessar')
                .first()
                .should('be.visible')
                .click({ force: true })
            cy.wait(3000)
            // garantir que o dashboard fique disponível
            cy.url({ timeout: 30000 }).should('include', '/dashboard')
        } else {
            cy.log('Campo de usuário não encontrado — não foi possível auto-logar')
        }
    })
})

Cypress.Commands.add('dados_de_login', (rf, senha) => {
    if (rf) cy.get(loginLocalizadores.campo_usuario()).clear().type(rf)
    if (senha) cy.get(loginLocalizadores.campo_senha()).clear().type(senha)
})

Cypress.Commands.add('clicar_botao', () => {
    cy.get(loginLocalizadores.botao_acessar())
        .should('be.visible')
        .click()
})
